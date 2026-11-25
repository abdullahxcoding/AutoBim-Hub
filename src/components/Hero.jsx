import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import HeroVisual from './HeroVisual.jsx'
import { contact } from '../data/site.js'

const ease = [0.22, 1, 0.36, 1]
const fade = (d) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: d, ease },
})

export default function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 60])

  return (
    <section className="hero" id="top">
      <div className="hero-grid" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <motion.span className="eyebrow eyebrow-pill" {...fade(0.05)}>
            <i /> BIM automation &amp; AEC software
          </motion.span>
          <motion.h1 {...fade(0.15)}>
            Smarter BIM Workflows. <span className="grad">Less Manual Work.</span>
          </motion.h1>
          <motion.p className="lead" {...fade(0.28)}>
            We build intelligent BIM automation tools, custom Revit plugins, and software solutions
            that simplify complex engineering workflows and help AEC professionals work smarter.
          </motion.p>
          <motion.div className="hero-ctas" {...fade(0.4)}>
            <a href="#products" className="btn btn-primary">
              Explore Our Solutions <ArrowRight size={16} />
            </a>
            <button className="btn btn-ghost" onClick={() => contact('project')}>Discuss Your Project</button>
          </motion.div>
          <motion.ul className="hero-stack" aria-label="Technologies" {...fade(0.55)}>
            {['Revit API', 'pyRevit', 'Dynamo', 'AutoCAD', 'C# / .NET', 'Python'].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </motion.ul>
        </div>
        <motion.div style={{ y }} className="hero-visual-wrap">
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  )
}
