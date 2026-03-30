import { Link } from 'react-router-dom'
import { useLang } from '../i18n'
import PeserLogo from './PeserLogo'

const footerLinkStyle = {
  fontSize: 13, color: 'rgba(0,0,0,0.5)', textDecoration: 'none',
  transition: 'color 0.2s', display: 'block', marginBottom: 8,
}

export default function Footer() {
  const { t } = useLang()

  return (
    <footer style={{
      borderTop: '1px solid rgba(0,0,0,0.06)',
      background: '#fff',
      padding: '64px 48px 48px',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40, marginBottom: 48,
        }}>
          <div>
            <div style={{ marginBottom: 12 }}>
              <PeserLogo size={32} showText textSize={16} />
            </div>
            <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', lineHeight: 1.6 }}>
              {t.footer_company}
            </p>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16, color: 'rgba(0,0,0,0.7)' }}>
              System
            </div>
            <Link to="/system" style={footerLinkStyle} onMouseEnter={(e) => e.currentTarget.style.color = '#111'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.5)'}>{t.nav_system}</Link>
            <Link to="/rejestr" style={footerLinkStyle} onMouseEnter={(e) => e.currentTarget.style.color = '#111'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.5)'}>{t.nav_rejestr}</Link>
            <Link to="/tozsamosc" style={footerLinkStyle} onMouseEnter={(e) => e.currentTarget.style.color = '#111'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.5)'}>{t.nav_tozsamosc}</Link>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16, color: 'rgba(0,0,0,0.7)' }}>
              Dla użytkowników
            </div>
            <Link to="/rejestracja" style={footerLinkStyle} onMouseEnter={(e) => e.currentTarget.style.color = '#111'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.5)'}>{t.nav_rejestracja}</Link>
            <Link to="/kontakt" style={footerLinkStyle} onMouseEnter={(e) => e.currentTarget.style.color = '#111'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.5)'}>{t.nav_kontakt}</Link>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16, color: 'rgba(0,0,0,0.7)' }}>
              Prawne
            </div>
            <a href="#" style={footerLinkStyle} onMouseEnter={(e) => e.currentTarget.style.color = '#111'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.5)'}>{t.footer_privacy}</a>
            <a href="#" style={footerLinkStyle} onMouseEnter={(e) => e.currentTarget.style.color = '#111'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.5)'}>{t.footer_terms}</a>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(0,0,0,0.06)',
          paddingTop: 32, textAlign: 'center',
          fontSize: 12, color: 'rgba(0,0,0,0.35)',
        }}>
          © 2026 PESER. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
