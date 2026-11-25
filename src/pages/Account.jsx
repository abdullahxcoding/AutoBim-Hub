import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LogOut, Package, Monitor, Clock, AlertCircle, Download, KeyRound, Copy, Check,
  CreditCard, Loader2, ShoppingCart, Sparkles,
} from 'lucide-react'
import { useAuth } from '../lib/AuthContext.jsx'
import { useCart } from '../lib/CartContext.jsx'
import { supabase } from '../lib/supabase.js'
import { openBillingPortal } from '../lib/billing.js'
import { PRODUCTS } from '../data/products.js'
import { soon } from '../components/Toast.jsx'

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')
const DAY = 86400000

/** Work out one tool's access from the trial and its subscription rows. */
function accessFor(slug, subs, trialEnds) {
  const rows = subs.filter((s) => s.product_slug === slug)
  const live = rows.find((s) => s.status === 'active' || s.status === 'past_due')
  if (live) {
    if (live.status === 'past_due') return { cls: 'warn', label: 'Payment failed', note: 'Update your card to keep access', sub: live }
    if (live.cancel_at_period_end) return { cls: 'warn', label: 'Ending', note: `Auto-renew is off · access until ${fmtDate(live.current_period_end)}`, sub: live }
    return { cls: 'ok', label: 'Active', note: `Renews ${fmtDate(live.current_period_end)} · ${live.plan === 'year' ? 'yearly' : 'monthly'}`, sub: live }
  }
  if (trialEnds && new Date(trialEnds) > new Date()) {
    return { cls: 'trial', label: 'Free trial', note: `Until ${fmtDate(trialEnds)}`, buy: true }
  }
  if (rows.length) return { cls: 'off', label: 'Expired', note: 'Renew to keep using this tool', renew: true }
  return { cls: 'off', label: 'Not in your plan', note: 'Add it to use it after your trial', buy: true }
}

export default function Account() {
  const { user, signOut } = useAuth()
  const cart = useCart()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [subs, setSubs] = useState(null)
  const [devices, setDevices] = useState([])
  const [error, setError] = useState('')

  useEffect(() => { document.title = 'My Account — AutoBim Hub' }, [])

  useEffect(() => {
    if (!user || !supabase) return
    let alive = true
    ;(async () => {
      const [p, s, a] = await Promise.all([
        supabase.from('profiles').select('trial_ends_at, licence_key').eq('id', user.id).maybeSingle(),
        supabase.from('subscriptions').select('*').order('updated_at', { ascending: false }),
        supabase.from('activations').select('*').eq('active', true).order('activated_at', { ascending: false }),
      ])
      if (!alive) return
      const err = p.error || s.error
      if (err) setError(err.message)
      setProfile(p.data || {})
      setSubs(s.data || [])
      setDevices(a.data || [])
    })()
    return () => { alive = false }
  }, [user])

  const name = user?.user_metadata?.full_name
  const trialEnds = profile?.trial_ends_at
  const trialLeft = trialEnds ? Math.ceil((new Date(trialEnds) - Date.now()) / DAY) : 0
  const paid = (subs || []).some((s) => s.provider_customer_id)
  const tools = PRODUCTS.filter((p) => p.pricing)

  function addAndGo(slugs) {
    slugs.forEach((s) => cart.add(s))
    navigate('/cart')
  }

  return (
    <div className="account">
      <section className="account-hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="container account-hero-inner">
          <div>
            <span className="eyebrow">My Account</span>
            <h1>{name ? `Hi, ${name.split(' ')[0]}` : 'My Account'}</h1>
            <p className="account-email">{user?.email}</p>
          </div>
          <button className="btn btn-ghost" onClick={signOut}><LogOut size={16} /> Sign out</button>
        </div>
      </section>

      <div className="container account-body">
        {error && <p className="form-error"><AlertCircle size={15} /> {error}</p>}

        {profile && trialLeft > 0 && (
          <div className="trial-banner">
            <Sparkles size={20} />
            <div>
              <strong>Free trial: {trialLeft} day{trialLeft === 1 ? '' : 's'} left</strong>
              <span>Every tool is unlocked until {fmtDate(trialEnds)}. Choose the ones you want to keep.</span>
            </div>
            <Link to="/cart" className="btn btn-primary btn-sm"><ShoppingCart size={15} /> Choose tools</Link>
          </div>
        )}

        <section className="account-block">
          <h2><KeyRound size={18} /> Your licence key</h2>
          {profile === null ? (
            <div className="acc-skeleton"><i /></div>
          ) : profile.licence_key ? (
            <>
              <LicenceKey value={profile.licence_key} />
              <p className="acc-hint">
                Enter this key in any AutoBim Hub tool in Revit the first time you use it on a computer.
                It stays the same for life: renewals and new tools unlock automatically.
                Keep it private, because anyone with this key could use a device slot.
              </p>
            </>
          ) : (
            <p className="acc-muted">Your key is being created. Refresh in a moment.</p>
          )}
        </section>

        <section className="account-block">
          <div className="acc-head">
            <h2><Package size={18} /> Your tools</h2>
            {paid && <BillingButton />}
          </div>
          {subs === null ? (
            <div className="acc-skeleton"><i /><i /></div>
          ) : (
            <ul className="sub-list">
              {tools.map((p) => {
                const a = accessFor(p.slug, subs, trialEnds)
                return (
                  <li key={p.slug} className="sub-row">
                    <div className="sub-main">
                      <strong>{p.name}</strong>
                      <span className={`sub-status ${a.cls}`}>{a.label}</span>
                    </div>
                    <div className="sub-meta">
                      <span><Clock size={13} /> {a.note}</span>
                    </div>
                    <div className="sub-actions">
                      {(a.renew || a.buy) && (
                        <button className="btn btn-primary btn-sm" onClick={() => addAndGo([p.slug])}>
                          {a.renew ? 'Renew licence' : cart.has(p.slug) ? 'In cart' : 'Add to cart'}
                        </button>
                      )}
                      {a.sub?.status === 'past_due' && <BillingButton label="Update card" />}
                      {a.sub?.status === 'active' && a.sub.cancel_at_period_end && <BillingButton label="Turn auto-renew on" />}
                      <Link to={`/products/${p.slug}`} className="text-link"><Download size={14} /> Download</Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="account-block">
          <h2><Monitor size={18} /> Activated computers</h2>
          {devices.length === 0 ? (
            <p className="acc-muted">No computers yet. A computer appears here once you enter your licence key in a tool inside Revit.</p>
          ) : (
            <ul className="device-list">
              {devices.map((d) => (
                <li key={d.id}>
                  <div>
                    <strong>{d.device_name || 'Unnamed computer'}</strong>
                    <span className="mono">activated {fmtDate(d.activated_at)}{d.last_seen_at ? ` · last used ${fmtDate(d.last_seen_at)}` : ''}</span>
                  </div>
                  <DeactivateButton id={d.id} onDone={() => setDevices((ds) => ds.filter((x) => x.id !== d.id))} />
                </li>
              ))}
            </ul>
          )}
          <p className="acc-hint">Your key works on 2 computers. Deactivate one to use the tools on another.</p>
        </section>
      </div>
    </div>
  )
}

function LicenceKey({ value }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      soon('Copy failed. Select the key and copy it manually.')
    }
  }
  return (
    <div className="licence-key">
      <code>{value}</code>
      <button className="btn btn-ghost btn-sm" onClick={copy}>
        {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy</>}
      </button>
    </div>
  )
}

function BillingButton({ label = 'Manage billing' }) {
  const [busy, setBusy] = useState(false)
  async function go() {
    setBusy(true)
    const res = await openBillingPortal()
    if (res.ok) window.location.href = res.url
    else { setBusy(false); soon(res.message) }
  }
  return (
    <button className="btn btn-ghost btn-sm" onClick={go} disabled={busy}>
      {busy ? <Loader2 size={15} className="spin" /> : <CreditCard size={15} />} {label}
    </button>
  )
}

function DeactivateButton({ id, onDone }) {
  const [busy, setBusy] = useState(false)
  async function go() {
    setBusy(true)
    // RLS allows a user to deactivate only their own activation rows.
    const { error } = await supabase.from('activations').update({ active: false }).eq('id', id)
    setBusy(false)
    if (!error) onDone()
  }
  return (
    <button className="btn-text-danger" onClick={go} disabled={busy}>
      {busy ? 'Removing…' : 'Deactivate'}
    </button>
  )
}
