export default function ShinyText({ text, speed = 3, className = '', style = {} }) {
  return (
    <span
      className={className}
      style={{
        ...style,
        display: 'inline-block',
        backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: '#fff',
        animation: `shiny-text ${speed}s linear infinite`,
      }}
    >
      {text}
      <style>{`
        @keyframes shiny-text {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </span>
  )
}
