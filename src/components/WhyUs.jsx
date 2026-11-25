import { motion } from 'framer-motion'
import { Building2, Zap, Ruler, Cpu } from 'lucide-react'
import { SectionHeader, Reveal } from './Reveal.jsx'

const points = [
  { icon: Building2, title: 'Industry-Focused Solutions', text: 'Designed around real AEC workflows and challenges.' },
  { icon: Zap, title: 'Practical Automation', text: 'Focused on solving repetitive tasks and improving productivity.' },
  { icon: Ruler, title: 'Tailored Development', text: 'Solutions designed around specific project requirements.' },
  { icon: Cpu, title: 'Technology-Driven Approach', text: 'Using modern APIs, scripting, and software development technologies.' },
]

/** Blueprint illustration: a messy manual path resolved into a clean automated one. */
function Blueprint() {
  const draw = (delay) => ({
    initial: { pathLength: 0 },
    whileInView: { pathLength: 1 },
    viewport: { once: true },
    transition: { duration: 1.6, delay, ease: [0.22, 1, 0.36, 1] },
  })
  return (
    <svg viewBox="0 0 420 300" className="blueprint" aria-hidden="true">
      <defs>
        <pattern id="bp" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity="0.08" />
        </pattern>
      </defs>
      <rect width="420" height="300" fill="url(#bp)" />
      <text x="24" y="34" className="bp-label">MANUAL</text>
      <motion.path
        d="M40 70 L90 50 L110 110 L160 70 L150 140 L210 120 L190 180 L240 150"
        className="bp-messy"
        {...draw(0.1)}
      />
      {[[40, 70], [110, 110], [150, 140], [190, 180]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3.5" className="bp-dot-muted" />
      ))}
      <text x="24" y="232" className="bp-label accent">AUTOMATED</text>
      <motion.path d="M40 260 H380" className="bp-clean" {...draw(0.6)} />
      {[40, 150, 265, 380].map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy="260"
          r="6"
          className="bp-dot"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 + i * 0.2 }}
        />
      ))}
      {/* dimension line */}
      <path d="M40 285 H380 M40 280 V290 M380 280 V290" className="bp-dim" />
      <text x="210" y="298" textAnchor="middle" className="bp-label">one repeatable run</text>
      <motion.path d="M240 150 C 320 150, 330 210, 380 252" className="bp-arrow" {...draw(1.2)} />
    </svg>
  )
}

export default function WhyUs() {
  return (
    <section className="section why" id="why-us">
      <div className="container why-inner">
        <div className="why-left">
          <SectionHeader
            eyebrow="Why choose us"
            title="Turning Complex Workflows Into Simple Solutions"
            text="We focus on the parts of BIM work that slow teams down, and turn them into dependable, repeatable tools."
          />
          <Reveal delay={0.15} className="blueprint-card">
            <Blueprint />
          </Reveal>
        </div>
        <ol className="why-list">
          {points.map((p, i) => {
            const Icon = p.icon
            return (
              <Reveal as="li" key={p.title} delay={i * 0.08} className="why-item">
                <span className="why-num mono">0{i + 1}</span>
                <div className="why-icon"><Icon size={20} /></div>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
