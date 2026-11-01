import { useState } from 'react'

// Butang bulat besar berwarna merah jambu untuk mengira zikir.
// Cincin di sekelilingnya menunjukkan kemajuan ke arah sasaran harian.
export default function CounterButton({ count, progress, onTap }) {
  const [ripples, setRipples] = useState([])
  const [popKey, setPopKey] = useState(0)

  const radius = 118
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(progress, 1))

  const handleTap = () => {
    onTap()
    setPopKey((k) => k + 1)
    const id = Date.now() + Math.random()
    setRipples((r) => [...r, id])
    setTimeout(() => setRipples((r) => r.filter((x) => x !== id)), 600)
    if (navigator.vibrate) navigator.vibrate(12)
  }

  return (
    <div className="relative mx-auto grid size-[264px] place-items-center">
      {/* Cincin kemajuan */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 264 264" aria-hidden="true">
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f7aecb" />
            <stop offset="100%" stopColor="#b79ae6" />
          </linearGradient>
        </defs>
        <circle cx="132" cy="132" r={radius} fill="none" stroke="#fbe3ec" strokeWidth="10" />
        <circle
          cx="132" cy="132" r={radius} fill="none" stroke="url(#ring)" strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>

      {ripples.map((id) => (
        <span key={id} className="animate-ripple pointer-events-none absolute size-[200px] rounded-full bg-blush-300" />
      ))}

      <button
        type="button"
        onClick={handleTap}
        aria-label="Tekan untuk mengira zikir"
        className="relative size-[200px] select-none rounded-full bg-gradient-to-br from-blush-300 via-blush-400 to-blush-500 text-white shadow-glow ring-8 ring-white/70 transition-transform duration-100 active:scale-95 touch-manipulation"
      >
        <span className="pointer-events-none absolute inset-3 rounded-full border-2 border-dashed border-white/40" />
        <span className="pointer-events-none absolute left-9 top-7 h-10 w-16 -rotate-30 rounded-full bg-white/30 blur-md" />
        <span className="relative flex flex-col items-center">
          <span key={popKey} className="animate-pop text-6xl font-bold tabular-nums drop-shadow-sm">{count}</span>
          <span className="mt-1 text-sm font-semibold tracking-wide text-white/90">Tekan di sini</span>
        </span>
      </button>
    </div>
  )
}
