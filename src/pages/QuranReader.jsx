import { useCallback, useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Toast from '../components/Toast'
import { go } from '../useHashRoute'
import { ayatIndex, loadSurah, surahInfo, toArabicNumber } from '../quran/quranUtils'
import { useQuranProgress } from '../quran/useQuranProgress'

const BISMILLAH = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ'
const FONT_SIZES = [22, 26, 30, 34, 38]
const PREFS_KEY = 'zikir-monitor:quran-prefs'

function loadPrefs() {
  try {
    return { font: 1, translation: true, ...JSON.parse(localStorage.getItem(PREFS_KEY)) }
  } catch {
    return { font: 1, translation: true }
  }
}

export default function QuranReader({ surah, focusAyat }) {
  const info = surahInfo(surah)
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const [prefs, setPrefs] = useState(loadPrefs)
  const [toast, setToast] = useState(null)
  const [khatamShown, setKhatamShown] = useState(0)
  const { bookmark, readIndex, today, khatam, markRead } = useQuranProgress()
  const clearToast = useCallback(() => setToast(null), [])

  const updatePrefs = (change) => {
    const next = { ...prefs, ...change }
    setPrefs(next)
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(next))
    } catch {
      // abaikan
    }
  }

  const fetchSurah = useCallback(() => {
    setError(false)
    setData(null)
    loadSurah(surah).then(setData).catch(() => setError(true))
  }, [surah])

  useEffect(fetchSurah, [fetchSurah])

  // Skrol terus ke ayat yang perlu dibaca seterusnya
  useEffect(() => {
    if (!data || !focusAyat) return
    const el = document.getElementById(`ayat-${focusAyat}`)
    if (el) el.scrollIntoView({ block: 'start' })
  }, [data, focusAyat])

  const handleMark = (a) => {
    const before = today
    const finished = markRead(surah, a)
    if (finished) {
      setKhatamShown(khatam + 1)
      return
    }
    const gained = Math.max(0, ayatIndex(surah, a) - readIndex)
    setToast(gained > 0
      ? `📍 Ditanda: ${info.name} ayat ${a} · Hari ini ${before + gained} ayat`
      : `📍 Tanda bacaan dipindah ke ${info.name} ayat ${a}`)
  }

  const fontSize = FONT_SIZES[prefs.font] ?? FONT_SIZES[1]

  return (
    <div className="islamic-pattern min-h-dvh">
      <main className="mx-auto max-w-md px-5 pb-10" style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}>
        <PageHeader title={`${info.n}. ${info.name}`} subtitle={`${info.type} · ${info.ayat} ayat · Juz ${info.juz}`} onBack={() => go('/quran')}
          right={<span className="font-arabic text-xl text-blush-600" lang="ar" dir="rtl">{info.arabic}</span>} />

        {/* Tetapan bacaan */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 rounded-full bg-white/90 p-1 shadow-soft ring-1 ring-blush-100">
            <button type="button" aria-label="Kecilkan tulisan" disabled={prefs.font === 0}
              onClick={() => updatePrefs({ font: prefs.font - 1 })}
              className="grid size-9 place-items-center rounded-full text-sm font-bold text-plum disabled:opacity-30 active:bg-blush-100">A−</button>
            <button type="button" aria-label="Besarkan tulisan" disabled={prefs.font === FONT_SIZES.length - 1}
              onClick={() => updatePrefs({ font: prefs.font + 1 })}
              className="grid size-9 place-items-center rounded-full text-lg font-bold text-plum disabled:opacity-30 active:bg-blush-100">A+</button>
          </div>
          <button type="button" aria-pressed={prefs.translation} onClick={() => updatePrefs({ translation: !prefs.translation })}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold shadow-soft ring-1 transition active:scale-95 ${prefs.translation ? 'bg-lilac-100 text-lilac-500 ring-lilac-200' : 'bg-white/90 text-plum-soft ring-blush-100'}`}>
            {prefs.translation ? '✓ Terjemahan' : 'Terjemahan'}
          </button>
        </div>

        {surah !== 1 && surah !== 9 && (
          <p className="mb-4 rounded-3xl bg-gradient-to-br from-blush-100 to-lilac-100 py-4 text-center font-quran text-3xl leading-loose text-blush-600 ring-1 ring-blush-100" lang="ar" dir="rtl">
            {BISMILLAH}
          </p>
        )}

        {error && (
          <div className="rounded-3xl bg-white/90 p-6 text-center shadow-soft ring-1 ring-blush-100">
            <p className="text-sm text-plum">Tidak dapat memuatkan surah. Sila semak sambungan internet.</p>
            <button type="button" onClick={fetchSurah} className="mt-3 rounded-full bg-blush-400 px-5 py-2 text-sm font-bold text-white">Cuba lagi</button>
          </div>
        )}
        {!data && !error && <p className="py-10 text-center text-sm text-plum-soft">Memuatkan surah… 🌸</p>}

        {data && (
          <ol className="flex flex-col gap-3">
            {data.ar.map((text, i) => {
              const a = i + 1
              const isBookmark = bookmark && bookmark.s === surah && bookmark.a === a
              const isRead = ayatIndex(surah, a) <= readIndex
              const isSajda = data.sajda.includes(a)
              return (
                <li key={a} id={`ayat-${a}`}
                  className={`scroll-mt-24 rounded-3xl p-4 shadow-soft ring-1 ${isBookmark ? 'bg-blush-50 ring-2 ring-blush-300' : 'bg-white/90 ring-blush-100'}`}>
                  <p className="font-quran text-plum" style={{ fontSize, lineHeight: 2.15 }} lang="ar" dir="rtl">
                    {text}{' '}
                    <span className="whitespace-nowrap text-blush-500">﴿{toArabicNumber(a)}﴾</span>
                    {isSajda && <span className="text-lilac-500"> ۩</span>}
                  </p>
                  {prefs.translation && (
                    <p className="mt-2 text-sm leading-relaxed text-plum-soft">
                      <span className="font-semibold text-blush-500">{a}. </span>{data.ms[i]}
                      {isSajda && <span className="font-semibold text-lilac-500"> (Ayat Sajdah)</span>}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-blush-100 pt-3">
                    <span className="text-[11px] font-medium text-plum-soft">
                      Juz {data.juz[i]} · Muka surat {data.page[i]}{isRead && !isBookmark ? ' · ✓' : ''}
                    </span>
                    {isBookmark ? (
                      <span className="rounded-full bg-blush-400 px-3 py-1.5 text-xs font-bold text-white">📍 Bacaan terakhir</span>
                    ) : (
                      <button type="button" onClick={() => handleMark(a)}
                        className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-blush-500 ring-1 ring-blush-200 transition active:scale-95">
                        🔖 Baca sampai sini
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        )}

        {data && (
          <div className="mt-5 grid grid-cols-2 gap-3">
            {surah > 1 ? (
              <button type="button" onClick={() => go(`/quran/${surah - 1}`)}
                className="rounded-2xl bg-white/90 px-3 py-3 text-sm font-semibold text-plum shadow-soft ring-1 ring-blush-100 active:scale-95">
                ‹ {surahInfo(surah - 1).name}
              </button>
            ) : <span />}
            {surah < 114 && (
              <button type="button" onClick={() => go(`/quran/${surah + 1}`)}
                className="rounded-2xl bg-gradient-to-br from-blush-400 to-blush-500 px-3 py-3 text-sm font-bold text-white shadow-glow active:scale-95">
                {surahInfo(surah + 1).name} ›
              </button>
            )}
          </div>
        )}
      </main>

      <Toast message={toast} onDone={clearToast} />

      {khatamShown > 0 && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-plum/40 p-6 backdrop-blur-sm">
          <div className="animate-toast w-full max-w-sm rounded-[2rem] bg-white p-6 text-center shadow-soft">
            <p className="text-5xl">🎉🌸📖</p>
            <h2 className="mt-3 font-display text-3xl italic text-plum">Tahniah!</h2>
            <p className="mt-2 text-lg font-bold text-blush-500">Khatam ke-{khatamShown}</p>
            <p className="mt-2 text-sm text-plum-soft">Alhamdulillah. Semoga Allah menerima bacaan anda dan menjadikan Al-Quran syafaat di akhirat kelak.</p>
            <button type="button" onClick={() => { setKhatamShown(0); go('/quran') }}
              className="mt-5 w-full rounded-2xl bg-gradient-to-br from-blush-400 to-blush-500 py-3 text-sm font-bold text-white shadow-glow active:scale-95">
              Amin 🤲
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
