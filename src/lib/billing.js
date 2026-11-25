import { supabase } from './supabase.js'

/**
 * Billing config. One place to switch payment provider later.
 *   provider: 'paddle' | 'lemonsqueezy'  (used by the Edge Functions)
 * The frontend doesn't talk to the provider directly — it asks our
 * `create-checkout` Edge Function for a checkout URL, so secret keys
 * never touch the browser.
 */
export const BILLING = {
  provider: 'stripe',
  // Checkout is live: Edge Functions deployed and Stripe keys set.
  live: true,
}

const CURRENCY = { USD: '$', EUR: '€', GBP: '£' }

/** "$12 / month" style label from a product's pricing object. */
export function priceLabel(pricing) {
  if (!pricing) return 'Free'
  const sym = CURRENCY[pricing.currency] || ''
  return `${sym}${pricing.amount} / ${pricing.interval}`
}

/**
 * Start checkout for a product. Returns { ok, url, message }.
 * Calls the `create-checkout` Edge Function, which creates a provider
 * checkout for the signed-in user and returns its hosted URL.
 */
export async function startCheckout(product) {
  if (!supabase) return { ok: false, message: 'Accounts are not configured yet.' }
  if (!BILLING.live) {
    return { ok: false, message: 'Checkout isn’t live yet. Please check back soon.' }
  }
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: {
      slug: product.slug,
      priceId: product.pricing?.priceId,
      trialDays: product.pricing?.trialDays ?? 0,
      successUrl: `${window.location.origin}/checkout/success`,
      cancelUrl: `${window.location.origin}/products/${product.slug}`,
    },
  })
  if (error) return { ok: false, message: error.message }
  if (!data?.url) return { ok: false, message: 'Could not start checkout.' }
  return { ok: true, url: data.url }
}
