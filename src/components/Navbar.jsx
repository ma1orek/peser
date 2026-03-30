import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useLang } from '../i18n'
import PeserLogo from './PeserLogo'

const navLinks = (t) => [
  { label: t.nav_system, to: '/system' },
  { label: t.nav_rejestr, to: '/rejestr' },
  { label: t.nav_klasyfikacja, to: '/klasyfikacja' },
  { label: t.nav_inwestorzy, to: '/inwestorzy' },
  { label: t.nav_kontakt, to: '/kontakt' },
]

export default function Navbar() {
  const { lang, toggleLang, t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize) }
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const links = navLinks(t)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px',
      background: scrolled ? 'rgba(250,250,250,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
      transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <PeserLogo size={36} showText textSize={18} />
      </Link>

      {/* Desktop links */}
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {links.map((link) => (
            <Link
              key={link.to} to={link.to}
              style={{
                color: location.pathname === link.to ? '#111' : 'rgba(0,0,0,0.45)',
                textDecoration: 'none', fontSize: 12, fontWeight: 500,
                letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#111'}
              onMouseLeave={(e) => { if (location.pathname !== link.to) e.currentTarget.style.color = 'rgba(0,0,0,0.45)' }}
            >{link.label}</Link>
          ))}
        </div>
      )}

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={toggleLang} style={{
          padding: '5px 14px', fontSize: 11, fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          border: '1px solid rgba(0,0,0,0.15)', background: 'transparent',
          color: '#111', cursor: 'pointer', transition: 'all 0.2s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; e.currentTarget.style.background = 'transparent' }}
        >{lang === 'pl' ? 'EN' : 'PL'}</button>

        {!isMobile && (
          <Link to="/rejestracja" style={{
            padding: '9px 24px', background: '#111', color: '#fff', textDecoration: 'none',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
            transition: 'transform 0.2s, opacity 0.2s', display: 'inline-block',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
          >{t.nav_cta}</Link>
        )}

        {isMobile && (
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111' }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute', top: 72, left: 0, right: 0,
              background: 'rgba(250,250,250,0.98)', backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              padding: '20px 48px', display: 'flex', flexDirection: 'column', gap: 16,
            }}
          >
            {links.map((link) => (
              <Link key={link.to} to={link.to} style={{
                textDecoration: 'none', color: '#111', fontSize: 14, fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>{link.label}</Link>
            ))}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 16, marginTop: 4 }}>
              <Link to="/rejestracja" style={{
                display: 'block', padding: '10px 0', textDecoration: 'none',
                color: '#111', fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>{t.nav_cta}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
