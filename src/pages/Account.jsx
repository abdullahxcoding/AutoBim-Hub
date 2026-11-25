import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Package, Monitor, Clock, AlertCircle, Download, ExternalLink } from 'lucide-react'
import { useAuth } from '../lib/AuthContext.jsx'
import { supabase } from '../lib/supabase.js'
import { PRODUCTS } from '../data/products.js'

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')
const productName = (slug) => PRODUCTS.find((p) => p.slug === slug)?.name || slug

const STATUS = {
  active: { label: 'Active', cls: 'ok' },
  trialing: { label: 'Trial', cls: 'trial' },
  past_due: { label: 'Payment due', cls: 'warn' },
  canceled: { label: 'Canceled', cls: 'off' },
  expired: { label: 'Expired', cls: 'off' },
}

export default function Account() {
  const { user, signOut } = useAuth()
  const [subs, setSubs] = useState(null)
  const [devices, setDevices] = useState([])
  const [error, setError] = useState('')

  useEffect(() => { document.title = 'My Account — AutoBim Hub' }, [])

  useEffect(() => {
    if (!user || !supabase) return
    let alive = true
    ;(async () => {
      const [s, a] = await Promise.all([
        supabase.from('subscriptions').select('*').order('created_at', { ascending: false }),
        supabase.from('activations').select('*').eq('active', true).order('activated_at', { ascending: false }),
      ])
      if (!alive) return
      if (s.error) setError(s.error.message)
      setSubs(s.data || [])
      setDevices(a.data || [])
    })()
    return () => { alive = false }
  }, [user])

  const name = user?.user_metadata?.full_name

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

        <section className="account-block">
          <h2><Package size={18} /> Subscriptions</h2>
          {subs === null ? (
            <div className="acc-skeleton"><i /><i /></div>
          ) : subs.length === 0 ? (
            <div className="acc-empty">
              <p>You don&rsquo;t have any subscriptions yet.</p>
              <Link to="/#products" className="btn btn-primary btn-sm">Browse tools</Link>
            </div>
          ) : (
            <ul className="sub-list">
              {subs.map((s) => {
                const st = STATUS[s.status] || { label: s.status, cls: 'off' }
                return (
                  <li key={s.id} className="sub-row">
                    <div className="sub-main">
                      <strong>{productName(s.product_slug)}</strong>
                      <span className={`sub-status ${st.cls}`}>{st.label}</span>
                    </div>
                    <div className="sub-meta">
                      <span><Clock size={13} /> {s.status === 'canceled' ? 'Ends' : 'Renews'} {fmtDate(s.current_period_end)}</span>
                      {s.plan && <span className="mono">{s.plan}</span>}
                    </div>
                    <div className="sub-actions">
                      <Link to={`/products/${s.product_slug}`} className="text-link"><Download size={14} /> Download</Link>
                      {s.manage_url && (
                        <a href={s.manage_url} target="_blank" rel="noreferrer" className="text-link">
                          Manage billing <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="account-block">
          <h2><Monitor size={18} /> Activated devices</h2>
          {devices.length === 0 ? (
            <p className="acc-muted">No devices activated yet. Devices appear here once you activate a tool inside Revit.</p>
          ) : (
            <ul className="device-list">
              {devices.map((d) => (
                <li key={d.id}>
                  <div>
                    <strong>{d.device_name || 'Unnamed device'}</strong>
                    <span className="mono">{productName(d.product_slug)} · activated {fmtDate(d.activated_at)}</span>
                  </div>
                  <DeactivateButton id={d.id} onDone={() => setDevices((ds) => ds.filter((x) => x.id !== d.id))} />
                </li>
              ))}
            </ul>
          )}
          <p className="acc-hint">Deactivating a device frees up a slot so you can activate the tool on another computer.</p>
        </section>
      </div>
    </div>
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
