import { useState } from 'react'
import { SOUNDS } from '../sounds'

// Butang pembesar suara + menu kecil untuk memilih bunyi tekan
export default function SoundPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const on = value !== 'off'
  const options = [...SOUNDS, { id: 'off', label: 'Senyap', emoji: '🔇' }]

  return (
    <div className="absolute right-0 top-0 z-20">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Pilih bunyi" aria-expanded={open}
        className={`grid size-10 place-items-center rounded-full shadow-soft ring-1 transition active:scale-90 ${on ? 'bg-white text-blush-500 ring-blush-100' : 'bg-white/60 text-plum-soft ring-lilac-200'}`}>
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H3v6h3l5 4z" fill="currentColor" fillOpacity="0.15" />
          {on ? <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /> : <path d="M16 9l5 6M21 9l-5 6" />}
        </svg>
      </button>

      {open && (
        <>
          <button type="button" aria-label="Tutup" className="fixed inset-0 h-full w-full cursor-default" onClick={() => setOpen(false)} />
          <div role="menu" className="animate-toast absolute right-0 top-12 w-56 rounded-3xl bg-white p-2 text-left shadow-soft ring-1 ring-blush-100">
            <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-widest text-blush-400">Bunyi Tekan</p>
            {options.map((o) => {
              const selected = o.id === value
              return (
                <button key={o.id} type="button" role="menuitemradio" aria-checked={selected}
                  onClick={() => onChange(o.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition active:scale-[0.98] ${selected ? 'bg-blush-100 text-blush-600' : 'text-plum'}`}>
                  <span className="text-lg">{o.emoji}</span>
                  <span className="flex-1 text-left">{o.label}</span>
                  {selected && <span aria-hidden="true">✓</span>}
                </button>
              )
            })}
            <p className="px-3 pb-2 pt-1 text-[11px] text-plum-soft">Tekan pilihan untuk dengar contoh bunyi.</p>
          </div>
        </>
      )}
    </div>
  )
}
