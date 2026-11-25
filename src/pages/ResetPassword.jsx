import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Mail, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../lib/AuthContext.jsx'
import { Logo } from '../components/Navbar.jsx'

export default function ResetPassword() {
  const { resetPassword, configured } = useAuth()
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    if (!configured) return setError('Accounts are not configured yet.')
    const email = new FormData(e.currentTarget).get('email').trim()
    setState('busy'); setError('')
    const { error: err } = await resetPassword(email)
    if (err) { setState('idle'); return setError(err.message) }
    setState('sent')
  }

  return (
    <section className="auth">
      <div className="hero-grid" aria-hidden="true" />
      <div className="auth-inner">
        <div className="auth-card">
          <Logo light={false} />
          {state === 'sent' ? (
            <div className="auth-done">
              <CheckCircle2 size={40} />
              <h1>Email sent</h1>
              <p>If an account exists for that address, you&rsquo;ll get a link to reset your password.</p>
              <Link to="/login" className="btn btn-primary">Back to log in</Link>
            </div>
          ) : (
            <>
              <h1>Reset your password</h1>
              <p className="auth-sub">We&rsquo;ll email you a secure reset link.</p>
              <form onSubmit={onSubmit}>
                <label className="field">
                  <span>Email</span>
                  <div className="field-ico">
                    <Mail size={16} />
                    <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
                  </div>
                </label>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button className="btn btn-primary auth-submit" disabled={state === 'busy'}>
                  {state === 'busy' ? <><Loader2 size={16} className="spin" /> Sending…</> : 'Send reset link'}
                </button>
              </form>
              <p className="auth-switch"><Link to="/login">Back to log in</Link></p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
