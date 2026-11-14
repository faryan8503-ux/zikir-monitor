import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { go } from '../useHashRoute'
import { SURAHS } from '../quran/surahs'
import { TOTAL_AYAT, ayatIndex, juzOf, nextAyat, surahEndIndex, surahInfo, toArabicNumber } from '../quran/quranUtils'
import { useQuranProgress } from '../quran/useQuranProgress'

// Buang tanda baca supaya carian "al baqarah" = "Al-Baqarah"
const simplify = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, '')

export default function QuranList() {
  const { bookmark, readIndex, percent, today, khatam, resetProgress } = useQuranProgress()
  const [query, setQuery] = useState('')
  const next = nextAyat(bookmark)

  const list = useMemo(() => {
    const q = simplify(query)
    if (!q) return SURAHS
    return SURAHS.filter((s) => String(s.n) === q || simplify(s.name).includes(q))
  }, [query])

  const handleReset = () => {
    if (window.confirm('Mula semula bacaan dari Al-Fatihah? Rekod khatam tidak akan dipadam.')) resetProgress()
  }

  return (
    <div className="islamic-pattern min-h-dvh">
      <main className="mx-auto max-w-md px-5 pb-10" style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}>
        <PageHeader title="Al-Quran" subtitle="Baca & pantau sehingga khatam" onBack={() => go('/')} />

        {/* Kad kemajuan khatam */}
        <section className="rounded-[2rem] bg-white/90 p-5 shadow-soft ring-1 ring-blush-100">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blush-400">Kemajuan Khatam</p>
              <p className="mt-1 text-4xl font-bold tabular-nums text-blush-500">{percent}%</p>
            </div>
            <div className="text-right text-xs font-medium text-plum-soft">
              <p>{readIndex} / {TOTAL_AYAT} ayat</p>
              <p>Hari ini: {today} ayat</p>
              <p>Khatam: {khatam} kali</p>
            </div>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-blush-50 p-0.5 ring-1 ring-blush-100">
            <div className="h-full rounded-full bg-gradient-to-r from-lilac-300 to-blush-400" style={{ width: `${Math.max(percent, 1)}%` }} />
          </div>
          <p className="mt-3 text-sm font-medium text-plum">
            {bookmark
              ? <>📍 Sampai: <b>{surahInfo(bookmark.s).name}</b>, ayat {bookmark.a} (Juz {juzOf(bookmark.s, bookmark.a)})</>
              : 'Belum ada tanda bacaan. Mulakan dari Al-Fatihah 🌷'}
          </p>
          <button type="button" onClick={() => go(`/quran/${next.s}?ayat=${next.a}`)}
            className="mt-3 w-full rounded-2xl bg-gradient-to-br from-blush-400 to-blush-500 py-3 text-sm font-bold text-white shadow-glow transition active:scale-95">
            {bookmark ? `Teruskan: ${surahInfo(next.s).name} ayat ${next.a}` : 'Mula Membaca'}
          </button>
          {bookmark && (
            <button type="button" onClick={handleReset} className="mt-2 w-full py-1 text-xs font-semibold text-plum-soft">
              ↺ Mula semula dari awal
            </button>
          )}
        </section>

        {/* Carian */}
        <div className="mt-5">
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="🔍 Cari surah (nama atau nombor)"
            className="w-full rounded-2xl bg-white/90 px-4 py-3 text-base text-plum shadow-soft outline-none ring-1 ring-blush-100 placeholder:text-plum-soft/70 focus:ring-2 focus:ring-blush-300" />
        </div>

        {/* Senarai surah */}
        <ul className="mt-4 flex flex-col gap-2.5">
          {list.map((s) => {
            const done = readIndex >= surahEndIndex(s.n)
            const current = bookmark && bookmark.s === s.n && !done
            const startIdx = ayatIndex(s.n, 1)
            const partial = current ? Math.round(((readIndex - startIdx + 1) / s.ayat) * 100) : 0
            return (
              <li key={s.n}>
                <button type="button" onClick={() => go(`/quran/${s.n}`)}
                  className={`flex w-full items-center gap-3 rounded-3xl bg-white/90 p-3 text-left shadow-soft ring-1 transition active:scale-[0.98] ${current ? 'ring-2 ring-blush-300' : 'ring-blush-100'}`}>
                  <span className={`relative grid size-11 shrink-0 place-items-center text-sm font-bold ${done ? 'text-white' : 'text-blush-600'}`}>
                    <svg viewBox="0 0 40 40" className="absolute inset-0" aria-hidden="true">
                      <g fill={done ? '#f18bb3' : '#fde7ef'} stroke="#f7aecb" strokeWidth="1">
                        <rect x="8" y="8" width="24" height="24" rx="3" />
                        <rect x="8" y="8" width="24" height="24" rx="3" transform="rotate(45 20 20)" />
                      </g>
                      <rect x="8.5" y="8.5" width="23" height="23" rx="3" fill={done ? '#f18bb3' : '#fde7ef'} />
                    </svg>
                    <span className="relative">{done ? '✓' : s.n}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-plum">{s.name}</span>
                    <span className="block text-xs text-plum-soft">
                      {s.type} · {s.ayat} ayat · Juz {s.juz}
                      {current && <span className="font-semibold text-blush-500"> · Sedang dibaca {partial}%</span>}
                    </span>
                  </span>
                  <span className="font-arabic text-xl text-blush-600" lang="ar" dir="rtl">{s.arabic}</span>
                </button>
              </li>
            )
          })}
          {list.length === 0 && <li className="py-6 text-center text-sm text-plum-soft">Tiada surah dijumpai.</li>}
        </ul>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-plum-soft">
          Teks Al-Quran: Tanzil Project (tanzil.net, CC BY 3.0) melalui Quran Academy.<br />
          Terjemahan: Abdullah Muhammad Basmeih, melalui Tanzil. {toArabicNumber(114)} surah.
        </p>
      </main>
    </div>
  )
}
