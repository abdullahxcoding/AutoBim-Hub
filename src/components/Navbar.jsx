import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Menu, X, ArrowRight, User, ShoppingCart } from 'lucide-react'
import { NAV } from '../data/content.js'
import { useAuth } from '../lib/AuthContext.jsx'
import { useCart } from '../lib/CartContext.jsx'

export function Logo({ light = true }) {
  return (
    <Link to="/" className={`logo ${light ? 'light' : ''}`} aria-label="AutoBim Hub home">
      <img src="/logo.svg" alt="" width="34" height="34" />
      <span>AutoBim<b>Hub</b></span>
    </Link>
  )
}

export default function Navbar() {
  const { pathname, hash } = useLocation()
  const { user, configured } = useAuth()
  const { count } = useCart()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && (setOpen(null), setMobile(false))
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Close menus whenever the route changes
  useEffect(() => {
    setOpen(null)
    setMobile(false)
  }, [pathname, hash])

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : ''
  }, [mobile])

  const solid = scrolled || !isHome

  return (
    <header className={`nav ${solid ? 'scrolled' : ''} ${isHome ? '' : 'inner'}`}>
      <div className="container nav-inner">
        <Logo />
        <nav aria-label="Primary" className="nav-links">
          <ul>
            {NAV.map((n) => (
              <li
                key={n.label}
                onMouseEnter={() => n.menu && setOpen(n.label)}
                onMouseLeave={() => setOpen(null)}
              >
                {n.menu ? (
                  <button
                    className="nav-link"
                    aria-expanded={open === n.label}
                    aria-haspopup="true"
                    onClick={() => setOpen(open === n.label ? null : n.label)}
                  >
                    {n.label} <ChevronDown size={14} className="chev" />
                  </button>
                ) : (
                  <Link className="nav-link" to={n.href}>{n.label}</Link>
                )}
                <AnimatePresence>
                  {n.menu && open === n.label && (
                    <motion.div
                      className={`mega ${n.menu.links.length > 4 ? 'wide' : ''}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="mega-intro">
                        <span className="eyebrow">{n.menu.title}</span>
                        <p>{n.menu.blurb}</p>
                        <Link to={n.href} className="text-link">
                          View all <ArrowRight size={14} />
                        </Link>
                      </div>
                      <ul className="mega-links">
                        {n.menu.links.map((l) => {
                          const Icon = l.icon
                          return (
                            <li key={l.label}>
                              <Link to={l.href} className={Icon ? 'has-icon' : ''}>
                                {Icon && <span className="mega-icon" style={{ '--c': l.color }}><Icon size={16} /></span>}
                                <span>
                                  <strong>{l.label}</strong>
                                  <span>{l.desc}</span>
                                </span>
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </nav>
        {user && !isHome && (
          <Link to="/cart" className="nav-cart" aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}>
            <ShoppingCart size={18} />
            {count > 0 && <span className="nav-cart-count">{count}</span>}
          </Link>
        )}
        {configured && (
          user ? (
            <Link to="/account" className="nav-account" aria-label="My account">
              <User size={16} /> <span>Account</span>
            </Link>
          ) : (
            <Link to="/login" className="nav-account" aria-label="Log in">
              <User size={16} /> <span>Log in</span>
            </Link>
          )
        )}
        <button
          className="burger"
          aria-label={mobile ? 'Close menu' : 'Open menu'}
          aria-expanded={mobile}
          onClick={() => setMobile(!mobile)}
        >
          {mobile ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobile && (
          <motion.nav
            aria-label="Mobile"
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {NAV.map((n) => (
              <div key={n.label} className="m-group">
                <Link to={n.href}>{n.label}</Link>
                {n.menu && (
                  <div className="m-sub">
                    {n.menu.links.map((l) => (
                      <Link key={l.label} to={l.href}>{l.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {user && (
              <Link to="/cart" className="btn btn-ghost">
                <ShoppingCart size={16} /> Cart{count > 0 ? ` (${count})` : ''}
              </Link>
            )}
            {configured && (
              <Link to={user ? '/account' : '/login'} className="btn btn-primary">
                <User size={16} /> {user ? 'My account' : 'Log in'}
              </Link>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
