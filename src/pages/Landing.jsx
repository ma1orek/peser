import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef, useMemo } from 'react'
import { ChevronDown, Shield, Fingerprint, FileCheck, BarChart3 } from 'lucide-react'
import { useLang } from '../i18n'
import { getAllRobots } from '../data/registry'

function AnimatedStat({ value, label, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
    >
      <div style={{
        fontSize: 'clamp(36px, 5vw, 64px)',
        fontWeight: 700, letterSpacing: '-0.03em',
        marginBottom: 8, color: '#111',
      }}>{value}</div>
      <div style={{
        fontSize: 11, fontWeight: 600,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.45)',
      }}>{label}</div>
    </motion.div>
  )
}

function FeatureCard({ icon: Icon, title, desc, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      style={{
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.06)',
        padding: 40,
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{
        width: 48, height: 48,
        background: '#f5f5f5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
      }}>
        <Icon size={22} strokeWidth={1.5} color="#111" />
      </div>
      <h3 style={{
        fontSize: 18, fontWeight: 600, marginBottom: 12,
        letterSpacing: '-0.01em', color: '#111',
      }}>{title}</h3>
      <p style={{
        fontSize: 14, lineHeight: 1.7,
        color: 'rgba(0,0,0,0.55)',
      }}>{desc}</p>
    </motion.div>
  )
}

export default function Landing() {
  const { t } = useLang()
  const robots = useMemo(() => getAllRobots(), [])
  const activeCount = robots.filter(r => r.status === 'AKTYWNY').length
  const classesCount = new Set(robots.map(r => r.riskClass)).size
  const citiesCount = new Set(robots.map(r => r.ownerCity).filter(Boolean)).size

  return (
    <div style={{ width: '100%' }}>
      {/* ─── Hero ─── */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        background: 'linear-gradient(170deg, #ffffff 0%, #f7f7f7 50%, #f0f0f0 100%)',
        overflow: 'hidden',
      }}>
        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }} />

        {/* Radial accent */}
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '60%', height: '80%',
          background: 'radial-gradient(ellipse, rgba(30,56,250,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'relative', zIndex: 10,
          maxWidth: 1400, margin: '0 auto', padding: '140px 48px 80px',
          width: '100%',
        }}>
          <motion.div
            style={{ maxWidth: 720 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [.22,1,.36,1] }}
          >
            {/* Eyebrow */}
            <div style={{
              fontSize: 12, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.4)',
              marginBottom: 32,
            }}>
              {t.hero_subtitle}
            </div>

            {/* Heading */}
            <h1 style={{
              fontSize: 'clamp(44px, 6vw, 86px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: 32,
              color: '#111',
            }}>
              {t.hero_h1_line1}
              <br />
              {t.hero_h1_line2}
              <br />
              <span style={{ color: 'rgba(0,0,0,0.25)' }}>{t.hero_h1_line3}</span>
            </h1>

            {/* Desc */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                fontSize: 17, lineHeight: 1.7,
                color: 'rgba(0,0,0,0.6)',
                maxWidth: 540, marginBottom: 48,
              }}
            >
              {t.hero_desc}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 80 }}
            >
              <Link to="/rejestr" style={{
                display: 'inline-block', padding: '14px 36px',
                background: '#111', color: '#fff', textDecoration: 'none',
                fontSize: 13, fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                transition: 'transform 0.2s, opacity 0.2s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.opacity = '0.9' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.opacity = '1' }}
              >
                {t.hero_cta1}
              </Link>

              <Link to="/rejestracja" style={{
                display: 'inline-block', padding: '14px 36px',
                background: 'transparent', color: '#111', textDecoration: 'none',
                border: '1px solid rgba(0,0,0,0.2)',
                fontSize: 13, fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.background = 'rgba(0,0,0,0.03)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'; e.currentTarget.style.background = 'transparent' }}
              >
                {t.hero_cta2}
              </Link>
            </motion.div>

            {/* Scroll */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 11, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'rgba(0,0,0,0.3)',
              }}
            >
              <span>{t.hero_scroll}</span>
              <ChevronDown size={14} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section style={{
        background: '#fff',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        padding: '80px 48px',
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 48,
        }}>
          <AnimatedStat value={String(robots.length)} label={t.stat_registered} delay={0} />
          <AnimatedStat value={String(classesCount)} label={t.stat_classes} delay={0.1} />
          <AnimatedStat value={String(citiesCount)} label={t.stat_regions} delay={0.2} />
          <AnimatedStat value={`${activeCount}/${robots.length}`} label="Aktywnych" delay={0.3} />
        </div>
      </section>

      {/* ─── Features ─── */}
      <section style={{
        background: '#fafafa',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        padding: '120px 48px',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{
              fontSize: 12, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.4)', marginBottom: 16,
            }}>
              {t.system_label}
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 56px)',
              fontWeight: 700, letterSpacing: '-0.03em',
              lineHeight: 1.1, color: '#111',
            }}>
              {t.system_h1} <span style={{ color: 'rgba(0,0,0,0.25)' }}>{t.system_h2}</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 2,
          }}>
            <FeatureCard
              icon={Fingerprint}
              title={t.tozsamosc_label}
              desc={t.did_desc}
              delay={0}
            />
            <FeatureCard
              icon={Shield}
              title={t.cert_label}
              desc={t.zero_trust_desc}
              delay={0.1}
            />
            <FeatureCard
              icon={FileCheck}
              title={t.klasyfikacja_label}
              desc={t.h1_desc}
              delay={0.2}
            />
            <FeatureCard
              icon={BarChart3}
              title={t.transparentnosc_label}
              desc={t.blockchain_desc}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ─── 3-step process ─── */}
      <section style={{
        background: '#fff',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        padding: '120px 48px',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ marginBottom: 64, textAlign: 'center' }}>
            <div style={{
              fontSize: 12, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.4)', marginBottom: 16,
            }}>
              JAK TO DZIALA
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 48px)',
              fontWeight: 700, letterSpacing: '-0.03em',
              color: '#111',
            }}>
              Trzy kroki do rejestracji
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 32,
          }}>
            {[
              { num: '01', title: t.step1_title, desc: t.step1_desc },
              { num: '02', title: t.step2_title, desc: t.step2_desc },
              { num: '03', title: t.step3_title, desc: t.step3_desc },
            ].map((step, i) => {
              const ref = useRef(null)
              const inView = useInView(ref, { once: true })
              return (
                <motion.div
                  key={step.num}
                  ref={ref}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  style={{
                    padding: 40,
                    background: '#fafafa',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{
                    fontSize: 48, fontWeight: 700,
                    color: 'rgba(0,0,0,0.08)',
                    letterSpacing: '-0.02em',
                    marginBottom: 16,
                    fontFamily: "'Space Mono', monospace",
                  }}>{step.num}</div>
                  <h3 style={{
                    fontSize: 20, fontWeight: 600,
                    marginBottom: 12, color: '#111',
                    letterSpacing: '-0.01em',
                  }}>{step.title}</h3>
                  <p style={{
                    fontSize: 14, lineHeight: 1.7,
                    color: 'rgba(0,0,0,0.55)',
                  }}>{step.desc}</p>
                </motion.div>
              )
            })}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 64 }}>
            <Link to="/rejestracja" style={{
              display: 'inline-block', padding: '14px 48px',
              background: '#111', color: '#fff', textDecoration: 'none',
              fontSize: 13, fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              transition: 'transform 0.2s, opacity 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.opacity = '0.9' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.opacity = '1' }}
            >
              {t.nav_cta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
