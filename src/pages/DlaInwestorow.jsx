import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, Database, Globe, Award } from 'lucide-react'
import { useLang } from '../i18n'

function AnimatedStat({ value, label, prefix = '', suffix = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111' }}>{prefix}{value}{suffix}</div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginTop: 8 }}>{label}</div>
    </motion.div>
  )
}

function BarChart({ data, title }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const max = Math.max(...data.map(d => d.value))
  return (
    <div ref={ref} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: 32 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 24 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.map((d, i) => (
          <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 56, fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.5)', textAlign: 'right', flexShrink: 0 }}>{d.label}</div>
            <div style={{ flex: 1, height: 24, background: '#f5f5f5', position: 'relative', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={inView ? { width: `${(d.value / max) * 100}%` } : {}} transition={{ duration: 0.8, delay: i * 0.1, ease: [.22, 1, .36, 1] }} style={{ height: '100%', background: d.color || '#111' }} />
            </div>
            <div style={{ width: 48, fontSize: 12, fontWeight: 600, color: '#111', flexShrink: 0 }}>{d.display}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LineChart({ points, title, yLabel }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const maxY = Math.max(...points.map(p => p.y))
  const w = 500, h = 200, pad = 40
  const toX = (i) => pad + (i / (points.length - 1)) * (w - pad * 2)
  const toY = (v) => h - pad - (v / maxY) * (h - pad * 2)
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p.y)}`).join(' ')
  const areaD = pathD + ` L ${toX(points.length - 1)} ${h - pad} L ${toX(0)} ${h - pad} Z`
  return (
    <div ref={ref} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: 32 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 20 }}>{title}</div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const y = h - pad - f * (h - pad * 2)
          const val = Math.round(f * maxY)
          return (<g key={f}><line x1={pad} y1={y} x2={w - pad} y2={y} stroke="rgba(0,0,0,0.06)" /><text x={pad - 8} y={y + 4} textAnchor="end" fontSize={9} fill="rgba(0,0,0,0.35)">{val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}</text></g>)
        })}
        {points.map((p, i) => (<text key={i} x={toX(i)} y={h - pad + 18} textAnchor="middle" fontSize={10} fill="rgba(0,0,0,0.4)">{p.x}</text>))}
        <motion.path d={areaD} fill="rgba(17,17,17,0.04)" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1 }} />
        <motion.path d={pathD} fill="none" stroke="#111" strokeWidth={2} initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : {}} transition={{ duration: 1.5, ease: [.22, 1, .36, 1] }} />
        {points.map((p, i) => (<motion.circle key={i} cx={toX(i)} cy={toY(p.y)} r={3} fill="#111" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 + i * 0.1 }} />))}
        <text x={4} y={pad - 8} fontSize={9} fill="rgba(0,0,0,0.35)">{yLabel}</text>
      </svg>
    </div>
  )
}

export default function DlaInwestorow() {
  const { t } = useLang()
  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      <section style={{ padding: '140px 48px 80px', background: 'linear-gradient(170deg, #fff 0%, #f7f7f7 100%)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 16 }}>{t.inwestorzy_label}</div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 72px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111', lineHeight: 1.1, marginBottom: 32 }}>
              Rynek robotyzacji<br /><span style={{ color: 'rgba(0,0,0,0.25)' }}>to rynek przyszłości</span>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: 'rgba(0,0,0,0.6)', maxWidth: 700 }}>
              PESER to pierwszy i jedyny system rejestracji robotów w Europie Środkowo-Wschodniej. Z mandatem rządowym i rosnącym rynkiem robotów autonomicznych, PESER ma szansę stać się ogólnopolskim standardem — a docelowo europejskim wzorcem.
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48 }}>
          <AnimatedStat prefix="€" value="72" suffix="B" label="Globalny rynek robotów 2030" />
          <AnimatedStat value="55 000" label="Robotów w Polsce do 2030" delay={0.1} />
          <AnimatedStat value="25" suffix="%" label="Roczny wzrost (CAGR)" delay={0.2} />
          <AnimatedStat value="1" suffix="st" label="Pierwszy system w CEE" delay={0.3} />
        </div>
      </section>

      <section style={{ background: '#fafafa', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '100px 48px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 16 }}>DANE RYNKOWE</div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111' }}>Wzrost <span style={{ color: 'rgba(0,0,0,0.25)' }}>w liczbach</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24 }}>
            <LineChart points={[{ x: '2022', y: 3900 }, { x: '2023', y: 5200 }, { x: '2024', y: 7800 }, { x: '2025', y: 12000 }, { x: '2026', y: 18500 }, { x: '2027', y: 28000 }, { x: '2028', y: 38000 }, { x: '2030', y: 55000 }]} title="Prognoza robotów w Polsce (szt.)" yLabel="szt." />
            <LineChart points={[{ x: '2024', y: 12 }, { x: '2025', y: 16 }, { x: '2026', y: 22 }, { x: '2027', y: 31 }, { x: '2028', y: 42 }, { x: '2029', y: 55 }, { x: '2030', y: 72 }]} title="Globalny rynek robotów (€ mld)" yLabel="€ mld" />
            <BarChart data={[{ label: 'Logistyka', value: 34, display: '34%', color: '#111' }, { label: 'Przemysł', value: 28, display: '28%', color: '#333' }, { label: 'Usługi', value: 18, display: '18%', color: '#555' }, { label: 'Transport', value: 12, display: '12%', color: '#777' }, { label: 'Edukacja', value: 8, display: '8%', color: '#999' }]} title="Segmenty rynku robotów w Polsce" />
            <BarChart data={[{ label: 'Rejestracja', value: 45, display: '45%', color: '#111' }, { label: 'Certyfikacja', value: 25, display: '25%', color: '#333' }, { label: 'API', value: 15, display: '15%', color: '#555' }, { label: 'Audyt', value: 10, display: '10%', color: '#777' }, { label: 'Inne', value: 5, display: '5%', color: '#999' }]} title="Struktura przychodów PESER (prognoza)" />
          </div>
        </div>
      </section>

      <section style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '100px 48px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 16 }}>TEZA INWESTYCYJNA</div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111' }}>Dlaczego <span style={{ color: 'rgba(0,0,0,0.25)' }}>PESER</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
            {[
              { icon: Award, title: 'Mandat rządowy', desc: 'Współpraca z Ministerstwem Cyfryzacji i GovTech Polska. EU AI Act wymaga rejestracji robotów wysokiego ryzyka od 2026.' },
              { icon: Database, title: 'Data moat', desc: 'Proprietary database — specyfikacje, certyfikaty, historia operacyjna. Dane, których nikt inny nie ma i nie może zreplikować.' },
              { icon: Globe, title: 'API licensing', desc: 'Ubezpieczyciele, producenci, firmy logistyczne — wszyscy potrzebują zweryfikowanych danych z rejestru. Recurring revenue.' },
              { icon: TrendingUp, title: 'RaaS certification', desc: 'Robot-as-a-Service wymaga certyfikacji. Każdy robot w obrocie musi mieć numer PESER. Skalowalne opłaty.' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: '#fafafa', border: '1px solid rgba(0,0,0,0.06)', padding: 36 }}>
                <div style={{ width: 44, height: 44, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <item.icon size={20} strokeWidth={1.5} color="#111" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 10, color: '#111' }}>{item.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(0,0,0,0.55)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#fafafa', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '100px 48px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, color: '#111', marginBottom: 16 }}>Zainteresowany?</h2>
          <p style={{ fontSize: 16, color: 'rgba(0,0,0,0.5)', marginBottom: 40 }}>Skontaktuj się z naszym zespołem IR. Prześlemy pełny pitch deck i prognozy finansowe.</p>
          <a href="mailto:ir@peser.gov.pl" style={{ display: 'inline-block', padding: '14px 48px', background: '#111', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Kontakt IR</a>
        </div>
      </section>
    </div>
  )
}
