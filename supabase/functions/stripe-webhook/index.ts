// ─────────────────────────────────────────────────────────────
//  Edge Function: stripe-webhook
//  Stripe calls this on every billing event. It verifies the
//  signature, then writes the subscription into our database with
//  the service_role key (bypasses RLS). This is the ONLY place a
//  subscription is created or changed — never the browser.
//
//  Deploy:  supabase functions deploy stripe-webhook --no-verify-jwt
//  Secrets: supabase secrets set STRIPE_SECRET_KEY=sk_test_...
//           supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
//
//  In Stripe → Developers → Webhooks, add this function's URL and send:
//    checkout.session.completed
//    customer.subscription.updated
//    customer.subscription.deleted
// ─────────────────────────────────────────────────────────────
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@17?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-12-18.acacia' })
const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const STATUS: Record<string, string> = {
  trialing: 'trialing', active: 'active', past_due: 'past_due',
  unpaid: 'past_due', canceled: 'canceled', incomplete_expired: 'expired',
}

Deno.serve(async (req) => {
  const sig = req.headers.get('stripe-signature') ?? ''
  const body = await req.text()
  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body, sig, Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
    )
  } catch (e) {
    return new Response(`Bad signature: ${(e as Error).message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object as Stripe.Checkout.Session
        if (s.subscription) {
          const sub = await stripe.subscriptions.retrieve(s.subscription as string)
          await upsert(sub, s.metadata ?? {})
        }
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await upsert(sub, sub.metadata ?? {})
        break
      }
    }
    return new Response('ok')
  } catch (e) {
    console.error(e)
    return new Response('error', { status: 500 })
  }
})

async function upsert(sub: Stripe.Subscription, meta: Record<string, string>) {
  const userId = meta.user_id
  const slug = meta.product_slug
  if (!userId || !slug) {
    console.log('skip: no metadata', { sub: sub.id })
    return // not one of ours
  }

  // Period end lived at the top level in older API versions and moved onto
  // each item in newer ones — read whichever is present, and guard bad values.
  const item = sub.items?.data?.[0] as (Stripe.SubscriptionItem & { current_period_end?: number }) | undefined
  const endUnix = (sub as { current_period_end?: number }).current_period_end
    ?? item?.current_period_end
    ?? sub.trial_end
    ?? null
  const periodEnd = endUnix ? new Date(endUnix * 1000).toISOString() : null

  const row = {
    user_id: userId,
    product_slug: slug,
    status: STATUS[sub.status] ?? 'active',
    plan: item?.price?.recurring?.interval ?? 'month',
    provider: 'stripe',
    provider_sub_id: sub.id,
    provider_customer_id: typeof sub.customer === 'string' ? sub.customer : sub.customer?.id,
    current_period_end: periodEnd,
    updated_at: new Date().toISOString(),
  }
  const { error } = await admin.from('subscriptions').upsert(row, { onConflict: 'provider,provider_sub_id' })
  if (error) { console.error('upsert failed', error, row); throw error }

  await admin.from('license_events').insert({
    user_id: userId, product_slug: slug, type: sub.status,
    detail: { sub_id: sub.id, status: sub.status },
  })
  console.log('subscription saved', { userId, slug, status: row.status })
}
