import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Loader2, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { useCart } from '../lib/CartContext.jsx'
import { useAuth } from '../lib/AuthContext.jsx'
import { supabase } from '../lib/supabase.js'
import { startCheckout, money } from '../lib/billing.js'
import { PRODUCTS } from '../data/products.js'

const LIVE = ['active', 'past_due']

export default function Cart() {
  const cart = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [owned, setOwned] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { document.title = 'Your cart — AutoBim Hub' }, [])

  // Tools this customer already pays for, so they can't buy them twice.
  useEffect(() => {
    if (!user || !supabase) return setOwned([])
    supabase.from('subscriptions').select('product_slug,status').in('status', LIVE)
      .then(({ data }) => setOwned((data || []).map((r) => r.product_slug)))
  }, [user])

  const toBuy = cart.items.filter((p) => !owned.includes(p.slug))
  const total = toBuy.reduce((s, p) => s + p.pricing[cart.interval], 0)
  const others = PRODUCTS.filter((p) => p.pricing && !cart.has(p.slug) && !owned.includes(p.slug))

  async function checkout() {
    setError('')
    if (!user) return navigate('/login', { state: { from: '/cart' } })
    setBusy(true)
    const res = await startCheckout(toBuy.map((p) => p.slug), cart.interval)
    if (res.ok) {
      window.location.href = res.url
    } else {
      setBusy(false)
      setError(res.message)
    }
  }

  return (
    <div className="account cart">
      <section className="account-hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="container account-hero-inner">
          <div>
            <span className="eyebrow">Checkout</span>
            <h1><ShoppingCart size={30} /> Your cart</h1>
          </div>
        </div>
      </section>

      <div className="container cart-body">
        {cart.count === 0 ? (
          <div className="acc-empty">
            <p>Your cart is empty. Add the tools you want to keep using after your trial.</p>
            <Link to="/#products" className="btn btn-primary btn-sm">Browse tools</Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div>
              <div className="cart-interval" role="radiogroup" aria-label="Billing period">
                {['month', 'year'].map((iv) => (
                  <button
                    key={iv}
                    role="radio"
                    aria-checked={cart.interval === iv}
                    className={cart.interval === iv ? 'on' : ''}
                    onClick={() => cart.setInterval(iv)}
                  >
                    {iv === 'month' ? 'Monthly' : 'Yearly'}
                    {iv === 'year' && <span className="cart-save">2 months free</span>}
                  </button>
                ))}
              </div>

              <ul className="cart-list">
                {cart.items.map((p) => {
                  const Icon = p.icon
                  const has = owned.includes(p.slug)
                  return (
                    <li key={p.slug} className={has ? 'owned' : ''} style={{ '--c': p.color }}>
                      <span className="cart-icon"><Icon size={20} /></span>
                      <div className="cart-name">
                        <Link to={`/products/${p.slug}`}>{p.name}</Link>
                        {has
                          ? <span className="cart-owned">Already in your plan, won’t be charged</span>
                          : <span>{p.tagline}</span>}
                      </div>
                      <strong className="cart-price">
                        {money(p.pricing[cart.interval], p.pricing.currency)}
                        <small>/{cart.interval === 'month' ? 'mo' : 'yr'}</small>
                      </strong>
                      <button className="cart-remove" onClick={() => cart.remove(p.slug)} aria-label={`Remove ${p.name}`}>
                        <Trash2 size={16} />
                      </button>
                    </li>
                  )
                })}
              </ul>

              {others.length > 0 && (
                <div className="cart-more">
                  <h3>Add more tools</h3>
                  <div className="cart-more-list">
                    {others.map((p) => (
                      <button key={p.slug} onClick={() => cart.add(p.slug)}>
                        + {p.name} <span>{money(p.pricing[cart.interval], p.pricing.currency)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="cart-summary">
              <h2>Summary</h2>
              <dl>
                <div><dt>Tools</dt><dd>{toBuy.length}</dd></div>
                <div><dt>Billing</dt><dd>{cart.interval === 'month' ? 'Monthly' : 'Yearly'}</dd></div>
                {cart.interval === 'year' && cart.yearlySaving > 0 && (
                  <div className="cart-saving"><dt>You save</dt><dd>{money(cart.yearlySaving)} / year</dd></div>
                )}
                <div className="cart-total">
                  <dt>Total today</dt>
                  <dd>{money(total)}<small> / {cart.interval}</small></dd>
                </div>
              </dl>
              {error && <p className="form-error"><AlertCircle size={15} /> {error}</p>}
              <button className="btn btn-primary cart-checkout" onClick={checkout} disabled={busy || toBuy.length === 0}>
                {busy
                  ? <><Loader2 size={16} className="spin" /> Opening secure checkout…</>
                  : user ? <><Lock size={16} /> Checkout</> : <>Log in to checkout <ArrowRight size={16} /></>}
              </button>
              <p className="cart-fine">
                Charged today, then renews every {cart.interval} until you cancel. Cancel anytime from My Account.
                Paying ends your free trial for the tools you buy.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
