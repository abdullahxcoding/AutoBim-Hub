// ─────────────────────────────────────────────────────────────
//  Edge Function: stripe-webhook
//  Stripe calls this on every billing event. It verifies the
//  signature, then writes ONE ROW PER TOOL into `subscriptions`
//  (a cart checkout = one Stripe subscription with several items).
//  Each item's price lookup key "<slug>_<interval>" tells us the tool.
//
//  This is the ONLY place access is granted, renewed or removed.
//
//  Deploy:  supabase functions deploy stripe-webhook --no-verify-jwt
//  Secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
//
//  Stripe → Developers → Webhooks → endpoint events:
//    checkout.session.completed
//    customer.subscription.updated
//    customer.subscription.deleted
// ─────────────────────────────────────────────────────────────
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@17?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-12-18.acacia' })
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

// Stripe status → ours. Only 'active' and 'past_due' give access.
// 'incomplete' (first payment not finished) gives none until it becomes active.
const STATUS: Record<string, string> = {
  active: 'active', trialing: 'active', past_due: 'past_due', unpaid: 'past_due',
  canceled: 'canceled', incomplete: 'expired', incomplete_expired: 'expired', paused: 'expired',
}

Deno.serve(async (req) => {
  const sig = req.headers.get('stripe-signature') ?? ''
  const body = await req.text()
  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, Deno.env.get('STRIPE_WEBHOOK_SECRET')!)
  } catch (e) {
    return new Response(`Bad signature: ${(e as Error).message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object as Stripe.Checkout.Session
        if (s.subscription) await sync(s.subscription as string)
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // Re-read from Stripe so events arriving out of order can't
        // overwrite newer data with older data.
        await sync((event.data.object as Stripe.Subscription).id)
        break
    }
    return new Response('ok')
  } catch (e) {
    console.error(e)
    return new Response('error', { status: 500 })
  }
})

const slugFromLookupKey = (key: string | null | undefined) =>
  key?.match(/^(.+)_(month|year)$/)?.[1] ?? null

async function sync(subId: string) {
  const sub = await stripe.subscriptions.retrieve(subId)
  const userId = sub.metadata?.user_id
  if (!userId) {
    console.log('skip: no user_id metadata', { sub: sub.id })
    return
  }

  const status = STATUS[sub.status] ?? 'expired'
  const customer = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id
  const now = new Date().toISOString()
  const seen: string[] = []

  for (const item of sub.items.data) {
    const slug = slugFromLookupKey(item.price.lookup_key)
    if (!slug) {
      console.log('skip item without our lookup key', { item: item.id, price: item.price.id })
      continue
    }
    seen.push(slug)
    // Period end is top-level in this API version and per-item in newer ones.
    const endUnix = (item as { current_period_end?: number }).current_period_end
      ?? (sub as { current_period_end?: number }).current_period_end
      ?? null
    const row = {
      user_id: userId,
      product_slug: slug,
      status,
      plan: item.price.recurring?.interval ?? null,
      provider: 'stripe',
      provider_sub_id: sub.id,
      provider_customer_id: customer,
      current_period_end: endUnix ? new Date(endUnix * 1000).toISOString() : null,
      cancel_at_period_end: sub.cancel_at_period_end,
      updated_at: now,
    }
    const { error } = await admin.from('subscriptions')
      .upsert(row, { onConflict: 'provider,provider_sub_id,product_slug' })
    if (error) { console.error('upsert failed', error, row); throw error }
  }

  if (seen.length === 0) return

  // Tools removed from this subscription (e.g. via the billing portal) lose access.
  const { error: rmErr } = await admin.from('subscriptions')
    .update({ status: 'canceled', updated_at: now })
    .eq('provider', 'stripe').eq('provider_sub_id', sub.id)
    .not('product_slug', 'in', `(${seen.map((s) => `"${s}"`).join(',')})`)
  if (rmErr) console.error('mark removed failed', rmErr)

  await admin.from('license_events').insert(seen.map((slug) => ({
    user_id: userId, product_slug: slug, type: sub.status,
    detail: { sub_id: sub.id, status: sub.status, cancel_at_period_end: sub.cancel_at_period_end },
  })))
  console.log('subscription synced', { userId, sub: sub.id, status, tools: seen })
}
