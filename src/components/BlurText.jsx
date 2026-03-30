import { useEffect, useState } from 'react'

export default function BlurText({
  text = '',
  delay = 50,
  className = '',
  style = {},
}) {
  const [visibleCount, setVisibleCount] = useState(0)
  const words = (text || '').split(' ')

  useEffect(() => {
    setVisibleCount(0)
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleCount(i)
      if (i >= words.length) clearInterval(interval)
    }, delay)
    return () => clearInterval(interval)
  }, [text, delay])

  return (
    <span className={className} style={{ ...style, display: 'inline' }}>
      {words.map((word, i) => (
        <span
          key={`${text}-${i}`}
          style={{
            display: 'inline-block',
            filter: i < visibleCount ? 'blur(0px)' : 'blur(10px)',
            opacity: i < visibleCount ? 1 : 0,
            transform: i < visibleCount ? 'translateY(0)' : 'translateY(4px)',
            transition: 'filter 0.5s ease, opacity 0.5s ease, transform 0.5s ease',
            marginRight: '0.25em',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
