import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Download, BookOpen } from 'lucide-react'
import { SectionHeader, Reveal } from './Reveal.jsx'
import { PRODUCTS } from '../data/products.js'

export default function Products() {
  const platforms = ['All', ...new Set(PRODUCTS.map((p) => p.platform))]
  const [filter, setFilter] = useState('All')
  const shown = PRODUCTS.filter((p) => filter === 'All' || p.platform === filter)

  return (
    <section className="section products" id="products">
      <div className="container">
        <div className="products-head">
          <SectionHeader
            eyebrow="Products & tools"
            title="Powerful Tools for Smarter Workflows"
            text="Discover practical automation tools designed to eliminate repetitive tasks and simplify everyday BIM operations."
          />
          {platforms.length > 2 && (
            <Reveal className="filters" role="tablist" aria-label="Filter tools by platform" delay={0.1}>
              {platforms.map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  className={filter === f ? 'active' : ''}
                  onClick={() => setFilter(f)}
                >
                  {filter === f && <motion.span layoutId="filter-pill" className="pill-bg" />}
                  <span>{f}</span>
                </button>
              ))}
            </Reveal>
          )}
        </div>

        <motion.ul layout className="product-grid">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => {
              const Icon = p.icon
              return (
                <motion.li
                  layout
                  key={p.slug}
                  className="product-card"
                  style={{ '--c': p.color }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                >
                  <Link to={`/products/${p.slug}`} className="product-link" aria-label={`${p.name} — view product`}>
                    <div className="tool-top">
                      <div className="product-icon"><Icon size={22} /></div>
                      <span className="badge mono">v{p.version}</span>
                    </div>
                    <h3>{p.name}</h3>
                    <p>{p.tagline}</p>
                    <div className="tool-foot">
                      <div className="compat">
                        <span>{p.platform}</span>
                        <span>{p.price ? p.price.label : 'Free'}</span>
                      </div>
                      <span className="icon-link" aria-hidden="true"><ArrowUpRight size={16} /></span>
                    </div>
                  </Link>
                  <div className="product-quick">
                    <Link to={`/products/${p.slug}`}><Download size={14} /> Download</Link>
                    {p.docs?.length > 0 && (
                      <Link to={`/products/${p.slug}/docs/${p.docs[0].slug}`}><BookOpen size={14} /> Docs</Link>
                    )}
                  </div>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  )
}
