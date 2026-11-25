import { motion } from 'framer-motion'
import { Puzzle, Workflow, Code2, PenTool, AppWindow, Compass, ArrowRight } from 'lucide-react'
import { SectionHeader, stagger, item } from './Reveal.jsx'
import { contact } from '../data/site.js'

function RibbonMock() {
  const btns = ['Renumber', 'Sheets', 'Audit', 'Export', 'Tag All']
  return (
    <div className="ribbon" aria-hidden="true">
      <div className="ribbon-tabs">
        <span>Architecture</span><span>Annotate</span><span className="on">Your Company</span>
      </div>
      <div className="ribbon-panel">
        {btns.map((b, i) => (
          <motion.span
            key={b}
            className="ribbon-btn"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.08 }}
          >
            <i />{b}
          </motion.span>
        ))}
      </div>
      <span className="ribbon-label mono">Custom add-in panel</span>
    </div>
  )
}

function FlowMock() {
  return (
    <svg className="flow-mock" viewBox="0 0 240 60" aria-hidden="true">
      <path d="M20 30 H220" className="flow-track" />
      <motion.path
        d="M20 30 H220"
        className="flow-run"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      />
      {[20, 87, 153, 220].map((x, i) => (
        <circle key={x} cx={x} cy="30" r={i === 3 ? 7 : 5} className={i === 3 ? 'flow-end' : 'flow-dot'} />
      ))}
    </svg>
  )
}

export default function Services() {
  return (
    <section className="section services" id="services">
      <div className="container">
        <SectionHeader
          eyebrow="Services"
          title="Engineering Solutions Beyond Standard Tools"
          text="When off-the-shelf tools don't fit, we design and build what your workflow actually needs."
          dark
        />
        <motion.div
          className="bento"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.article variants={item} className="b b-plugin">
            <div className="b-head">
              <Puzzle size={20} /><span className="mono">01</span>
            </div>
            <h3>Custom Revit Plugin Development</h3>
            <p>Development of custom Revit add-ins to solve specific project and organizational challenges.</p>
            <RibbonMock />
          </motion.article>

          <motion.article variants={item} className="b b-flow">
            <div className="b-head"><Workflow size={20} /><span className="mono">02</span></div>
            <h3>BIM Workflow Automation</h3>
            <p>Automating repetitive BIM processes to improve efficiency and reduce manual intervention.</p>
            <FlowMock />
          </motion.article>

          <motion.article variants={item} className="b b-py">
            <div className="b-head"><Code2 size={20} /><span className="mono">03</span></div>
            <h3>pyRevit Extension Development</h3>
            <p>Custom pyRevit tools and extensions tailored to engineering workflows.</p>
            <code className="b-code mono">extension.bundle / panel.stack / tool.pushbutton</code>
          </motion.article>

          <motion.article variants={item} className="b b-cad">
            <div className="b-head"><PenTool size={20} /><span className="mono">04</span></div>
            <h3>AutoCAD Automation</h3>
            <p>Custom scripts, plugins, and automation solutions for CAD-based processes.</p>
          </motion.article>

          <motion.article variants={item} className="b b-soft">
            <div className="b-head"><AppWindow size={20} /><span className="mono">05</span></div>
            <h3>BIM Software Development</h3>
            <p>Building tailored desktop and web-based applications for BIM and engineering workflows.</p>
            <div className="b-windows" aria-hidden="true"><span /><span /></div>
          </motion.article>

          <motion.article variants={item} className="b b-consult">
            <div className="b-consult-copy">
              <div className="b-head"><Compass size={20} /><span className="mono">06</span></div>
              <h3>BIM Automation Consultancy</h3>
              <p>
                Helping organizations identify workflow inefficiencies and implement practical automation solutions.
              </p>
            </div>
            <button className="btn btn-light" onClick={() => contact('consultancy')}>
              Book a workflow review <ArrowRight size={16} />
            </button>
          </motion.article>
        </motion.div>
      </div>
    </section>
  )
}
