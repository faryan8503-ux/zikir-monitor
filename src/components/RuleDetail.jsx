import { useEffect, useState } from 'react'
import { TAJWID_EXAMPLES, TAJWID_RULES, WAQAF, WAQAF_COLOR } from '../quran/tajwid'
import { surahInfo } from '../quran/quranUtils'
import { appWordAt, ayahAudioUrl, onPlayerState, playUrls, qcomWords, stopAudio, wordAudioUrl, wordBounds } from '../quran/recitation'

// Butang main audio kecil
function PlayButton({ id, state, onPlay, children, primary }) {
  const busy = state === `loading:${id}`
  const playing = state === `playing:${id}`
  return (
    <button type="button" onClick={() => (playing ? stopAudio() : onPlay())}
      className={`flex items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5 text-sm font-bold transition active:scale-95 ${primary ? 'bg-gradient-to-br from-blush-400 to-blush-500 text-white shadow-glow' : 'bg-white text-blush-600 ring-1 ring-blush-200'}`}>
      <span aria-hidden="true">{busy ? '⏳' : playing ? '⏹' : '▶'}</span> {children}
    </button>
  )
}

// Penerangan satu hukum tajwid / tanda waqaf, dengan contoh bacaan
export default function RuleDetail({ item, onClose, onGuide }) {
  const [state, setState] = useState('idle')

  useEffect(() => {
    onPlayerState(setState)
    return () => {
      stopAudio()
      onPlayerState(null)
    }
  }, [])

  if (!item) return null
  const isWaqaf = item.type === 'waqaf'
  const rule = isWaqaf ? WAQAF[item.key] : TAJWID_RULES[item.key]
  const color = isWaqaf ? WAQAF_COLOR : rule.color
  const ctx = item.ctx // { surah, ayah, text, start, end, wm }
  // Contoh klasik (kecuali yang datang dari ayat yang sedang dibaca)
  const examples = isWaqaf ? [] : (TAJWID_EXAMPLES[item.key] ?? []).filter((ex) => !(ctx && ex.s === ctx.surah && ex.a === ctx.ayah))

  let here = null
  if (ctx && !isWaqaf) {
    const [ws, we] = wordBounds(ctx.text, ctx.start, ctx.end)
    const first = appWordAt(ctx.text, ws)
    const last = appWordAt(ctx.text, Math.max(ws, we - 1))
    const words = []
    for (let w = first; w <= last; w++) {
      for (const q of qcomWords(ctx.text, ctx.wm, w)) if (!words.includes(q)) words.push(q)
    }
    here = {
      before: ctx.text.slice(ws, ctx.start),
      part: ctx.text.slice(ctx.start, ctx.end),
      after: ctx.text.slice(ctx.end, we),
      words,
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl font-quran text-xl" style={{ background: `${color}1f`, color }} lang="ar" dir="rtl">
          {isWaqaf ? rule.symbol : '●'}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color }}>{isWaqaf ? 'Tanda Waqaf' : 'Hukum Tajwid'}</p>
          <h3 className="text-lg font-bold text-plum">{rule.name}</h3>
        </div>
      </div>
      {isWaqaf && <p className="mt-3 inline-block rounded-full px-3 py-1 text-sm font-bold" style={{ background: `${color}1f`, color }}>{rule.action}</p>}
      <p className="mt-3 text-[15px] leading-relaxed text-plum">{rule.info}</p>

      {/* Contoh dalam ayat yang sedang dibaca */}
      {here && (
        <section className="mt-4 rounded-3xl bg-blush-50 p-4 ring-1 ring-blush-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-blush-400">Dalam ayat ini · {surahInfo(ctx.surah).name} {ctx.ayah}</p>
          <p className="mt-1 text-center font-quran text-3xl leading-loose text-plum" lang="ar" dir="rtl">
            {here.before}<span style={{ color }}>{here.part}</span>{here.after}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <PlayButton id="word" state={state} primary
              onPlay={() => playUrls(here.words.map((w) => wordAudioUrl(ctx.surah, ctx.ayah, w)), 'word')}>
              Perkataan
            </PlayButton>
            <PlayButton id="ayah" state={state} onPlay={() => playUrls([ayahAudioUrl(ctx.surah, ctx.ayah)], 'ayah')}>
              Ayat penuh
            </PlayButton>
          </div>
        </section>
      )}

      {/* Contoh klasik */}
      {examples.length > 0 && (
        <section className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blush-400">{here ? 'Contoh lain' : 'Contoh bacaan'}</p>
          <ul className="flex flex-col gap-2">
            {examples.map((ex, k) => (
              <li key={k} className="rounded-3xl bg-lilac-100/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <PlayButton id={`ex${k}`} state={state}
                    onPlay={() => playUrls(ex.words.map((w) => wordAudioUrl(ex.s, ex.a, w)), `ex${k}`)}>
                    Dengar
                  </PlayButton>
                  <p className="font-quran text-3xl leading-loose" style={{ color }} lang="ar" dir="rtl">{ex.ar}</p>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-plum"><b>Cara baca:</b> {ex.baca}</p>
                <p className="mt-0.5 text-[11px] text-plum-soft">{surahInfo(ex.s).name}, ayat {ex.a}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {state === 'error' && (
        <p role="alert" className="mt-3 rounded-2xl bg-blush-100 px-3 py-2 text-center text-xs font-semibold text-blush-600">
          Audio tidak dapat dimainkan. Sila semak sambungan internet.
        </p>
      )}
      {(here || examples.length > 0) && <p className="mt-3 text-center text-[11px] text-plum-soft">Audio: Quran.com (perkataan) & Mishary Alafasy (ayat). Perlukan internet.</p>}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={onGuide} className="rounded-2xl bg-white py-3 text-sm font-bold text-plum ring-1 ring-blush-200 active:scale-95">📘 Panduan penuh</button>
        <button type="button" onClick={onClose} className="rounded-2xl bg-gradient-to-br from-blush-400 to-blush-500 py-3 text-sm font-bold text-white shadow-glow active:scale-95">Faham 👍</button>
      </div>
    </div>
  )
}
