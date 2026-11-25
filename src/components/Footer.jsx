import { Link } from 'react-router-dom'
import { Logo } from './Navbar.jsx'
import { soon } from './Toast.jsx'
import { SITE, contact } from '../data/site.js'

const cols = [
  { title: 'Company', links: [['About Us', '/#why-us'], ['Contact', 'enquiry']] },
  {
    title: 'Solutions',
    links: [
      ['Revit Automation', '/#services'],
      ['pyRevit Development', '/#services'],
      ['AutoCAD Automation', '/#services'],
      ['Custom BIM Development', '/#services'],
    ],
  },
  { title: 'Resources', links: [['Products & Tools', '/#products'], ['Documentation', null], ['Tutorials', null]] },
  { title: 'Legal', links: [['Privacy Policy', null], ['Terms & Conditions', null]] },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p>
              BIM automation tools, custom Revit plugins and software solutions for architecture,
              engineering and construction teams.
            </p>
            {SITE.social.length > 0 && (
              <ul className="social">
                {SITE.social.map((s) => (
                  <li key={s.label}><a href={s.href} target="_blank" rel="noreferrer">{s.label}</a></li>
                ))}
              </ul>
            )}
          </div>
          {cols.map((c) => (
            <nav key={c.title} className="footer-col" aria-label={c.title}>
              <h4>{c.title}</h4>
              <ul>
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    {href === 'enquiry' ? (
                      <button onClick={() => contact()}>{label}</button>
                    ) : href ? (
                      <Link to={href}>{label}</Link>
                    ) : (
                      <button onClick={() => soon(`${label} is coming soon.`)}>{label}</button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <span className="mono">Revit · pyRevit · Dynamo · AutoCAD · Revit API</span>
        </div>
      </div>
    </footer>
  )
}
