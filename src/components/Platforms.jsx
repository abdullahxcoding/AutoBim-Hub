import { motion } from 'framer-motion'
import { SectionHeader, stagger, item } from './Reveal.jsx'

const platforms = [
  {
    name: 'Autodesk Revit',
    mark: 'R',
    color: '#3B7BFF',
    text: 'Add-ins that automate modelling, documentation and data tasks inside Revit.',
    tags: ['Add-ins', 'Batch tasks'],
  },
  {
    name: 'pyRevit',
    mark: 'py',
    color: '#F2B33D',
    text: 'Python-powered extensions and ribbon tools, deployable across a team.',
    tags: ['Extensions', 'Python'],
  },
  {
    name: 'Autodesk AutoCAD',
    mark: 'A',
    color: '#E5484D',
    text: 'Plugins and scripts for drawing cleanup, batch processing and standards.',
    tags: ['.NET', 'AutoLISP'],
  },
  {
    name: 'Dynamo',
    mark: 'Dy',
    color: '#2DD4BF',
    text: 'Visual graphs and custom nodes for rule-based, repeatable design logic.',
    tags: ['Graphs', 'Custom nodes'],
  },
  {
    name: 'Revit API',
    mark: '</>',
    color: '#9B8CFF',
    text: 'Direct C# / .NET development for deep, high-performance integrations.',
    tags: ['C#', '.NET'],
  },
]

export default function Platforms() {
  return (
    <section className="section platforms" id="platforms">
      <div className="container">
        <div className="platforms-head">
          <SectionHeader
            eyebrow="Software ecosystem"
            title="Built Around the Tools You Already Use"
            text="We develop automation solutions that integrate with the software and technologies powering modern AEC workflows."
          />
        </div>
        <motion.ul
          className="platform-grid"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {platforms.map((p, i) => (
            <motion.li key={p.name} variants={item} className="platform" style={{ '--c': p.color }}>
              <div className="platform-top">
                <span className="platform-mark">{p.mark}</span>
                <span className="platform-idx mono">0{i + 1}</span>
              </div>
              <h3>{p.name}</h3>
              <p>{p.text}</p>
              <div className="platform-tags">
                {p.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
              <span className="platform-line" aria-hidden="true" />
            </motion.li>
          ))}
        </motion.ul>
        <p className="fineprint">
          Autodesk, Revit, AutoCAD and Dynamo are trademarks of Autodesk, Inc. pyRevit is an open-source project.
          We build on these platforms and are not affiliated with or endorsed by their owners.
        </p>
      </div>
    </section>
  )
}
