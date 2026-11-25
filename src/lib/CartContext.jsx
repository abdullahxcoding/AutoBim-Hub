import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUCTS } from '../data/products.js'

/**
 * Shopping cart: which tools the customer wants, and whether they pay
 * monthly or yearly. Kept in localStorage so it survives reloads and
 * the trip to the login page. Stripe requires one billing period per
 * subscription, so `interval` applies to the whole cart.
 */
const KEY = 'abh-cart'
const CartCtx = createContext(null)
const valid = (slug) => PRODUCTS.some((p) => p.slug === slug && p.pricing)

function load() {
  try {
    const c = JSON.parse(localStorage.getItem(KEY))
    return {
      slugs: Array.isArray(c?.slugs) ? c.slugs.filter(valid) : [],
      interval: c?.interval === 'year' ? 'year' : 'month',
    }
  } catch {
    return { slugs: [], interval: 'month' }
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(load)

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(cart)) }, [cart])

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (e) => e.key === KEY && setCart(load())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(() => {
    const items = cart.slugs.map((s) => PRODUCTS.find((p) => p.slug === s)).filter(Boolean)
    const total = items.reduce((sum, p) => sum + p.pricing[cart.interval], 0)
    // What the same tools would cost paid monthly for a year, to show savings.
    const yearlySaving = items.reduce((sum, p) => sum + (p.pricing.month * 12 - p.pricing.year), 0)
    return {
      items,
      slugs: cart.slugs,
      interval: cart.interval,
      total,
      yearlySaving,
      count: cart.slugs.length,
      has: (slug) => cart.slugs.includes(slug),
      add: (slug) => valid(slug) && setCart((c) => (c.slugs.includes(slug) ? c : { ...c, slugs: [...c.slugs, slug] })),
      remove: (slug) => setCart((c) => ({ ...c, slugs: c.slugs.filter((s) => s !== slug) })),
      setInterval: (interval) => setCart((c) => ({ ...c, interval: interval === 'year' ? 'year' : 'month' })),
      clear: () => setCart((c) => ({ ...c, slugs: [] })),
    }
  }, [cart])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
