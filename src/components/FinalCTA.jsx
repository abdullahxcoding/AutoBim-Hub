import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Reveal } from './Reveal.jsx'
import { contact } from '../data/site.js'

export default function FinalCTA() {
  return (
    <section className="cta-section" id="contact">
      <div className="container">
        <div className="cta">
          <svg className="cta-lines" viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true">
            {[60, 140, 220, 300].map((y, i) => (
              <motion.path
                key={y}
                d={`M0 ${y} C 300 ${y - 60}, 600 ${y + 60}, 1200 ${y - 20}`}
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: i * 0.15, ease: 'easeInOut' }}
              />
            ))}
          </svg>
          <Reveal className="cta-copy">
            <span className="eyebrow">Start a conversation</span>
            <h2>Let&rsquo;s Automate the Way You Work.</h2>
            <p>
              Have a repetitive BIM task or a workflow that needs improvement? Let&rsquo;s build a smarter
              solution together.
            </p>
            <div className="hero-ctas center">
              <button className="btn btn-primary" onClick={() => contact('project')}>
                Discuss Your Project <ArrowRight size={16} />
              </button>
              <button className="btn btn-ghost" onClick={() => contact('other')}>Contact Our Team</button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
