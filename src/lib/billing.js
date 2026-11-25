import { supabase } from './supabase.js'

/**
 * Billing helpers. The browser never sees Stripe secrets or price ids:
 * it sends the cart (tool slugs + month/year) to our `create-checkout`
 * Edge Function, which looks up the real Stripe prices server-side.
 */
export const BILLING = {
  provider: 'stripe',
  live: true,
}

const CURRENCY = { USD: '$', EUR: '€', GBP: '£' }
export const money = (n, currency = 'USD') => `${CURRENCY[currency] || ''}${n}`

/** "$15 / month" or "$150 / year" for one product. */
export function priceLabel(pricing, interval = 'month') {
  if (!pricing) return 'Free'
  return `${money(pricing[interval], pricing.currency)} / ${interval}`
}

/** Turn an Edge Function error into its real message ("No such price…"). */
async function fnError(error) {
  let message = error.message
  try {
    const body = await error.context?.json()
    if (body?.error) message = body.error
  } catch { /* body wasn't JSON — keep the generic message */ }
  return message
}

/** Start checkout for the cart. Returns { ok, url, message }. */
export async function startCheckout(slugs, interval) {
  if (!supabase) return { ok: false, message: 'Accounts are not configured yet.' }
  if (!BILLING.live) return { ok: false, message: 'Checkout isn’t live yet. Please check back soon.' }
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: {
      slugs,
      interval,
      successUrl: `${window.location.origin}/checkout/success`,
      cancelUrl: `${window.location.origin}/cart`,
    },
  })
  if (error) return { ok: false, message: await fnError(error) }
  if (!data?.url) return { ok: false, message: 'Could not start checkout.' }
  return { ok: true, url: data.url }
}

/** Open Stripe's customer portal (cancel, change card, invoices). */
export async function openBillingPortal() {
  if (!supabase) return { ok: false, message: 'Accounts are not configured yet.' }
  const { data, error } = await supabase.functions.invoke('billing-portal', {
    body: { returnUrl: `${window.location.origin}/account` },
  })
  if (error) return { ok: false, message: await fnError(error) }
  if (!data?.url) return { ok: false, message: 'Could not open billing.' }
  return { ok: true, url: data.url }
}
