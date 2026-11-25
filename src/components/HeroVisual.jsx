import { motion } from 'framer-motion'
import { Check, Play, Table2, Workflow } from 'lucide-react'

/* Isometric projection helpers */
const S = 38, OX = 270, OY = 250
const P = (x, y, z = 0) => [OX + (x - y) * 0.866 * S, OY + (x + y) * 0.5 * S - z * S]
const pt = (a) => a.join(',')
const poly = (pts) => pts.map(pt).join(' ')
const line = (a, b) => `M${pt(a)} L${pt(b)}`

const W = 6, D = 4, FLOORS = 5, H = 1.1
const SEL = 3 // highlighted level
const ease = [0.22, 1, 0.36, 1]

const planPaths = [
  ...[0, 3, 6].map((x) => ({ d: line(P(x, -0.9), P(x, D + 0.9)), grid: true })),
  ...[0, 2, 4].map((y) => ({ d: line(P(-0.9, y), P(W + 0.9, y)), grid: true })),
  { d: `M${poly([P(0, 0), P(W, 0), P(W, D), P(0, D)])}Z` },
  { d: line(P(3, 0), P(3, D)) },
  { d: line(P(0, 2), P(3, 2)) },
  { d: line(P(4.6, 2), P(W, 2)) },
]
const columns = [[0, 0], [3, 0], [W, 0], [W, 2], [W, D], [3, D], [0, D], [0, 2]]

const rows = [['D-301', '60 min'], ['D-302', '60 min'], ['W-305', '—'], ['D-306', '90 min']]
const nodes = [
  [6, 12, 'Select', 56],
  [6, 42, 'Filter', 56],
  [120, 40, 'Set Param', 58],
  [208, 16, 'Sheets', 46],
]

export default function HeroVisual() {
  const [tx, ty] = P(W, D, SEL * H)
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hv-glow" />
      <svg viewBox="0 0 540 500" className="hv-model">
        <defs>
          <linearGradient id="slab" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3B7BFF" stopOpacity="0.32" />
            <stop offset="1" stopColor="#3B7BFF" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="slabSel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2DD4BF" stopOpacity="0.55" />
            <stop offset="1" stopColor="#2DD4BF" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {planPaths.map((p, i) => (
          <motion.path
            key={i}
            d={p.d}
            fill="none"
            stroke={p.grid ? '#5B7BB8' : '#8FB2FF'}
            strokeOpacity={p.grid ? 0.4 : 0.85}
            strokeWidth={p.grid ? 0.8 : 1.4}
            strokeDasharray={p.grid ? '4 5' : undefined}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.1 + i * 0.04, ease }}
          />
        ))}

        {['A', 'B', 'C'].map((t, i) => {
          const [x, y] = P(i * 3, -1.4)
          return (
            <motion.g key={t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <circle cx={x} cy={y} r="9" fill="#0B1424" stroke="#5B7BB8" />
              <text x={x} y={y + 3.5} textAnchor="middle" className="hv-bubble">{t}</text>
            </motion.g>
          )
        })}

        {columns.map(([x, y], i) => (
          <motion.path
            key={i}
            d={line(P(x, y, 0), P(x, y, FLOORS * H))}
            stroke="#8FB2FF"
            strokeOpacity="0.5"
            strokeWidth="1.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 0.5 + i * 0.03, ease }}
          />
        ))}

        {Array.from({ length: FLOORS + 1 }, (_, i) => {
          const z = i * H
          const sel = i === SEL
          const c = sel ? '#2DD4BF' : '#8FB2FF'
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 + i * 0.08, ease }}
            >
              <polygon
                points={poly([P(0, 0, z), P(W, 0, z), P(W, D, z), P(0, D, z)])}
                fill={sel ? 'url(#slabSel)' : 'url(#slab)'}
                stroke={c}
                strokeOpacity={sel ? 1 : 0.7}
                strokeWidth={sel ? 1.6 : 1}
              />
              <path
                d={`M${pt(P(0, D, z))} L${pt(P(0, D, z - 0.12))} L${pt(P(W, D, z - 0.12))} L${pt(P(W, 0, z - 0.12))} L${pt(P(W, 0, z))}`}
                fill="none"
                stroke={c}
                strokeOpacity="0.45"
              />
            </motion.g>
          )
        })}

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
          <circle cx={tx} cy={ty} r="4" fill="#2DD4BF" className="hv-pulse" />
          <path d={`M${tx},${ty} l30,16 h58`} stroke="#2DD4BF" fill="none" />
          <text x={tx + 36} y={ty + 11} className="hv-tag">Level 03</text>
        </motion.g>
      </svg>

      <motion.div
        className="panel panel-table"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.8, ease }}
      >
        <div className="float-a">
          <div className="panel-bar"><Table2 size={13} /> Parameters · Level 03</div>
          <table>
            <thead><tr><th>Mark</th><th>Fire Rating</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map(([m, f], i) => (
                <tr key={m}>
                  <td className="mono">{m}</td>
                  <td>{f}</td>
                  <td>
                    <motion.span
                      className="ok"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.4 + i * 0.15 }}
                    >
                      <Check size={11} /> synced
                    </motion.span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        className="panel panel-code"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.8, ease }}
      >
        <div className="float-b">
          <div className="panel-bar">
            <span className="dots"><i /><i /><i /></span> renumber_doors.py
          </div>
          <pre className="mono">
            <span className="k">from</span> pyrevit <span className="k">import</span> revit, DB{'\n'}
            doors = <span className="f">collect</span>(<span className="s">"Doors"</span>){'\n'}
            <span className="k">with</span> revit.<span className="f">Transaction</span>(<span className="s">"Renumber"</span>):{'\n'}
            {'  '}<span className="k">for</span> i, d <span className="k">in</span> <span className="f">enumerate</span>(doors):{'\n'}
            {'    '}d.<span className="f">Set</span>(<span className="s">"Mark"</span>, <span className="f">tag</span>(i))
          </pre>
          <div className="run"><Play size={11} /> Running on active view<span className="cursor" /></div>
        </div>
      </motion.div>

      <motion.div
        className="panel panel-graph"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8, ease }}
      >
        <div className="float-c">
          <div className="panel-bar"><Workflow size={13} /> Automation graph</div>
          <svg viewBox="0 0 260 72" className="graph">
            {['M62 22 C 90 22, 92 50, 120 50', 'M62 52 C 90 52, 92 50, 120 50', 'M178 50 C 196 50, 192 26, 208 26'].map(
              (d, i) => <path key={i} d={d} className="wire" />
            )}
            {nodes.map(([x, y, t, w]) => (
              <g key={t}>
                <rect x={x} y={y} width={w} height="20" rx="4" className="node" />
                <text x={x + w / 2} y={y + 13.5} textAnchor="middle" className="node-t">{t}</text>
              </g>
            ))}
          </svg>
        </div>
      </motion.div>

      <motion.div className="hv-chips" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <span><i style={{ background: '#3B7BFF' }} />Revit</span>
        <span><i style={{ background: '#F2B33D' }} />pyRevit</span>
        <span><i style={{ background: '#E5484D' }} />AutoCAD</span>
      </motion.div>
    </div>
  )
}
