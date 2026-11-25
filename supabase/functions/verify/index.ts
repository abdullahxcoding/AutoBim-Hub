// ─────────────────────────────────────────────────────────────
//  Edge Function: verify
//  The Revit tools call this on every run (with a short client-side
//  cache). It is the single source of truth for "may this device run
//  this tool right now?". Access = active trial OR active subscription
//  for the tool. Devices belong to the licence (2-device limit).
//
//  Request  (POST JSON):
//    { licence_key, tool_slug, device_id, device_name? }
//  Response (always 200 unless the request is malformed):
//    { ok: true,  status: "trial"|"subscribed", access_until, device_count, device_limit }
//    { ok: false, reason, message, device_count?, device_limit? }
//
//  Authenticated by the LICENCE KEY, not a Supabase session — so
//  verify_jwt = false (see config.toml). The anon key is still sent by
//  the client as apikey, which the platform gateway requires.
//
//  Deploy:  npx supabase functions deploy verify --no-verify-jwt
//  Secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (set by the platform)
// ─────────────────────────────────────────────────────────────
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const DEVICE_LIMIT = 2
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

function deny(reason: string, message: string, extra: Record<string, unknown> = {}) {
  return json({ ok: false, reason, message, ...extra })
}

// Normalise to the stored format: uppercase, strip spaces/hyphens.
function normaliseKey(raw: string) {
  return (raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return deny('bad_request', 'POST only')

  let payload: { licence_key?: string; tool_slug?: string; device_id?: string; device_name?: string }
  try {
    payload = await req.json()
  } catch {
    return json({ ok: false, reason: 'bad_request', message: 'Invalid JSON' }, 400)
  }

  const key = normaliseKey(payload.licence_key ?? '')
  const tool = (payload.tool_slug ?? '').trim()
  const deviceId = (payload.device_id ?? '').trim()
  const deviceName = (payload.device_name ?? '').trim() || null
  if (!key || !tool || !deviceId) {
    return json({ ok: false, reason: 'bad_request', message: 'licence_key, tool_slug and device_id are required' }, 400)
  }

  // 1. Resolve the licence key to an account. Compare normalised forms so
  //    the customer can type it with or without hyphens / lower case.
  const { data: profiles, error: profErr } = await admin
    .from('profiles')
    .select('id, trial_ends_at, licence_key')
    .limit(2000)
  if (profErr) return deny('server', 'Could not read accounts')
  const profile = (profiles ?? []).find((p) => normaliseKey(p.licence_key) === key)
  if (!profile) return deny('unknown_key', 'That licence key was not recognised.')

  const userId = profile.id
  const now = Date.now()

  // 2. Device check — activations with product_slug NULL are account-wide.
  const { data: devices, error: devErr } = await admin
    .from('activations')
    .select('id, device_id, active')
    .eq('user_id', userId)
    .is('product_slug', null)
  if (devErr) return deny('server', 'Could not read devices')

  const activeDevices = (devices ?? []).filter((d) => d.active)
  const known = activeDevices.find((d) => d.device_id === deviceId)

  if (known) {
    await admin.from('activations').update({ last_seen_at: new Date().toISOString() }).eq('id', known.id)
  } else {
    if (activeDevices.length >= DEVICE_LIMIT) {
      await admin.from('license_events').insert({
        user_id: userId, product_slug: tool, type: 'activate',
        detail: { device_id: deviceId, denied: 'device_limit' },
      })
      return deny('device_limit',
        `This licence is already active on ${DEVICE_LIMIT} devices. Remove one from your AutoBim Hub account, then try again.`,
        { device_count: activeDevices.length, device_limit: DEVICE_LIMIT })
    }
    // Re-activate a previously removed row for this device, or insert a new one.
    const dormant = (devices ?? []).find((d) => d.device_id === deviceId && !d.active)
    if (dormant) {
      await admin.from('activations')
        .update({ active: true, device_name: deviceName, last_seen_at: new Date().toISOString() })
        .eq('id', dormant.id)
    } else {
      await admin.from('activations').insert({
        user_id: userId, product_slug: null, device_id: deviceId,
        device_name: deviceName, active: true, last_seen_at: new Date().toISOString(),
      })
    }
    await admin.from('license_events').insert({
      user_id: userId, product_slug: tool, type: 'activate',
      detail: { device_id: deviceId, device_name: deviceName },
    })
  }

  const deviceCount = known ? activeDevices.length : activeDevices.length + 1

  // 3. Access: active trial covers ALL tools; otherwise a live subscription
  //    for THIS tool. Pick the latest access_until of whatever applies.
  const trialEnd = profile.trial_ends_at ? Date.parse(profile.trial_ends_at) : 0
  const trialLive = trialEnd > now

  const { data: subs, error: subErr } = await admin
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', userId)
    .eq('product_slug', tool)
  if (subErr) return deny('server', 'Could not read subscriptions')

  let subUntil = 0
  for (const s of subs ?? []) {
    const live = s.status === 'active' || s.status === 'past_due'
    const until = s.current_period_end ? Date.parse(s.current_period_end) : 0
    if (live && until > subUntil) subUntil = until
  }
  const subLive = subUntil > now

  if (!trialLive && !subLive) {
    const reason = trialEnd > 0 || (subs ?? []).length > 0 ? 'expired' : 'no_access'
    const message = reason === 'expired'
      ? 'Your access to this tool has ended. Renew your subscription in your AutoBim Hub account.'
      : 'This account has no active trial or subscription for this tool.'
    return deny(reason, message, { device_count: deviceCount, device_limit: DEVICE_LIMIT })
  }

  // Prefer the subscription date when it is the thing granting access.
  const status = subLive ? 'subscribed' : 'trial'
  const accessUntil = new Date(subLive ? subUntil : trialEnd).toISOString()

  return json({
    ok: true,
    status,
    access_until: accessUntil,
    device_count: deviceCount,
    device_limit: DEVICE_LIMIT,
  })
})
