import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useCart } from '../lib/CartContext.jsx'

export default function CheckoutSuccess() {
  const { clear } = useCart()

  useEffect(() => { document.title = 'Payment confirmed — AutoBim Hub' }, [])
  // The purchase went through, so empty the cart.
  useEffect(() => { clear() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="auth">
      <div className="hero-grid" aria-hidden="true" />
      <div className="auth-inner">
        <div className="auth-done">
          <CheckCircle2 size={48} />
          <h1>Payment confirmed</h1>
          <p>
            Thank you. Your tools are unlocked. It can take a few seconds to show on your account.
            If you already entered your licence key in Revit, there&rsquo;s nothing else to do:
            just click the tool again.
          </p>
          <Link to="/account" className="btn btn-primary">Go to My Account</Link>
        </div>
      </div>
    </section>
  )
}
