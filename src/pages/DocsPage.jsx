import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Search, ChevronLeft, ChevronRight, Menu, X, Download } from 'lucide-react'
import { getProduct, downloadHref } from '../data/products.js'
import NotFound from './NotFound.jsx'

// All doc files, loaded on demand: { '../content/docs/<slug>/<page>.md': () => Promise<string> }
const files = import.meta.glob('../content/docs/*/*.md', { query: '?raw', import: 'default' })

export default function DocsPage() {
  const { slug, page } = useParams()
  const p = getProduct(slug)
  const [md, setMd] = useState(null)
  const [query, setQuery] = useState('')
  const [navOpen, setNavOpen] = useState(false)

  const docs = p?.docs || []
  const idx = docs.findIndex((d) => d.slug === page)
  const current = docs[idx]

  useEffect(() => {
    if (!current) return
    document.title = `${current.title} · ${p.name} Docs — AutoBim Hub`
    setMd(null)
    setNavOpen(false)
    const load = files[`../content/docs/${slug}/${current.slug}.md`]
    if (!load) return setMd(`# ${current.title}\n\nThis page hasn't been written yet.`)
    let alive = true
    load().then((text) => alive && setMd(text))
    return () => { alive = false }
  }, [slug, current, p])

  const filtered = useMemo(
    () => docs.filter((d) => d.title.toLowerCase().includes(query.trim().toLowerCase())),
    [docs, query]
  )

  if (!p) return <NotFound />
  if (!docs.length) return <NotFound />
  if (!page || !current) return <Navigate to={`/products/${slug}/docs/${docs[0].slug}`} replace />

  const Icon = p.icon
  const prev = docs[idx - 1]
  const next = docs[idx + 1]
  const href = downloadHref(p)

  // Relative links inside Markdown ("installation") become in-app links.
  const components = {
    a({ href: h = '', children, ...rest }) {
      if (/^(https?:|mailto:)/.test(h)) return <a href={h} target="_blank" rel="noreferrer" {...rest}>{children}</a>
      if (h.startsWith('#')) return <a href={h} {...rest}>{children}</a>
      const to = h.startsWith('/') ? h : `/products/${slug}/docs/${h.replace(/\.md$/, '')}`
      return <Link to={to}>{children}</Link>
    },
    img: (props) => <img loading="lazy" {...props} />,
  }

  return (
    <div className="docs" style={{ '--c': p.color }}>
      <div className="docs-mobilebar">
        <button onClick={() => setNavOpen(!navOpen)} aria-expanded={navOpen}>
          {navOpen ? <X size={18} /> : <Menu size={18} />} {current.title}
        </button>
      </div>

      <aside className={`docs-side ${navOpen ? 'open' : ''}`}>
        <Link to={`/products/${slug}`} className="docs-product">
          <span className="docs-picon"><Icon size={20} /></span>
          <span>
            <strong>{p.name}</strong>
            <small className="mono">v{p.version} · Documentation</small>
          </span>
        </Link>
        <label className="docs-search">
          <Search size={15} />
          <input
            placeholder="Search pages"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search documentation pages"
          />
        </label>
        <nav aria-label={`${p.name} documentation`}>
          <ul>
            {filtered.map((d) => (
              <li key={d.slug}>
                <Link to={`/products/${slug}/docs/${d.slug}`} className={d.slug === page ? 'active' : ''}>
                  {d.title}
                </Link>
              </li>
            ))}
            {!filtered.length && <li className="docs-empty">No pages match “{query}”.</li>}
          </ul>
        </nav>
        {href && (
          <a className="btn btn-primary btn-sm docs-dl" href={href} download={p.download.fileName || true}>
            <Download size={15} /> Download v{p.version}
          </a>
        )}
      </aside>

      <article className="docs-content">
        {md === null ? (
          <div className="docs-skeleton" aria-busy="true"><i /><i /><i /><i /></div>
        ) : (
          <div className="prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{md}</ReactMarkdown>
          </div>
        )}
        <nav className="docs-pager" aria-label="Pagination">
          {prev ? (
            <Link to={`/products/${slug}/docs/${prev.slug}`}><ChevronLeft size={16} /><span><small>Previous</small>{prev.title}</span></Link>
          ) : <span />}
          {next && (
            <Link to={`/products/${slug}/docs/${next.slug}`} className="next"><span><small>Next</small>{next.title}</span><ChevronRight size={16} /></Link>
          )}
        </nav>
      </article>
    </div>
  )
}
