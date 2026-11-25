import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle2, Loader2, Send } from 'lucide-react'

const TOPICS = [
  ['project', 'General project'],
  ['plugin', 'Custom Revit plugin'],
  ['pyrevit', 'pyRevit extension'],
  ['autocad', 'AutoCAD automation'],
  ['software', 'BIM software development'],
  ['consultancy', 'Automation consultancy'],
  ['other', 'Something else'],
]

/** Opens via window event 'abh:enquiry' (see contact() in data/site.js). */
export default function EnquiryModal() {
  const [open, setOpen] = useState(false)
  const [topic, setTopic] = useState('project')
  const [state, setState] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')
  const firstField = useRef(null)
  const lastFocus = useRef(null)

  useEffect(() => {
    const onOpen = (e) => {
      lastFocus.current = document.activeElement
      setTopic(e.detail || 'project')
      setState('idle')
      setError('')
      setOpen(true)
    }
    window.addEventListener('abh:enquiry', onOpen)
    return () => window.removeEventListener('abh:enquiry', onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => firstField.current?.focus(), 50)
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  function close() {
    setOpen(false)
    lastFocus.current?.focus?.()
  }

  async function submit(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    if (f.get('website')) return setState('done') // honeypot: silently drop bots
    const { supabase } = await import('../lib/supabase.js')
    if (!supabase) {
      setState('error')
      return setError('The form is not configured yet. Please try again later.')
    }
    setState('sending')
    setError('')
    // Insert only: no .select(), because visitors are not allowed to read rows back.
    const { error: err } = await supabase.from('enquiries').insert({
      name: f.get('name').trim(),
      email: f.get('email').trim(),
      company: f.get('company').trim() || null,
      topic: f.get('topic'),
      message: f.get('message').trim(),
    })
    if (err) {
      console.error(err)
      setState('error')
      setError('Something went wrong sending your message. Please try again.')
    } else {
      setState('done')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="enq-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button className="modal-close" onClick={close} aria-label="Close">
              <X size={18} />
            </button>

            {state === 'done' ? (
              <div className="modal-done">
                <CheckCircle2 size={44} />
                <h2 id="enq-title">Thanks, we&rsquo;ve got it.</h2>
                <p>We&rsquo;ll review your enquiry and get back to you by email.</p>
                <button className="btn btn-primary" onClick={close}>Close</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate={false}>
                <span className="eyebrow">Start a conversation</span>
                <h2 id="enq-title">Tell us about your workflow</h2>
                <p className="modal-sub">Describe the task or process you want to automate.</p>

                <div className="field-row">
                  <label className="field">
                    <span>Name *</span>
                    <input ref={firstField} name="name" required maxLength={120} autoComplete="name" />
                  </label>
                  <label className="field">
                    <span>Email *</span>
                    <input name="email" type="email" required maxLength={254} autoComplete="email" />
                  </label>
                </div>
                <div className="field-row">
                  <label className="field">
                    <span>Company</span>
                    <input name="company" maxLength={160} autoComplete="organization" />
                  </label>
                  <label className="field">
                    <span>Topic</span>
                    <select name="topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
                      {TOPICS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </label>
                </div>
                <label className="field">
                  <span>Message *</span>
                  <textarea name="message" required minLength={10} maxLength={5000} rows={5}
                    placeholder="e.g. We renumber and tag hundreds of doors per project by hand…" />
                </label>
                {/* Honeypot, hidden from people */}
                <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />

                {state === 'error' && <p className="form-error" role="alert">{error}</p>}

                <button className="btn btn-primary modal-submit" disabled={state === 'sending'}>
                  {state === 'sending' ? <><Loader2 size={16} className="spin" /> Sending…</> : <>Send enquiry <Send size={15} /></>}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
