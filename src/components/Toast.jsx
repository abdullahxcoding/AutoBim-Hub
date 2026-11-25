import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Info } from 'lucide-react'

/** Lightweight global toast for links whose destination isn't built yet. */
export function soon(message = 'This page is coming soon.') {
  window.dispatchEvent(new CustomEvent('abh:toast', { detail: message }))
}

export default function Toast() {
  const [msg, setMsg] = useState(null)
  useEffect(() => {
    let t
    const on = (e) => {
      setMsg(e.detail)
      clearTimeout(t)
      t = setTimeout(() => setMsg(null), 3200)
    }
    window.addEventListener('abh:toast', on)
    return () => {
      window.removeEventListener('abh:toast', on)
      clearTimeout(t)
    }
  }, [])
  return (
    <div className="toast-region" role="status" aria-live="polite">
      <AnimatePresence>
        {msg && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Info size={16} /> {msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
