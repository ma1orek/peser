import { useLang } from '../i18n'
import { motion } from 'framer-motion'

export default function Certyfikacja() {
  const { t } = useLang()
  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 48px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 16 }}>
            CERTYFIKACJA
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111', lineHeight: 1.1, marginBottom: 32 }}>
            Zero Trust i Paszport Techniczny
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(0,0,0,0.6)', maxWidth: 700 }}>
            System wymaga ciaglej autoryzacji procesow operacyjnych robota. Kazda akcja jest weryfikowana wzgledem uprawnien. Paszport techniczny zapewnia aktualnosc oprogramowania.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
