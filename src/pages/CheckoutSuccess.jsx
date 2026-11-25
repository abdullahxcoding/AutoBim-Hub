import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

export default function CheckoutSuccess() {
  useEffect(() => { document.title = 'Subscription confirmed — AutoBim Hub' }, [])
  return (
    <section className="auth">
      <div className="hero-grid" aria-hidden="true" />
      <div className="auth-inner">
        <div className="auth-done">
          <CheckCircle2 size={48} />
          <h1>You&rsquo;re all set</h1>
          <p>
            Thanks for subscribing. Your licence is active — it may take a few seconds to appear.
            Download the tool and sign in inside Revit to activate it.
          </p>
          <Link to="/account" className="btn btn-primary">Go to My Account</Link>
        </div>
      </div>
    </section>
  )
}
