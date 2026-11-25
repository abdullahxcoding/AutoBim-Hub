// ─────────────────────────────────────────────────────────────
//  Edge Function: billing-portal
//  Opens Stripe's hosted Customer Portal for the signed-in user:
//  cancel / turn off auto-renew, change card, download invoices.
//  Changes made there come back to us through stripe-webhook.
//
//  Deploy:  supabase functions deploy billing-portal
//  Stripe:  portal settings are created by scripts/stripe-setup.mjs
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } },
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return json({ error: 'Please log in.' }, 401)

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data } = await admin.from('subscriptions').select('provider_customer_id')
      .eq('user_id', user.id).not('provider_customer_id', 'is', null).limit(1).maybeSingle()
    if (!data?.provider_customer_id) return json({ error: 'You have no paid subscriptions yet.' }, 404)

    const body = await req.json().catch(() => ({}))
    let returnUrl = `${new URL(req.url).origin}/`
    try {
      const u = new URL(body.returnUrl)
      if (u.hostname === 'localhost' || u.hostname.endsWith('.vercel.app') ||
          (Deno.env.get('SITE_URL') && u.origin === new URL(Deno.env.get('SITE_URL')!).origin)) {
        returnUrl = u.toString()
      }
    } catch { /* keep default */ }

    // Use the portal settings created by scripts/stripe-setup.mjs
    // (falls back to Stripe's default settings if not found).
    const configs = await stripe.billingPortal.configurations.list({ active: true, limit: 100 })
    const configuration = configs.data.find((c) => c.metadata?.app === 'autobim')?.id

    const session = await stripe.billingPortal.sessions.create({
      customer: data.provider_customer_id,
      return_url: returnUrl,
      ...(configuration ? { configuration } : {}),
    })
    return json({ url: session.url })
  } catch (e) {
    console.error(e)
    return json({ error: (e as Error).message }, 500)
  }
})
