import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

/** Fades + lifts children into view once. */
export function Reveal({ children, delay = 0, y = 24, as = 'div', className, ...rest }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease }}
      {...rest}
    >
      {children}
    </M>
  )
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
export const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export function SectionHeader({ eyebrow, title, text, align = 'left', dark = false }) {
  return (
    <Reveal className={`section-head ${align === 'center' ? 'center' : ''} ${dark ? 'dark' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  )
}
