import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../lib/AuthContext.jsx'
import { Logo } from '../components/Navbar.jsx'

/** mode: 'login' | 'signup' */
export default function Auth({ mode = 'login' }) {
  const isSignup = mode === 'signup'
  const { user, configured, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/account'

  const [state, setState] = useState('idle') // idle | busy | sent
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = `${isSignup ? 'Create account' : 'Log in'} — AutoBim Hub`
  }, [isSignup])

  // Already signed in → leave the auth page
  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, from, navigate])

  async function onSubmit(e) {
    e.preventDefault()
    if (!configured) {
      setState('idle')
      return setError('Accounts are not configured yet. Please try again later.')
    }
    const f = new FormData(e.currentTarget)
    const email = f.get('email').trim()
    const password = f.get('password')
    setState('busy')
    setError('')

    if (isSignup) {
      const { data, error: err } = await signUp(email, password, { full_name: f.get('name').trim() })
      if (err) { setState('idle'); return setError(err.message) }
      // If email confirmation is on, there's no session yet.
      if (!data.session) return setState('sent')
      navigate(from, { replace: true })
    } else {
      const { error: err } = await signIn(email, password)
      if (err) { setState('idle'); return setError(err.message) }
      navigate(from, { replace: true })
    }
  }

  if (state === 'sent') {
    return (
      <AuthShell>
        <div className="auth-done">
          <CheckCircle2 size={44} />
          <h1>Check your email</h1>
          <p>We sent a confirmation link to verify your address. Click it, then log in.</p>
          <Link to="/login" className="btn btn-primary">Go to log in</Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Logo light={false} />
        <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth-sub">
          {isSignup
            ? 'Manage your tool subscriptions and downloads.'
            : 'Log in to manage your subscriptions and licences.'}
        </p>

        <form onSubmit={onSubmit}>
          {isSignup && (
            <label className="field">
              <span>Full name</span>
              <div className="field-ico">
                <User size={16} />
                <input name="name" required maxLength={120} autoComplete="name" placeholder="Jane Doe" />
              </div>
            </label>
          )}
          <label className="field">
            <span>Email</span>
            <div className="field-ico">
              <Mail size={16} />
              <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
            </div>
          </label>
          <label className="field">
            <span>Password</span>
            <div className="field-ico">
              <Lock size={16} />
              <input
                name="password" type="password" required minLength={8}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
              />
            </div>
          </label>

          {!isSignup && (
            <Link to="/reset-password" className="auth-forgot">Forgot password?</Link>
          )}
          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="btn btn-primary auth-submit" disabled={state === 'busy'}>
            {state === 'busy'
              ? <><Loader2 size={16} className="spin" /> Please wait…</>
              : <>{isSignup ? 'Create account' : 'Log in'} <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? (
            <>Already have an account? <Link to="/login">Log in</Link></>
          ) : (
            <>New here? <Link to="/signup">Create an account</Link></>
          )}
        </p>
      </motion.div>
    </AuthShell>
  )
}

function AuthShell({ children }) {
  return (
    <section className="auth">
      <div className="hero-grid" aria-hidden="true" />
      <div className="auth-inner">{children}</div>
    </section>
  )
}
