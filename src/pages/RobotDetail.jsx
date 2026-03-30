import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Download } from 'lucide-react'
import { useLang } from '../i18n'
import { getAllRobots } from '../data/registry'
import RobotIdCard from '../components/RobotIdCard'

export default function RobotDetail() {
  const { t } = useLang()
  const { id } = useParams()
  const robots = getAllRobots()
  const robot = robots.find((r) => r.id === decodeURIComponent(id))

  if (!robot) {
    return (
      <div style={{ padding: '120px 48px', textAlign: 'center', minHeight: '100vh', background: '#fafafa' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#111', marginBottom: 16 }}>Robot nie znaleziony</h1>
        <Link to="/rejestr" style={{ color: '#111', textDecoration: 'underline' }}>Wrocz do rejestru</Link>
      </div>
    )
  }

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 48px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link to="/rejestr" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'rgba(0,0,0,0.5)', fontSize: 13, fontWeight: 500, marginBottom: 32, transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#111'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.5)'}
          >
            <ArrowLeft size={16} /> Powrot do rejestru
          </Link>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
            <RobotIdCard robot={robot} />
          </div>

          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: 40, maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, color: '#111' }}>Szczegoly</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px' }}>
              <div><div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', marginBottom: 4 }}>Producent</div><div style={{ fontSize: 14, color: '#111' }}>{robot.manufacturer}</div></div>
              <div><div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', marginBottom: 4 }}>Miasto</div><div style={{ fontSize: 14, color: '#111' }}>{robot.ownerCity}</div></div>
              <div><div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', marginBottom: 4 }}>Certyfikacja</div><div style={{ fontSize: 14, color: '#111' }}>Poziom {robot.certLevel}</div></div>
              <div><div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', marginBottom: 4 }}>Zakres</div><div style={{ fontSize: 14, color: '#111' }}>{robot.operationalScope.replace(/_/g, ' ')}</div></div>
              <div style={{ gridColumn: '1 / -1' }}><div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', marginBottom: 4 }}>DID</div><div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', fontFamily: "'Space Mono', monospace" }}>{robot.didHash}</div></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
