import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useLang } from '../i18n'
import { getAllRobots, statusLabels } from '../data/registry'
import RobotIdCard from '../components/RobotIdCard'

const classes = ['ALL', 'H1', 'H2', 'I1', 'I2', 'AV']
const statuses = ['ALL', 'AKTYWNY', 'NIEAKTYWNY', 'ZAWIESZONY']

export default function Rejestr() {
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const [filterClass, setFilterClass] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const robots = useMemo(() => getAllRobots(), [])

  const filtered = robots.filter((r) => {
    const q = query.toLowerCase()
    const matchesQuery = !q || r.id.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.owner.toLowerCase().includes(q)
    const matchesClass = filterClass === 'ALL' || r.riskClass === filterClass
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus
    return matchesQuery && matchesClass && matchesStatus
  })

  const pillStyle = (active) => ({
    padding: '6px 16px',
    fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
    border: active ? '1px solid #111' : '1px solid rgba(0,0,0,0.12)',
    background: active ? '#111' : 'transparent',
    color: active ? '#fff' : 'rgba(0,0,0,0.5)',
    cursor: 'pointer', transition: 'all 0.2s',
  })

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 48px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 16 }}>{t.rejestr_label}</div>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111', lineHeight: 1.1 }}>
            {t.rejestr_title} <span style={{ color: 'rgba(0,0,0,0.25)' }}>{t.rejestr_subtitle}</span>
          </h1>
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', marginBottom: 24 }}>
          <Search size={18} color="rgba(0,0,0,0.3)" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search_placeholder}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, fontFamily: "'Space Grotesk', sans-serif", background: 'transparent', color: '#111' }} />
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {classes.map((c) => (<button key={c} onClick={() => setFilterClass(c)} style={pillStyle(filterClass === c)}>{c === 'ALL' ? t.filter_all : c}</button>))}
          <div style={{ width: 1, background: 'rgba(0,0,0,0.08)', margin: '0 8px' }} />
          {statuses.map((s) => (<button key={s} onClick={() => setFilterStatus(s)} style={pillStyle(filterStatus === s)}>{s === 'ALL' ? t.filter_all : (statusLabels[s]?.label || s)}</button>))}
        </div>

        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', marginBottom: 24 }}>
          {robots.length} {t.results_count} &middot; {filtered.length} {t.results_shown}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map((robot, i) => (
            <motion.div key={robot.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.03 }}>
              <Link to={'/rejestr/' + encodeURIComponent(robot.id)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <RobotIdCard robot={robot} compact />
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: 80, textAlign: 'center', color: 'rgba(0,0,0,0.3)', fontSize: 14 }}>
            Brak wynikow dla podanych filtrow.
          </div>
        )}
      </div>
    </div>
  )
}
