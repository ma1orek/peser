import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Users, Building2, Wrench, Factory, Car, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react'
import { useLang } from '../i18n'

const classes = [
  {
    code: 'H1', name: 'Humanoid Publiczny', color: '#111', icon: Users,
    subtitle: 'Najwyższy poziom certyfikacji',
    desc: 'Roboty humanoidalne operujące bezpośrednio w przestrzeni publicznej, w bezpośrednim kontakcie z ludźmi. To klasa o najwyższych wymaganiach bezpieczeństwa.',
    examples: ['Recepcjoniści hotelowi i biurowi', 'Przewodnicy w muzeach i galeriach', 'Roboty eventowe i marketingowe', 'Asystenci w centrach handlowych', 'Roboty edukacyjne w szkołach'],
    requirements: ['Certyfikat CE + certyfikat PESER klasy A', 'Audyt bezpieczeństwa co 6 miesięcy', 'Zgłoszenie strefy operacyjnej obowiązkowe', 'Ubezpieczenie OC min. 1 mln PLN', 'System awaryjnego wyłączenia (E-STOP)', 'Czujniki antykolizyjne 360°'],
    certLevel: 'A', inspectionFreq: 'Co 6 miesięcy',
  },
  {
    code: 'H2', name: 'Humanoid Ograniczony', color: '#c67800', icon: Building2,
    subtitle: 'Kontrolowane środowisko',
    desc: 'Roboty humanoidalne pracujące w ograniczonym, kontrolowanym środowisku z limitowanym dostępem publiczności. Mniejsze ryzyko, ale nadal wymagają certyfikacji.',
    examples: ['Asystenci magazynowi', 'Roboty w fabrykach (strefa pracownicza)', 'Asystenci laboratoryjni', 'Roboty w biurach zamkniętych', 'Obsługa logistyki wewnętrznej'],
    requirements: ['Certyfikat CE + certyfikat PESER klasy A lub B', 'Audyt bezpieczeństwa co 12 miesięcy', 'Zgłoszenie strefy operacyjnej zalecane', 'Ubezpieczenie OC min. 500 tys. PLN', 'System E-STOP obowiązkowy'],
    certLevel: 'A/B', inspectionFreq: 'Co 12 miesięcy',
  },
  {
    code: 'I1', name: 'Cobot Przemysłowy', color: '#0066cc', icon: Wrench,
    subtitle: 'Współpraca człowiek-maszyna',
    desc: 'Roboty współpracujące (collaborative robots) zaprojektowane do bezpośredniej interakcji z pracownikami. Ograniczona siła i prędkość zgodnie z ISO/TS 15066.',
    examples: ['Ramiona robotyczne na liniach montażowych', 'Coboty pakujące i sortujące', 'Roboty spawalnicze z asystą ludzką', 'Systemy pick-and-place', 'Roboty do kontroli jakości'],
    requirements: ['Certyfikat CE + zgodność z ISO/TS 15066', 'Certyfikat PESER klasy B', 'Ograniczenie siły kontaktu do 150N', 'Czujniki siły i momentu obrotowego', 'Szkolenie operatorów obowiązkowe'],
    certLevel: 'B', inspectionFreq: 'Co 12 miesięcy',
  },
  {
    code: 'I2', name: 'Przemysłowy Pełny', color: '#cc3333', icon: Factory,
    subtitle: 'Strefy bez ludzi',
    desc: 'Roboty w pełni autonomiczne operujące w strefach wyłączonych z obecności ludzi. Najwyższa prędkość i siła, ale w odizolowanym środowisku.',
    examples: ['Roboty spawalnicze dużej mocy', 'Roboty lakiernicze', 'Prasy i roboty montażowe', 'Systemy transportu wewnętrznego AGV', 'Roboty do obsługi materiałów niebezpiecznych'],
    requirements: ['Certyfikat CE klasy maszynowej', 'Certyfikat PESER klasy B lub C', 'Ogrodzenie strefy bezpieczeństwa', 'System blokady dostępu (interlock)', 'Czujniki obecności w strefie'],
    certLevel: 'B/C', inspectionFreq: 'Co 24 miesiące',
  },
  {
    code: 'AV', name: 'Pojazd Autonomiczny', color: '#7733cc', icon: Car,
    subtitle: 'Regulacje drogowe + PESER',
    desc: 'Samojezdne pojazdy autonomiczne. Podlegają zarówno regulacjom PESER jak i przepisom ruchu drogowego. Wymagają podwójnej certyfikacji.',
    examples: ['Autonomiczne taxi (robotaxi)', 'Autobusy autonomiczne', 'Drony dostawcze naziemne', 'Pojazdy logistyczne na terenie portów', 'Pojazdy inspekcyjne drogowe'],
    requirements: ['Certyfikat CE + homologacja drogowa', 'Certyfikat PESER klasy A', 'Zgodność z regulacjami UNECE WP.29', 'Ubezpieczenie OC pojazdu + robota', 'Telematyka i czarna skrzynka', 'Zgłoszenie trasy operacyjnej obowiązkowe'],
    certLevel: 'A', inspectionFreq: 'Co 6 miesięcy',
  },
]

export default function Klasyfikacja() {
  const { t } = useLang()

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ padding: '140px 48px 80px', background: 'linear-gradient(170deg, #fff 0%, #f7f7f7 100%)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 16 }}>KLASYFIKACJA RYZYKA</div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 72px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111', lineHeight: 1.1, marginBottom: 32 }}>
              Profile ryzyka <span style={{ color: 'rgba(0,0,0,0.25)' }}>operacyjnego</span>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: 'rgba(0,0,0,0.6)', maxWidth: 700 }}>
              System PESER dzieli roboty na 5 klas ryzyka operacyjnego. Każda klasa określa wymagania certyfikacyjne, częstotliwość inspekcji, wymagane ubezpieczenie i dozwolone strefy operacyjne. Klasyfikacja jest zgodna z EU AI Act i normami ISO.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Risk matrix */}
      <section style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Klasa', 'Nazwa', 'Certyfikat', 'Inspekcja', 'Ryzyko'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.code}>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color: cls.color }}>{cls.code}</span>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)', fontWeight: 500, color: '#111' }}>{cls.name}</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.6)' }}>Klasa {cls.certLevel}</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.6)' }}>{cls.inspectionFreq}</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {Array.from({ length: cls.code === 'H1' || cls.code === 'AV' ? 5 : cls.code === 'H2' ? 4 : cls.code === 'I1' ? 3 : 2 }, (_, i) => (
                          <div key={i} style={{ width: 8, height: 8, background: cls.color, opacity: 0.7 }} />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Detailed cards */}
      <section style={{ background: '#fafafa', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '100px 48px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {classes.map((cls, idx) => {
            const ref = useRef(null)
            const inView = useInView(ref, { once: true })
            const Icon = cls.icon
            return (
              <motion.div key={cls.code} ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: idx * 0.05 }}
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}
              >
                {/* Header bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 32px', borderBottom: '1px solid rgba(0,0,0,0.04)', background: `${cls.color}08` }}>
                  <div style={{ width: 48, height: 48, background: '#fff', border: `1px solid ${cls.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color={cls.color} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 28, fontWeight: 700, color: cls.color }}>{cls.code}</span>
                      <span style={{ fontSize: 18, fontWeight: 600, color: '#111' }}>{cls.name}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginTop: 2 }}>{cls.subtitle}</div>
                  </div>
                </div>

                <div style={{ padding: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
                  {/* Description */}
                  <div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(0,0,0,0.6)', marginBottom: 20 }}>{cls.desc}</p>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 10 }}>PRZYKŁADY ZASTOSOWAŃ</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {cls.examples.map((ex) => (
                        <li key={ex} style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 4, height: 4, background: cls.color, opacity: 0.5, flexShrink: 0 }} />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 10 }}>WYMAGANIA</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {cls.requirements.map((req) => (
                        <li key={req} style={{ fontSize: 13, color: 'rgba(0,0,0,0.6)', padding: '5px 0', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          <CheckCircle size={14} color={cls.color} style={{ marginTop: 2, flexShrink: 0, opacity: 0.7 }} />
                          {req}
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: 16, padding: '10px 14px', background: `${cls.color}08`, border: `1px solid ${cls.color}15`, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ShieldCheck size={14} color={cls.color} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: cls.color }}>Certyfikat: Klasa {cls.certLevel} | Inspekcja: {cls.inspectionFreq}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '80px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={18} color="#c67800" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#c67800' }}>Nie wiesz, jaka klasa pasuje do Twojego robota?</span>
          </div>
          <p style={{ fontSize: 15, color: 'rgba(0,0,0,0.5)', marginBottom: 32 }}>
            Skontaktuj się z nami — pomożemy dobrać klasyfikację i przeprowadzimy audyt certyfikacyjny.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/rejestracja" style={{ display: 'inline-block', padding: '12px 36px', background: '#111', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Zarejestruj robota</Link>
            <Link to="/kontakt" style={{ display: 'inline-block', padding: '12px 36px', border: '1px solid rgba(0,0,0,0.2)', color: '#111', textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Kontakt</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
