import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Code, Lock, Globe } from 'lucide-react'
import { useLang } from '../i18n'

const endpoints = [
  { method: 'GET', path: '/v1/robots/{peser_id}', desc: 'Pobierz dane robota po numerze PESER', color: '#0066cc' },
  { method: 'GET', path: '/v1/robots/search', desc: 'Wyszukaj roboty po nazwie, właścicielu, klasie', color: '#0066cc' },
  { method: 'POST', path: '/v1/robots/register', desc: 'Zarejestruj nowego robota (wymaga auth)', color: '#1a8a4a' },
  { method: 'POST', path: '/v1/robots/verify', desc: 'Zweryfikuj certyfikat i status robota', color: '#1a8a4a' },
  { method: 'GET', path: '/v1/audit/{peser_id}', desc: 'Pobierz dziennik audytowy (blockchain)', color: '#0066cc' },
  { method: 'POST', path: '/v1/zones/declare', desc: 'Zgłoś strefę operacyjną robota', color: '#1a8a4a' },
  { method: 'GET', path: '/v1/ipfs/{cid}', desc: 'Zweryfikuj rekord na IPFS', color: '#0066cc' },
]

export default function KontaktApi() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSend = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ padding: '140px 48px 80px', background: 'linear-gradient(170deg, #fff 0%, #f7f7f7 100%)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 16 }}>{t.kontakt_label}</div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 72px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111', lineHeight: 1.1, marginBottom: 32 }}>
              Integracja dla <span style={{ color: 'rgba(0,0,0,0.25)' }}>deweloperów i instytucji</span>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: 'rgba(0,0,0,0.6)', maxWidth: 700 }}>
              PESER oferuje REST API dla firm, instytucji rządowych i producentów robotów. Integruj rejestr robotów ze swoimi systemami.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Two columns: API + Contact */}
      <section style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '100px 48px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 64 }}>

          {/* API Docs */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <Code size={18} color="#111" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>REST API — Endpointy</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {endpoints.map((ep) => (
                <div key={ep.path} style={{ padding: '14px 16px', background: '#fafafa', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', alignItems: 'flex-start', gap: 12, transition: 'border-color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)'}
                >
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px',
                    background: ep.method === 'GET' ? 'rgba(0,102,204,0.08)' : 'rgba(26,138,74,0.08)',
                    color: ep.color, letterSpacing: '0.04em', flexShrink: 0,
                  }}>{ep.method}</span>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#111', marginBottom: 2 }}>{ep.path}</div>
                    <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{ep.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, padding: '16px 20px', background: '#fafafa', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Lock size={14} color="rgba(0,0,0,0.4)" />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>Autoryzacja</span>
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(0,0,0,0.5)', lineHeight: 1.6 }}>
                Authorization: Bearer &lt;API_KEY&gt;
              </div>
              <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', marginTop: 8 }}>Klucz API wydawany po rejestracji firmy. Rate limit: 1000 req/min.</div>
            </div>

            <div style={{ marginTop: 16, padding: '16px 20px', background: '#fafafa', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Globe size={14} color="rgba(0,0,0,0.4)" />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>Integracja rządowa</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', lineHeight: 1.6 }}>
                Współpracujemy z: Ministerstwo Cyfryzacji, GovTech Polska, KPRM, Urząd Dozoru Technicznego. Integracja przez login.gov.pl (mObywatel / Profil Zaufany).
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <Mail size={18} color="#111" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Formularz kontaktowy</span>
            </div>

            {sent ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 40, background: 'rgba(26,138,74,0.04)', border: '1px solid rgba(26,138,74,0.15)', textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 12, color: '#1a8a4a' }}>✓</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1a8a4a' }}>Wiadomość wysłana</div>
                <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', marginTop: 8 }}>Odpowiemy w ciągu 24h.</div>
              </motion.div>
            ) : (
              <form onSubmit={handleSend}>
                {[
                  { key: 'name', label: 'Imię i nazwisko', placeholder: 'Jan Kowalski' },
                  { key: 'email', label: 'Email', placeholder: 'jan@firma.pl', type: 'email' },
                  { key: 'subject', label: 'Temat', placeholder: 'Integracja API / Certyfikacja / Współpraca' },
                ].map((f) => (
                  <div key={f.key} style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', display: 'block', marginBottom: 4 }}>{f.label}</label>
                    <input type={f.type || 'text'} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                      style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.12)', background: 'transparent', fontSize: 14, fontFamily: "'Space Grotesk', sans-serif", color: '#111', outline: 'none', transition: 'border-color 0.2s' }}
                      onFocus={(e) => e.target.style.borderColor = '#111'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', display: 'block', marginBottom: 4 }}>Wiadomość</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Opisz czego potrzebujesz..."
                    style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.12)', background: 'transparent', fontSize: 14, fontFamily: "'Space Grotesk', sans-serif", color: '#111', outline: 'none', resize: 'vertical', minHeight: 100 }}
                  />
                </div>
                <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 36px', background: '#111', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  <Send size={14} /> Wyślij
                </button>
              </form>
            )}

            {/* Contact info */}
            <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'rgba(0,0,0,0.5)' }}>
                <Mail size={16} color="rgba(0,0,0,0.3)" /> kontakt@peser.gov.pl
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'rgba(0,0,0,0.5)' }}>
                <Phone size={16} color="rgba(0,0,0,0.3)" /> +48 22 123 45 67
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'rgba(0,0,0,0.5)' }}>
                <MapPin size={16} color="rgba(0,0,0,0.3)" /> ul. Królewska 27, 00-060 Warszawa
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
