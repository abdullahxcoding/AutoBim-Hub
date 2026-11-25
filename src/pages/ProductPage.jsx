import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, BookOpen, MessageSquare, Check, ChevronRight, Calendar, Tag } from 'lucide-react'
import { getProduct, downloadHref, PRODUCTS, TRIAL_DAYS } from '../data/products.js'
import { contact } from '../data/site.js'
import { soon } from '../components/Toast.jsx'
import AddToCartButton from '../components/AddToCartButton.jsx'
import { money } from '../lib/billing.js'
import NotFound from './NotFound.jsx'

const ease = [0.22, 1, 0.36, 1]
const fade = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: d, ease },
})

export default function ProductPage() {
  const { slug } = useParams()
  const p = getProduct(slug)

  useEffect(() => {
    if (p) document.title = `${p.name} ${p.version} — AutoBim Hub`
  }, [p])

  if (!p) return <NotFound />

  const Icon = p.icon
  const href = downloadHref(p)
  const others = PRODUCTS.filter((o) => o.slug !== p.slug).slice(0, 3)

  return (
    <div className="pp" style={{ '--c': p.color }}>
      <section className="pp-hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="container pp-hero-inner">
          <motion.nav className="crumbs" aria-label="Breadcrumb" {...fade()}>
            <Link to="/">Home</Link><ChevronRight size={14} />
            <Link to="/#products">Products</Link><ChevronRight size={14} />
            <span aria-current="page">{p.name}</span>
          </motion.nav>

          <div className="pp-title">
            <motion.div className="pp-icon" {...fade(0.05)}><Icon size={34} /></motion.div>
            <div>
              <motion.div className="pp-badges" {...fade(0.1)}>
                <span>{p.platform}</span>
                <span className="mono">v{p.version}</span>
                {p.released && (
                  <span><Calendar size={12} /> {new Date(p.released).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                )}
              </motion.div>
              <motion.h1 {...fade(0.12)}>{p.name}</motion.h1>
              <motion.p className="pp-tagline" {...fade(0.18)}>{p.tagline}</motion.p>
            </div>
          </div>

          <motion.div className="pp-actions" {...fade(0.26)}>
            {p.pricing && <AddToCartButton product={p} />}
            {href ? (
              <a className={`btn ${p.pricing ? 'btn-ghost' : 'btn-primary'}`} href={href} download={p.download.fileName || true}>
                <Download size={17} /> Download{p.download.size && <span className="btn-meta">{p.download.size}</span>}
              </a>
            ) : (
              <button className={`btn ${p.pricing ? 'btn-ghost' : 'btn-primary'}`} onClick={() => soon('The installer for this tool will be available soon.')}>
                <Download size={17} /> Download
              </button>
            )}
            {p.docs?.length > 0 && (
              <Link className="btn btn-ghost" to={`/products/${p.slug}/docs/${p.docs[0].slug}`}>
                <BookOpen size={17} /> Documentation
              </Link>
            )}
            <button className="btn btn-ghost" onClick={() => contact(p.pricing ? 'project' : 'other')}>
              <MessageSquare size={17} /> {p.pricing ? 'Request a quote' : 'Ask a question'}
            </button>
          </motion.div>
          {p.pricing && (
            <motion.p className="pp-trial-hint" {...fade(0.32)}>
              Free {TRIAL_DAYS}-day trial of every tool when you create an account · no card needed · downloading is always free.
            </motion.p>
          )}
        </div>
      </section>

      <section className="container pp-body">
        <div className="pp-main">
          <h2>Overview</h2>
          <p className="pp-desc">{p.description}</p>

          {p.features?.length > 0 && (
            <>
              <h2>Key features</h2>
              <ul className="pp-features">
                {p.features.map((f, i) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <span className="pp-check"><Check size={14} /></span>{f}
                  </motion.li>
                ))}
              </ul>
            </>
          )}

          {p.docs?.length > 0 && (
            <>
              <h2>Documentation</h2>
              <div className="pp-docs">
                {p.docs.map((d, i) => (
                  <Link key={d.slug} to={`/products/${p.slug}/docs/${d.slug}`}>
                    <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                    {d.title}
                    <ChevronRight size={16} />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="pp-side">
          <div className="pp-card pp-price-card">
            <h3><Tag size={16} /> Pricing</h3>
            {p.pricing ? (
              <>
                <p className="pp-price">
                  {money(p.pricing.month, p.pricing.currency)} / month
                  <span className="pp-per">per user</span>
                </p>
                <p className="pp-price-alt">
                  or {money(p.pricing.year, p.pricing.currency)} / year
                  <span className="pp-save">save {money(p.pricing.month * 12 - p.pricing.year, p.pricing.currency)}</span>
                </p>
                <p className="pp-trial-badge">{TRIAL_DAYS}-day free trial · no card</p>
                {p.pricing.note && <p className="pp-note">{p.pricing.note}</p>}
                <div className="pp-price-cta"><AddToCartButton product={p} className="btn btn-primary btn-sm" /></div>
              </>
            ) : (
              <p className="pp-price">Free</p>
            )}
          </div>
          {p.compatibility?.length > 0 && (
            <div className="pp-card">
              <h3>Compatibility</h3>
              <div className="pp-chips">
                {p.compatibility.map((c) => <span key={c}>{c}</span>)}
              </div>
            </div>
          )}
          {p.requirements?.length > 0 && (
            <div className="pp-card">
              <h3>Requirements</h3>
              <ul className="pp-req">
                {p.requirements.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </div>
          )}
        </aside>
      </section>

      {others.length > 0 && (
        <section className="container pp-more">
          <h2>More tools</h2>
          <div className="pp-more-grid">
            {others.map((o) => {
              const OI = o.icon
              return (
                <Link key={o.slug} to={`/products/${o.slug}`} className="pp-more-card" style={{ '--c': o.color }}>
                  <span className="pp-more-icon"><OI size={20} /></span>
                  <strong>{o.name}</strong>
                  <span>{o.tagline}</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
