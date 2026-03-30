// Inline SVG PESER logo — "P" + circuit dots + ID bars
export default function PeserLogo({ size = 36, showText = false, textSize = 18 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: showText ? 10 : 0 }}>
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" fill="#111"/>
        {/* P letter */}
        <rect x="24" y="20" width="12" height="80" fill="#fff"/>
        <rect x="36" y="20" width="36" height="12" fill="#fff"/>
        <rect x="60" y="20" width="12" height="36" fill="#fff"/>
        <rect x="36" y="44" width="36" height="12" fill="#fff"/>
        {/* Circuit dots */}
        <rect x="84" y="20" width="8" height="8" fill="#fff" opacity="0.6"/>
        <rect x="96" y="20" width="8" height="8" fill="#fff" opacity="0.4"/>
        <rect x="84" y="32" width="8" height="8" fill="#fff" opacity="0.3"/>
        <rect x="96" y="32" width="8" height="8" fill="#fff" opacity="0.6"/>
        {/* ID bars */}
        <rect x="24" y="76" width="80" height="3" fill="#fff" opacity="0.15"/>
        <rect x="24" y="83" width="60" height="3" fill="#fff" opacity="0.15"/>
        <rect x="24" y="90" width="40" height="3" fill="#fff" opacity="0.15"/>
      </svg>
      {showText && (
        <div>
          <div style={{ fontSize: textSize, fontWeight: 700, color: '#111', letterSpacing: '0.08em', lineHeight: 1 }}>PESER</div>
          <div style={{ fontSize: Math.max(7, textSize * 0.4), fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.06em', lineHeight: 1, marginTop: 2 }}>
            Powszechny Elektroniczny System<br/>Ewidencji Robotów
          </div>
        </div>
      )}
    </div>
  )
}
