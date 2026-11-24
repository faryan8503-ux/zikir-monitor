import { useState } from 'react'
import { useVoiceCounter } from '../voiceCounter'

const LANGS = [
  { id: 'ar-SA', label: 'Arab' },
  { id: 'ms-MY', label: 'Melayu' },
]
const LANG_KEY = 'zikir-monitor:voice-lang'

function loadLang() {
  try {
    return localStorage.getItem(LANG_KEY) === 'ms-MY' ? 'ms-MY' : 'ar-SA'
  } catch {
    return 'ar-SA'
  }
}

// Butang & panel "Kira dengan suara"
export default function VoicePanel({ zikir, onCount }) {
  const [lang, setLang] = useState(loadLang)
  const { supported, listening, error, heard, start, stop } = useVoiceCounter({ zikirId: zikir.id, lang, onCount })

  const changeLang = (id) => {
    setLang(id)
    try {
      localStorage.setItem(LANG_KEY, id)
    } catch {
      // abaikan
    }
  }

  if (!supported) {
    return (
      <p className="mt-3 rounded-2xl bg-lilac-100/70 px-3 py-2 text-center text-xs text-plum-soft">
        🎙️ Kira dengan suara tidak disokong oleh pelayar ini. Cuba buka app dalam Safari atau Chrome terkini.
      </p>
    )
  }

  if (!listening) {
    return (
      <div className="mt-3">
        <button type="button" onClick={start}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-lilac-100 to-blush-100 py-3 text-sm font-bold text-plum ring-1 ring-lilac-200 transition active:scale-95">
          🎙️ Kira dengan suara
        </button>
        {error && <p role="alert" className="mt-2 text-center text-xs font-semibold text-blush-600">{error}</p>}
      </div>
    )
  }

  return (
    <div className="mt-3 rounded-3xl bg-gradient-to-br from-lilac-100 to-blush-50 p-4 ring-1 ring-lilac-200">
      <div className="flex items-center gap-3">
        <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-blush-400 text-xl text-white">
          <span className="absolute inset-0 animate-ping rounded-full bg-blush-300 opacity-60" />
          <span className="relative">🎙️</span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-plum">Sedang mendengar…</p>
          <p className="text-xs text-plum-soft">Sebut “{zikir.name}” dengan jelas. Setiap sebutan dikira.</p>
        </div>
      </div>
      <p className="mt-3 min-h-[1.5rem] truncate rounded-xl bg-white/70 px-3 py-1 text-center text-sm text-plum" aria-live="polite">
        {heard ? `“${heard}”` : '…'}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex gap-1 rounded-full bg-white/80 p-1" role="radiogroup" aria-label="Bahasa pengecaman">
          {LANGS.map((l) => (
            <button key={l.id} type="button" role="radio" aria-checked={lang === l.id} onClick={() => changeLang(l.id)}
              className={`rounded-full px-3 py-1 text-xs font-bold ${lang === l.id ? 'bg-lilac-500 text-white' : 'text-plum-soft'}`}>
              {l.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={stop}
          className="rounded-full bg-blush-500 px-4 py-2 text-xs font-bold text-white shadow-glow active:scale-95">
          ⏹ Berhenti
        </button>
      </div>
      <p className="mt-2 text-[11px] leading-snug text-plum-soft">
        Jika kiraan kurang tepat, cuba tukar bahasa atau sebut dengan sedikit jeda antara setiap zikir.
      </p>
    </div>
  )
}
