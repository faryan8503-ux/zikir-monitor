// Empat butang menu di bahagian bawah skrin utama
const icons = {
  chart: (
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" strokeLinecap="round" strokeLinejoin="round" />
  ),
  book: (
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M8 8h8M8 12h5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
}

const items = [
  { label: 'Statistik', icon: 'chart', tone: 'from-blush-100 to-blush-200 text-blush-600' },
  { label: 'Rekod', icon: 'book', tone: 'from-lilac-100 to-lilac-200 text-lilac-500' },
  { label: 'Sasaran', icon: 'target', tone: 'from-[#fff3e6] to-[#fde4cf] text-[#d98a5f]' },
  { label: 'Tetapan', icon: 'gear', tone: 'from-blush-100 to-lilac-200 text-plum' },
]

export default function MenuButtons({ onSelect }) {
  return (
    <nav className="grid grid-cols-4 gap-3" aria-label="Menu utama">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => onSelect(item.label)}
          className="flex flex-col items-center gap-2 rounded-3xl bg-white/80 px-1 py-3 shadow-soft ring-1 ring-blush-100 backdrop-blur transition active:scale-95"
        >
          <span className={`grid size-11 place-items-center rounded-2xl bg-gradient-to-br ${item.tone}`}>
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              {icons[item.icon]}
            </svg>
          </span>
          <span className="text-xs font-semibold text-plum">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
