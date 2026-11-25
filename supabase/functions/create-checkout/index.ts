// ─────────────────────────────────────────────────────────────
//  Edge Function: create-checkout  (Stripe)
//  Creates a Stripe Checkout Session (subscription mode) for the
//  signed-in user and returns its hosted URL. The browser calls
//  this; the Stripe secret key stays here on the server.
//
//  Deploy:  supabase functions deploy create-checkout
//  Secrets: supabase secrets set STRIPE_SECRET_KEY=sk_test_...
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
    // 1. Identify the caller from their JWT.
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } },
    )
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user) return json({ error: 'Not signed in' }, 401)

    const { slug, priceId, successUrl, cancelUrl, trialDays } = await req.json()
    if (!slug || !priceId) return json({ error: 'Missing slug or priceId' }, 400)

    // 2. Reuse a Stripe customer per user, or create one.
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const { data: existing } = await admin
      .from('subscriptions').select('provider_customer_id')
      .eq('user_id', user.id).not('provider_customer_id', 'is', null).limit(1).maybeSingle()

    let customerId = existing?.provider_customer_id as string | undefined
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { user_id: user.id },
      })
      customerId = customer.id
    }

    // 3. Create the Checkout Session. metadata travels to the webhook,
    //    which is how we link the subscription back to this user + tool.
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: trialDays && trialDays > 0 ? trialDays : undefined,
        metadata: { user_id: user.id, product_slug: slug },
      },
      metadata: { user_id: user.id, product_slug: slug },
      success_url: successUrl ?? `${new URL(req.url).origin}/checkout/success`,
      cancel_url: cancelUrl ?? `${new URL(req.url).origin}/`,
      allow_promotion_codes: true,
    })

    return json({ url: session.url })
  } catch (e) {
    console.error(e)
    return json({ error: (e as Error).message }, 500)
  }
})
