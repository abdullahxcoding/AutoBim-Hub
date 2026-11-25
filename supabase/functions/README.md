# Edge Functions (Phase B — payments, Stripe)

Two functions power checkout and licence updates:

- **create-checkout** — the website calls this to start a Stripe Checkout
  Session for the signed-in user. Returns the hosted checkout URL.
- **stripe-webhook** — Stripe calls this after every billing event. It verifies
  the signature and writes the subscription into the database. This is the only
  place subscriptions are created or changed.

## One-time setup

1. **Run the SQL migrations** (Supabase → SQL Editor), in order:
   `002_accounts.sql`, `003_grants.sql`, `004_stripe_columns.sql`.

2. **In the Stripe Dashboard (test mode):**
   - Create a **Product**, then add a **recurring Price** (e.g. $12 / month).
   - Copy the price id (`price_...`) into each tool's `pricing.priceId`
     in `src/data/products.js`.

3. **Deploy the functions** (install the CLI first):
   ```bash
   supabase link --project-ref <your-project-ref>

   supabase secrets set STRIPE_SECRET_KEY=sk_test_...
   supabase functions deploy create-checkout

   supabase functions deploy stripe-webhook --no-verify-jwt
   ```

4. **Add the webhook in Stripe** → Developers → Webhooks → Add endpoint:
   - URL: `https://<project-ref>.functions.supabase.co/stripe-webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`,
     `customer.subscription.deleted`
   - Copy the endpoint's **Signing secret** (`whsec_...`) and set it:
     ```bash
     supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
     ```

5. **Go live on the site:** in `src/lib/billing.js` set `live: true`.

## Test it
Use Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC.
After paying, the subscription should appear on **My Account** within a few seconds.

`SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are injected
into functions automatically — do not set them by hand.

## Note on tax
Plain Stripe makes **you** the merchant of record, so you're responsible for any
VAT/sales tax. For worldwide selling, enable **Stripe Tax** in the Dashboard
(it adds tax automatically at checkout). Fine to skip while testing.
