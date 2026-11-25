// ─────────────────────────────────────────────────────────────
//  Edge Function: create-checkout  (Stripe, cart)
//  Body: { slugs: string[], interval: 'month' | 'year', successUrl?, cancelUrl? }
//
//  Creates ONE Stripe Checkout Session (subscription mode) for all the
//  tools in the cart and returns its hosted URL. Charged immediately
//  (the no-card trial lives in our database, not in Stripe).
//
//  Prices are NEVER taken from the browser: each tool's price is looked
//  up in Stripe by lookup key "<slug>_<interval>" (see scripts/stripe-setup.mjs).
//
//  Deploy:  supabase functions deploy create-checkout
//  Secrets: STRIPE_SECRET_KEY
// ─────────────────────────────────────────────────────────────
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@17?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-12-18.acacia' })

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

// Only redirect back to our own site (or localhost while developing).
function safeUrl(url: unknown, fallback: string): string {
  if (typeof url !== 'string') return fallback
  try {
    const u = new URL(url)
    const site = Deno.env.get('SITE_URL')
    const ok = u.hostname === 'localhost' || u.hostname.endsWith('.vercel.app') ||
      (site && u.origin === new URL(site).origin)
    return ok ? u.toString() : fallback
  } catch {
    return fallback
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    // 1. Who is calling?
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } },
    )
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user) return json({ error: 'Please log in to check out.' }, 401)

    // 2. Validate the cart.
    const body = await req.json().catch(() => ({}))
    const interval = body.interval === 'year' ? 'year' : body.interval === 'month' ? 'month' : null
    const slugs: string[] = Array.isArray(body.slugs)
      ? [...new Set(body.slugs.filter((s: unknown) => typeof s === 'string'))] as string[]
      : []
    if (!interval) return json({ error: 'Choose monthly or yearly billing.' }, 400)
    if (slugs.length === 0) return json({ error: 'Your cart is empty.' }, 400)
    if (slugs.length > 20) return json({ error: 'Too many items.' }, 400)

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const { data: products } = await admin.from('products').select('slug').in('slug', slugs).eq('active', true)
    const known = new Set((products ?? []).map((p) => p.slug))
    const unknown = slugs.filter((s) => !known.has(s))
    if (unknown.length) return json({ error: `Unknown tool: ${unknown.join(', ')}` }, 400)

    // 3. Don't sell a tool the customer already pays for.
    const { data: subs } = await admin
      .from('subscriptions').select('product_slug, status, provider_customer_id')
      .eq('user_id', user.id)
    const owned = (subs ?? []).filter((s) => s.status === 'active' || s.status === 'past_due').map((s) => s.product_slug)
    const dupes = slugs.filter((s) => owned.includes(s))
    if (dupes.length) return json({ error: `You already have: ${dupes.join(', ')}. Remove it from your cart.` }, 409)

    // 4. Real prices from Stripe, by lookup key.
    const keys = slugs.map((s) => `${s}_${interval}`)
    const prices = await stripe.prices.list({ lookup_keys: keys, active: true, limit: 100 })
    const byKey = new Map(prices.data.map((p) => [p.lookup_key, p.id]))
    const missing = keys.filter((k) => !byKey.has(k))
    if (missing.length) {
      console.error('missing Stripe prices', missing)
      return json({ error: `Price not set up in Stripe yet: ${missing.join(', ')}` }, 500)
    }

    // 5. One Stripe customer per user.
    let customerId = (subs ?? []).find((s) => s.provider_customer_id)?.provider_customer_id as string | undefined
    if (!customerId) {
      const found = await stripe.customers.search({ query: `metadata['user_id']:'${user.id}'`, limit: 1 })
      customerId = found.data[0]?.id
    }
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email!, metadata: { user_id: user.id } })
      customerId = customer.id
    }

    // 6. Checkout session. user_id travels to the webhook in metadata;
    //    the webhook maps each line item back to a tool by its lookup key.
    const origin = new URL(req.url).origin
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: keys.map((k) => ({ price: byKey.get(k)!, quantity: 1 })),
      subscription_data: { metadata: { user_id: user.id } },
      metadata: { user_id: user.id },
      success_url: safeUrl(body.successUrl, `${origin}/checkout/success`),
      cancel_url: safeUrl(body.cancelUrl, `${origin}/`),
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    })

    return json({ url: session.url })
  } catch (e) {
    console.error(e)
    return json({ error: (e as Error).message }, 500)
  }
})
