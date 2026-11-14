import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { go } from '../useHashRoute'
import { surahInfo, toArabicNumber } from '../quran/quranUtils'
import { ayahAudioUrl, onPlayerState, playUrls, stopAudio } from '../quran/recitation'

const TABS = [
  { id: 'penting', label: '⭐ Ayat Penting' },
  { id: 'doa', label: '🤲 Doa Al-Quran' },
]
const TAB_KEY = 'zikir-monitor:koleksi-tab'

function loadTab() {
  try {
    return localStorage.getItem(TAB_KEY) === 'doa' ? 'doa' : 'penting'
  } catch {
    return 'penting'
  }
}

const refText = (item) =>
  item.surah
    ? `Surah ${surahInfo(item.s).name} · ${surahInfo(item.s).ayat} ayat`
    : `${surahInfo(item.s).name} ${item.from}${item.to > item.from ? `–${item.to}` : ''}`

// Senarai ayat-ayat penting & doa-doa dari Al-Quran
export default function Koleksi() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const [tab, setTab] = useState(loadTab)
  const [open, setOpen] = useState(null)
  const [player, setPlayer] = useState('idle')

  const fetchData = () => {
    setError(false)
    fetch(`${import.meta.env.BASE_URL}koleksi.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true))
  }
  useEffect(fetchData, [])

  useEffect(() => {
    onPlayerState(setPlayer)
    return () => {
      stopAudio()
      onPlayerState(null)
    }
  }, [])

  const switchTab = (id) => {
    setTab(id)
    setOpen(null)
    stopAudio()
    try {
      localStorage.setItem(TAB_KEY, id)
    } catch {
      // abaikan
    }
  }

  const items = data?.[tab] ?? []

  return (
    <div className="islamic-pattern min-h-dvh">
      <main className="mx-auto max-w-md px-5 pb-10" style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}>
        <PageHeader title="Ayat Penting & Doa" subtitle="Amalan harian dari Al-Quran" onBack={() => go('/')} />

        <div className="mb-4 grid grid-cols-2 gap-1 rounded-full bg-white/90 p-1 shadow-soft ring-1 ring-blush-100" role="tablist">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => switchTab(t.id)}
              className={`rounded-full py-2.5 text-sm font-bold transition ${tab === t.id ? 'bg-gradient-to-br from-blush-400 to-blush-500 text-white shadow-glow' : 'text-plum'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-3xl bg-white/90 p-6 text-center shadow-soft ring-1 ring-blush-100">
            <p className="text-sm text-plum">Tidak dapat dimuatkan. Sila semak sambungan internet.</p>
            <button type="button" onClick={fetchData} className="mt-3 rounded-full bg-blush-400 px-5 py-2 text-sm font-bold text-white">Cuba lagi</button>
          </div>
        )}
        {!data && !error && <p className="py-10 text-center text-sm text-plum-soft">Memuatkan… 🌸</p>}

        <ul className="flex flex-col gap-3">
          {items.map((item, k) => {
            const id = `${tab}-${k}`
            const isOpen = open === id
            const playing = player === `playing:${id}`
            const loading = player === `loading:${id}`
            return (
              <li key={id} className={`rounded-3xl bg-white/90 shadow-soft ring-1 ${isOpen ? 'ring-2 ring-blush-300' : 'ring-blush-100'}`}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : id)} className="flex w-full items-start gap-3 p-4 text-left">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blush-100 to-lilac-100 text-sm font-bold text-blush-600">{k + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold leading-snug text-plum">{item.title}</span>
                    <span className="mt-0.5 block text-xs text-plum-soft">{refText(item)}</span>
                    <span className="mt-1.5 inline-block rounded-full bg-lilac-100 px-2 py-0.5 text-[11px] font-semibold text-lilac-500">{item.tag}</span>
                  </span>
                  <span className="pt-1 text-xs text-blush-400">{isOpen ? '▴' : '▾'}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-blush-100 px-4 pb-4 pt-3">
                    <p className="text-sm leading-relaxed text-plum">💡 {item.info}</p>

                    {item.ayat?.map((v) => (
                      <div key={v.a} className="mt-3 rounded-2xl bg-blush-50 p-3">
                        <p className="font-quran text-2xl leading-loose text-plum" lang="ar" dir="rtl">
                          {v.ar} <span className="text-blush-500">﴿{toArabicNumber(v.a)}﴾</span>
                        </p>
                        {v.rumi && <p className="mt-1 text-sm italic leading-relaxed text-blush-600">{v.rumi}</p>}
                        <p className="mt-1 text-sm leading-relaxed text-plum-soft">{v.ms}</p>
                      </div>
                    ))}

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {item.ayat ? (
                        <button type="button"
                          onClick={() => (playing ? stopAudio() : playUrls(item.ayat.map((v) => ayahAudioUrl(item.s, v.a)), id))}
                          className="rounded-2xl bg-gradient-to-br from-blush-400 to-blush-500 py-2.5 text-sm font-bold text-white shadow-glow active:scale-95">
                          {loading ? '⏳ Memuatkan' : playing ? '⏹ Berhenti' : '▶ Dengar'}
                        </button>
                      ) : <span />}
                      <button type="button" onClick={() => go(item.surah ? `/quran/${item.s}` : `/quran/${item.s}?ayat=${item.from}`)}
                        className="rounded-2xl bg-white py-2.5 text-sm font-bold text-plum ring-1 ring-blush-200 active:scale-95">
                        📖 {item.surah ? 'Baca surah' : 'Buka mushaf'}
                      </button>
                    </div>
                    {player === 'error' && <p className="mt-2 text-center text-xs font-semibold text-blush-600">Audio tidak dapat dimainkan. Sila semak internet.</p>}
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        {data && (
          <p className="mt-6 text-center text-[11px] leading-relaxed text-plum-soft">
            Bacaan rumi ialah panduan kasar; rujuk tulisan Arab untuk bacaan yang tepat.<br />
            Audio: Mishary Alafasy (everyayah.com). Terjemahan: Abdullah Muhammad Basmeih.
          </p>
        )}
      </main>
    </div>
  )
}
