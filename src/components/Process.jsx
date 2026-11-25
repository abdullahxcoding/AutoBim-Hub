import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Search, BarChart3, Wrench, Rocket } from 'lucide-react'
import { SectionHeader, Reveal } from './Reveal.jsx'

const steps = [
  { icon: Search, title: 'Understand', text: 'Identify your current workflow and challenges.' },
  { icon: BarChart3, title: 'Analyze', text: 'Evaluate opportunities for automation and improvement.' },
  { icon: Wrench, title: 'Develop', text: 'Build and test a tailored solution.' },
  { icon: Rocket, title: 'Deliver', text: 'Implement the solution and provide ongoing support where applicable.' },
]

export default function Process() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <section className="section process" id="process">
      <div className="container">
        <SectionHeader
          eyebrow="How we work"
          title="From Workflow Challenges to Working Solutions"
          align="center"
        />
        <div className="timeline" ref={ref}>
          <div className="tl-track" aria-hidden="true">
            <motion.div className="tl-fill" style={{ scaleX: progress }} />
            <motion.div className="tl-fill-v" style={{ scaleY: progress }} />
          </div>
          <ol>
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <Reveal as="li" key={s.title} delay={i * 0.12} className="step">
                  <div className="step-node"><Icon size={20} /></div>
                  <span className="step-num mono">0{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </Reveal>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
