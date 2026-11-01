// Bunga kecil comel (SVG) untuk hiasan
export default function Flower({ size = 28, petal = '#f7aecb', center = '#fff1c9', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden="true">
      <g fill={petal}>
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="20" cy="10" rx="6.5" ry="9" transform={`rotate(${r} 20 20)`} />
        ))}
      </g>
      <circle cx="20" cy="20" r="5" fill={center} />
      <circle cx="18.5" cy="18.5" r="1.4" fill="#fff" opacity="0.8" />
    </svg>
  )
}

export function Sparkle({ size = 12, color = '#cdb9ee', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path d="M10 0c.8 5 4.2 8.4 10 10-5.8 1.6-9.2 5-10 10-.8-5-4.2-8.4-10-10C5.8 8.4 9.2 5 10 0z" fill={color} />
    </svg>
  )
}

// Bulan sabit & bintang — elemen Islamik yang halus
export function Crescent({ size = 22, color = '#e86a9b', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M14.5 3.5a8.5 8.5 0 1 0 6 14.4A7 7 0 1 1 14.5 3.5z" fill={color} />
      <path d="M18 6l.9 1.9 2.1.3-1.5 1.5.4 2.1-1.9-1-1.9 1 .4-2.1-1.5-1.5 2.1-.3z" fill={color} />
    </svg>
  )
}
