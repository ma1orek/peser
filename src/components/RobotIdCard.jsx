import { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { riskClassLabels, statusLabels } from '../data/registry'
import PeserLogo from './PeserLogo'

export default function RobotIdCard({ robot, compact = false, cardRef }) {
  const risk = riskClassLabels[robot.riskClass] || { name: robot.riskClass, color: '#111' }
  const status = statusLabels[robot.status] || { label: robot.status, color: '#999' }

  if (compact) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 20px',
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.06)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.boxShadow = 'none' }}
      >
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 12, fontWeight: 700, color: '#111',
          letterSpacing: '0.02em', minWidth: 200,
        }}>{robot.id}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{robot.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{robot.owner} — {robot.ownerCity}</div>
        </div>
        <div style={{
          padding: '3px 10px',
          border: `1px solid ${risk.color}33`,
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.06em',
          color: risk.color,
        }}>{robot.riskClass}</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: status.color,
            boxShadow: robot.status === 'AKTYWNY' ? `0 0 6px ${status.color}66` : 'none',
          }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: status.color }}>{status.label}</span>
        </div>
      </div>
    )
  }

  // Full ID Card
  return (
    <div ref={cardRef} style={{
      width: '100%', maxWidth: 560,
      aspectRatio: '85.6 / 54',
      background: 'linear-gradient(135deg, #fefefe 0%, #f8f8f8 100%)',
      border: '1px solid rgba(0,0,0,0.1)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
      padding: '28px 32px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      {/* Subtle watermark */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%) rotate(-15deg)',
        fontSize: 120, fontWeight: 700,
        color: 'rgba(0,0,0,0.02)',
        letterSpacing: '0.1em',
        pointerEvents: 'none', userSelect: 'none',
      }}>PESER</div>

      {/* Robot photo */}
      {robot.photoUrl && (
        <div style={{
          position: 'absolute', top: 28, right: 32,
          width: 64, height: 80, overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.08)',
        }}>
          <img src={robot.photoUrl} alt={robot.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: 16, paddingBottom: 12,
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PeserLogo size={28} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', color: '#111', lineHeight: 1 }}>PESER</div>
            <div style={{ fontSize: 6, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginTop: 1, lineHeight: 1 }}>
              Powszechny Elektroniczny System<br/>Ewidencji Robotów
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase' }}>RZECZPOSPOLITA POLSKA</div>
          <div style={{ fontSize: 7, fontWeight: 500, color: 'rgba(0,0,0,0.2)', marginTop: 1 }}>DOWÓD TOŻSAMOŚCI ROBOTA</div>
        </div>
      </div>

      {/* PESER Number */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          fontSize: 8, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.35)', marginBottom: 4,
        }}>NUMER PESER</div>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 20, fontWeight: 700, color: '#111',
          letterSpacing: '0.04em',
        }}>{robot.id}</div>
      </div>

      {/* Details grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '8px 24px', marginBottom: 16,
      }}>
        <div>
          <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase' }}>ROBOT</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>{robot.name}</div>
        </div>
        <div>
          <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase' }}>KLASA RYZYKA</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: risk.color }}>{robot.riskClass} — {risk.name}</div>
        </div>
        <div>
          <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase' }}>WLASCICIEL</div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#111' }}>{robot.owner}</div>
        </div>
        <div>
          <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase' }}>STATUS</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%', background: status.color,
              boxShadow: robot.status === 'AKTYWNY' ? `0 0 6px ${status.color}66` : 'none',
            }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: status.color }}>{status.label}</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase' }}>DATA REJ.</div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#111' }}>{robot.registrationDate}</div>
        </div>
        <div>
          <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase' }}>WYGASA</div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#111' }}>{robot.expiryDate}</div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        paddingTop: 8, borderTop: '1px solid rgba(0,0,0,0.06)',
      }}>
        {/* QR Code — encodes PESER verification URL */}
        <QRCodeSVG
          value={`https://peser.gov.pl/rejestr/${encodeURIComponent(robot.id)}`}
          size={42}
          bgColor="transparent"
          fgColor="#111"
          level="M"
        />
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 9, color: 'rgba(0,0,0,0.3)',
          letterSpacing: '0.02em',
        }}>{robot.didHash}</div>
      </div>
    </div>
  )
}
