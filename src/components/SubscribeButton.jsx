import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Sparkles } from 'lucide-react'
import { useAuth } from '../lib/AuthContext.jsx'
import { startCheckout } from '../lib/billing.js'
import { soon } from './Toast.jsx'

/**
 * Subscribe / Start trial button for a paid product.
 * - Not signed in  → send to /login, then back to this product.
 * - Signed in      → start checkout via the Edge Function.
 */
export default function SubscribeButton({ product, className = 'btn btn-primary', children }) {
  const { user, configured } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  const trial = product.pricing?.trialDays
  const label = children || (trial ? `Start ${trial}-day free trial` : 'Subscribe')

  async function onClick() {
    if (!configured) return soon('Accounts are not configured yet.')
    if (!user) {
      return navigate('/login', { state: { from: `/products/${product.slug}` } })
    }
    setBusy(true)
    const res = await startCheckout(product)
    setBusy(false)
    if (res.ok) window.location.href = res.url
    else soon(res.message)
  }

  return (
    <button className={className} onClick={onClick} disabled={busy}>
      {busy ? <><Loader2 size={16} className="spin" /> Starting…</> : <><Sparkles size={16} /> {label}</>}
    </button>
  )
}
