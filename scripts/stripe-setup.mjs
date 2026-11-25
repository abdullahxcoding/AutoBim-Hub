#!/usr/bin/env node
/**
 * Creates (or updates) every tool's Stripe product and its monthly +
 * yearly price, using the prices in src/data/products.js.
 *
 * Each price gets the lookup key "<slug>_month" / "<slug>_year", which
 * the create-checkout function uses to find it. Safe to run again:
 * existing products/prices are reused; a changed amount creates a new
 * price and moves the lookup key to it.
 *
 * Usage (PowerShell), test mode first:
 *   $env:STRIPE_SECRET_KEY = "sk_test_..."
 *   node scripts/stripe-setup.mjs
 *
 * The key is only read from the environment for this run. Never put
 * it in a file in this repository.
 */
import { PRODUCTS } from '../src/data/products.js'

const KEY = process.env.STRIPE_SECRET_KEY
if (!KEY || !/^(sk|rk)_(test|live)_/.test(KEY)) {
  console.error('Set STRIPE_SECRET_KEY first, e.g.  $env:STRIPE_SECRET_KEY = "sk_test_..."')
  process.exit(1)
}
const MODE = KEY.includes('_live_') ? 'LIVE' : 'test'

async function stripe(method, path, params) {
  const body = params ? new URLSearchParams(params).toString() : undefined
  const url = `https://api.stripe.com/v1/${path}${method === 'GET' && body ? `?${body}` : ''}`
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: method === 'GET' ? undefined : body,
  })
  const data = await res.json()
  if (!res.ok && res.status !== 404) throw new Error(`${method} ${path}: ${data.error?.message}`)
  return res.status === 404 ? null : data
}

console.log(`Stripe ${MODE} mode\n`)

for (const p of PRODUCTS.filter((x) => x.pricing)) {
  const productId = `abh_${p.slug.replace(/-/g, '_')}`
  let product = await stripe('GET', `products/${productId}`)
  if (!product) {
    product = await stripe('POST', 'products', {
      id: productId, name: p.name, description: p.tagline, 'metadata[slug]': p.slug,
    })
    console.log(`+ product  ${p.name}`)
  } else if (product.name !== p.name) {
    await stripe('POST', `products/${productId}`, { name: p.name, description: p.tagline })
    console.log(`~ product  ${p.name} (renamed)`)
  }

  for (const interval of ['month', 'year']) {
    const lookup = `${p.slug}_${interval}`
    const cents = Math.round(p.pricing[interval] * 100)
    const currency = p.pricing.currency.toLowerCase()
    const found = await stripe('GET', 'prices', { 'lookup_keys[]': lookup, active: 'true' })
    const cur = found.data[0]
    if (cur && cur.unit_amount === cents && cur.currency === currency && cur.recurring?.interval === interval) {
      console.log(`  ok       ${lookup}  ${p.pricing[interval]} ${p.pricing.currency}`)
      continue
    }
    await stripe('POST', 'prices', {
      product: productId,
      currency,
      unit_amount: String(cents),
      'recurring[interval]': interval,
      lookup_key: lookup,
      transfer_lookup_key: 'true',
      nickname: `${p.name} (${interval}ly)`,
    })
    if (cur) await stripe('POST', `prices/${cur.id}`, { active: 'false' })
    console.log(`  ${cur ? '~ updated' : '+ created'} ${lookup}  ${p.pricing[interval]} ${p.pricing.currency}`)
  }
}

// ── Customer portal ("Manage billing") ─────────────────────────────
// Invoices, card updates, cancel at period end; plan switching OFF.
// Marked metadata[app]=autobim so the billing-portal function uses it.
const portal = {
  'business_profile[headline]': 'AutoBim Hub - manage your tool subscriptions',
  'features[invoice_history][enabled]': 'true',
  'features[payment_method_update][enabled]': 'true',
  'features[customer_update][enabled]': 'true',
  'features[customer_update][allowed_updates][0]': 'email',
  'features[customer_update][allowed_updates][1]': 'address',
  'features[subscription_cancel][enabled]': 'true',
  'features[subscription_cancel][mode]': 'at_period_end',
  'features[subscription_update][enabled]': 'false',
  'metadata[app]': 'autobim',
}
const configs = await stripe('GET', 'billing_portal/configurations', { active: 'true', limit: '100' })
const mine = configs.data.find((c) => c.metadata?.app === 'autobim')
if (mine) {
  await stripe('POST', `billing_portal/configurations/${mine.id}`, portal)
  console.log(`\n~ billing portal updated (${mine.id})`)
} else {
  const c = await stripe('POST', 'billing_portal/configurations', portal)
  console.log(`\n+ billing portal created (${c.id})`)
}

console.log('\nDone. Checkout will now find every price by its lookup key.')
