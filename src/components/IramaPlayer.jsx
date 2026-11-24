import { useEffect, useRef, useState } from 'react'
import { ASMA } from '../asma/names'
import { canSpeak, speakName, stopSpeaking } from '../asma/speak'
import { playNote } from '../sounds'

// Melodi pentatonik ringkas yang berulang: satu not bagi setiap nama
const MELODY = [523.25, 587.33, 659.25, 783.99, 880, 783.99, 659.25, 587.33]
const SPEEDS = [
  { id: 'perlahan', label: 'Perlahan', beat: 2600, rate: 0.7 },
  { id: 'sederhana', label: 'Sederhana', beat: 2000, rate: 0.8 },
  { id: 'laju', label: 'Laju', beat: 1400, rate: 0.95 },
]

// Mod Irama: papar & sebut nama satu demi satu mengikut rentak, untuk hafalan
export default function IramaPlayer({ range, onClose }) {
  const list = ASMA.slice(range[0] - 1, range[1])
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [voice, setVoice] = useState(canSpeak)
  const [speed, setSpeed] = useState(SPEEDS[1])
  const [loop, setLoop] = useState(true)
  const token = useRef(0)
  const timer = useRef(null)

  const clear = () => {
    token.current++
    clearTimeout(timer.current)
    stopSpeaking()
  }

  useEffect(() => () => clear(), [])

  // Mainkan satu nama, kemudian pergi ke nama seterusnya
  useEffect(() => {
    if (!playing) return
    const my = ++token.current
    const item = list[index]
    playNote(MELODY[index % MELODY.length])
    const started = Date.now()
    const next = () => {
      if (token.current !== my) return
      const wait = Math.max(250, speed.beat - (Date.now() - started))
      timer.current = setTimeout(() => {
        if (token.current !== my) return
        if (index + 1 < list.length) setIndex(index + 1)
        else if (loop) setIndex(0)
        else setPlaying(false)
      }, wait)
    }
    if (voice) {
      timer.current = setTimeout(() => speakName(item, { rate: speed.rate, onEnd: next }), 180)
    } else {
      next()
    }
    return () => {
      clearTimeout(timer.current)
    }
  }, [playing, index, voice, speed, loop]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    if (playing) {
      clear()
      setPlaying(false)
    } else {
      setPlaying(true)
    }
  }
  const go = (d) => {
    clear()
    setIndex((i) => (i + d + list.length) % list.length)
  }

  const item = list[index]
  const upcoming = [1, 2, 3].map((k) => list[index + k]).filter(Boolean)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-blush-100 via-cream to-lilac-100" role="dialog" aria-modal="true" aria-label="Mod Irama">
      <div className="islamic-pattern mx-auto flex w-full max-w-md flex-1 flex-col px-5"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))', paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-blush-400">🎵 Mod Irama · {range[0]}–{range[1]}</p>
          <button type="button" onClick={() => { clear(); onClose() }} aria-label="Tutup"
            className="grid size-10 place-items-center rounded-full bg-white text-plum shadow-soft ring-1 ring-blush-100">✕</button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-bold text-blush-500">{item.n} / 99</span>
          <p key={item.n} className="animate-pop mt-4 font-arabic text-6xl leading-[1.6] text-blush-600" lang="ar" dir="rtl">{item.ar}</p>
          <p className="mt-2 text-2xl font-bold text-plum">{item.rumi}</p>
          <p className="mt-1 text-base text-plum-soft">{item.ms}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {upcoming.map((u) => (
              <span key={u.n} className="rounded-full bg-white px-3 py-0.5 font-arabic text-lg leading-loose text-plum-soft" lang="ar">{u.ar}</span>
            ))}
          </div>
          <div className="mt-5 h-1.5 w-48 overflow-hidden rounded-full bg-white/70">
            <div className="h-full rounded-full bg-blush-400 transition-[width]" style={{ width: `${((index + 1) / list.length) * 100}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-5">
          <button type="button" onClick={() => go(-1)} aria-label="Sebelum" className="grid size-12 place-items-center rounded-full bg-white text-xl text-plum shadow-soft">‹</button>
          <button type="button" onClick={toggle} aria-label={playing ? 'Jeda' : 'Main'}
            className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-blush-400 to-blush-500 text-3xl text-white shadow-glow active:scale-95">
            {playing ? '❚❚' : '▶'}
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Seterusnya" className="grid size-12 place-items-center rounded-full bg-white text-xl text-plum shadow-soft">›</button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {SPEEDS.map((s) => (
            <button key={s.id} type="button" aria-pressed={speed.id === s.id} onClick={() => setSpeed(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${speed.id === s.id ? 'bg-lilac-500 text-white' : 'bg-white/80 text-plum-soft'}`}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-center gap-2">
          {canSpeak && (
            <button type="button" aria-pressed={voice} onClick={() => { clear(); setVoice((v) => !v) }}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${voice ? 'bg-blush-100 text-blush-600' : 'bg-white/80 text-plum-soft'}`}>
              {voice ? '🗣 Suara: Hidup' : '🗣 Suara: Mati'}
            </button>
          )}
          <button type="button" aria-pressed={loop} onClick={() => setLoop((l) => !l)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${loop ? 'bg-blush-100 text-blush-600' : 'bg-white/80 text-plum-soft'}`}>
            🔁 Ulang
          </button>
        </div>
        <p className="mt-3 text-center text-[11px] text-plum-soft">Ikut sebut bersama-sama. Suara ialah suara telefon (bukan qari).</p>
      </div>
    </div>
  )
}
