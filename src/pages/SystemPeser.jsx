import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Shield, Fingerprint, Eye, Users, MapPin, Lock } from 'lucide-react'
import { useLang } from '../i18n'

function Section({ children, bg = '#fafafa' }) {
  return <section style={{ background: bg, borderTop: '1px solid rgba(0,0,0,0.06)', padding: '100px 48px' }}><div style={{ maxWidth: 1400, margin: '0 auto' }}>{children}</div></section>
}

function Card({ icon: Icon, title, desc, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }}
      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: 36, transition: 'border-color 0.3s, box-shadow 0.3s' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ width: 44, height: 44, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Icon size={20} strokeWidth={1.5} color="#111" />
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 10, color: '#111' }}>{title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(0,0,0,0.55)' }}>{desc}</p>
    </motion.div>
  )
}

export default function SystemPeser() {
  const { t } = useLang()
  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ padding: '140px 48px 80px', background: 'linear-gradient(170deg, #fff 0%, #f7f7f7 100%)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 16 }}>{t.system_label}</div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 72px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111', lineHeight: 1.1, marginBottom: 32 }}>
              Powszechny Elektroniczny<br/>System Ewidencji <span style={{ color: 'rgba(0,0,0,0.25)' }}>Robotów</span>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: 'rgba(0,0,0,0.6)', maxWidth: 700, marginBottom: 24 }}>
              PESER to pierwszy w Polsce ogólnokrajowy system rejestracji robotów autonomicznych i humanoidów. Analogicznie do systemu PESEL dla obywateli, PESER przyznaje każdej maszynie działającej w przestrzeni publicznej unikalny, kryptograficznie zabezpieczony numer identyfikacyjny.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(0,0,0,0.5)', maxWidth: 700 }}>
              System powstał w odpowiedzi na rosnącą liczbę robotów autonomicznych w polskich miastach, fabrykach i przestrzeniach publicznych. Do 2030 roku szacuje się, że w Polsce będzie działać ponad 50 000 robotów wymagających rejestracji. PESER zapewnia bezpieczeństwo obywateli, transparentność operacyjną i pełną ścieżkę audytową dla każdej maszyny.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dlaczego PESER */}
      <Section bg="#fff">
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 16 }}>DLACZEGO PESER</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111' }}>Bezpieczeństwo <span style={{ color: 'rgba(0,0,0,0.25)' }}>w erze robotów</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
          <Card icon={Fingerprint} title="Cyfrowa tożsamość" desc="Każdy robot otrzymuje unikalny identyfikator DID (Decentralized Identifier) powiązany kryptograficznie z jego hardware'em. Nie można go podrobić ani przenieść." delay={0} />
          <Card icon={Shield} title="Certyfikacja bezpieczeństwa" desc="Wielopoziomowa certyfikacja (A/B/C/D) określa, w jakich warunkach robot może operować. Certyfikat jest weryfikowany automatycznie." delay={0.1} />
          <Card icon={Eye} title="Transparentność operacyjna" desc="Każda istotna akcja robota — rejestracja, inspekcja, incydent — jest zapisywana w niezmienionym dzienniku z kryptograficznym hashowaniem." delay={0.2} />
          <Card icon={Users} title="Weryfikacja właściciela (KYR)" desc="Procedura Know Your Robot wymaga pełnej weryfikacji właściciela lub operatora. NIP, KRS, dane osoby odpowiedzialnej." delay={0.3} />
          <Card icon={MapPin} title="Zgłaszanie trasy operacyjnej" desc="Właściciel musi zgłosić rejon operacyjny robota — analogicznie do deklaracji lotów dronów. System weryfikuje zgodność z klasą ryzyka." delay={0.4} />
          <Card icon={Lock} title="Zero Trust Architecture" desc="System wymaga ciągłej autoryzacji. Każda sesja operacyjna jest weryfikowana. Robot nie może działać bez aktywnego certyfikatu." delay={0.5} />
        </div>
      </Section>

      {/* Proces */}
      <Section bg="#fafafa">
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 16 }}>PROCES REJESTRACJI</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111' }}>Cztery kroki <span style={{ color: 'rgba(0,0,0,0.25)' }}>do pełnej rejestracji</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {[
            { num: '01', title: 'Złóż wniosek', desc: 'Właściciel wypełnia formularz z danymi firmy (NIP/KRS), danymi robota (producent, model, nr seryjny) oraz wgrywa zdjęcie maszyny.' },
            { num: '02', title: 'Weryfikacja i certyfikacja', desc: 'System weryfikuje certyfikaty CE, sprawdza specyfikację techniczną i przypisuje klasę ryzyka (H1/H2/I1/I2/AV). Wydajemy certyfikat PESER po pozytywnym audycie.' },
            { num: '03', title: 'Wydanie numeru PESER', desc: 'System generuje unikalny numer (PL-202603-H1-00001-X7), wydaje cyfrowy dowód osobisty robota i zapisuje hash w blockchainie.' },
            { num: '04', title: 'Zgłoś trasę operacyjną', desc: 'Przed wyjściem robota, właściciel zgłasza rejon operacyjny — dzielnicę, miasto, województwo. Analogicznie do deklaracji lotów dronów.' },
          ].map((step, i) => {
            const ref = useRef(null)
            const inView = useInView(ref, { once: true })
            return (
              <motion.div key={step.num} ref={ref} initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.12 }}
                style={{ padding: 36, background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}
              >
                <div style={{ fontSize: 44, fontWeight: 700, color: 'rgba(0,0,0,0.06)', fontFamily: "'Space Mono', monospace", marginBottom: 12 }}>{step.num}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, color: '#111' }}>{step.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(0,0,0,0.55)' }}>{step.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </Section>

      {/* Klasyfikacja */}
      <Section bg="#fff">
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 16 }}>KLASYFIKACJA</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111' }}>Profile ryzyka <span style={{ color: 'rgba(0,0,0,0.25)' }}>operacyjnego</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
          {[
            { code: 'H1', name: 'Humanoid Publiczny', desc: 'Roboty humanoidalne bezpośrednio wśród ludzi. Recepcjoniści, przewodnicy, artyści. Najwyższy poziom certyfikacji.', color: '#111' },
            { code: 'H2', name: 'Humanoid Ograniczony', desc: 'Roboty humanoidalne w kontrolowanym środowisku — magazyny, fabryki, laboratoria.', color: '#c67800' },
            { code: 'I1', name: 'Cobot Przemysłowy', desc: 'Roboty współpracujące (cobots) w bezpośredniej interakcji z pracownikami.', color: '#0066cc' },
            { code: 'I2', name: 'Przemysłowy Pełny', desc: 'Roboty w pełni autonomiczne w strefach bez ludzi. Spawanie, montaż, logistyka.', color: '#cc3333' },
            { code: 'AV', name: 'Pojazd Autonomiczny', desc: 'Samojezdne pojazdy — transport, taxi, dostawy. Podlegają regulacjom drogowym.', color: '#7733cc' },
          ].map((cls, i) => (
            <motion.div key={cls.code} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ background: '#fafafa', border: '1px solid rgba(0,0,0,0.06)', padding: 36 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: cls.color, fontFamily: "'Space Mono', monospace" }}>{cls.code}</div>
                <div style={{ width: 1, height: 32, background: 'rgba(0,0,0,0.08)' }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{cls.name}</div>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(0,0,0,0.55)' }}>{cls.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section bg="#fafafa">
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: '#111', marginBottom: 24 }}>Gotowy do rejestracji?</h2>
          <p style={{ fontSize: 16, color: 'rgba(0,0,0,0.5)', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
            Zarejestruj robota w systemie PESER i otrzymaj cyfrowy dowód osobisty maszyny.
          </p>
          <Link to="/rejestracja" style={{
            display: 'inline-block', padding: '14px 48px', background: '#111', color: '#fff', textDecoration: 'none',
            fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>Zarejestruj robota</Link>
        </div>
      </Section>
    </div>
  )
}
