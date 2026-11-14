import { useEffect, useState } from 'react'
import { surahInfo, toArabicNumber } from '../quran/quranUtils'
import { TAFSIR_SOURCE, loadTafsir } from '../quran/tafsir'

// Tadabbur: terangkan maksud & pengajaran ayat (tafsir ringkas) kepada pembaca
export default function TadabburSheet({ surah, ayah, arabic, translation, hasNote, onChangeAyah, onWriteNote, onClose }) {
  const [tafsir, setTafsir] = useState(null)
  const [error, setError] = useState(false)
  const total = surahInfo(surah).ayat

  const fetchTafsir = () => {
    setError(false)
    loadTafsir(surah).then(setTafsir).catch(() => setError(true))
  }
  useEffect(fetchTafsir, [surah]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-blush-400">📖 Tadabbur · {surahInfo(surah).name} {ayah}</p>
      <p className="mt-2 max-h-36 overflow-y-auto rounded-2xl bg-blush-50 px-3 py-2 font-quran text-2xl leading-loose text-plum" lang="ar" dir="rtl">
        {arabic} <span className="text-blush-500">﴿{toArabicNumber(ayah)}﴾</span>
      </p>

      <section className="mt-3">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-lilac-500">Maksud ayat</h4>
        <p className="mt-1 text-[15px] leading-relaxed text-plum">{translation}</p>
      </section>

      <section className="mt-4 rounded-3xl bg-gradient-to-br from-lilac-100/80 to-blush-50 p-4 ring-1 ring-lilac-200">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-lilac-500">💡 Huraian & pengajaran</h4>
        {error && (
          <div className="mt-2 text-center">
            <p className="text-sm text-plum">Huraian tidak dapat dimuatkan. Sila semak sambungan internet.</p>
            <button type="button" onClick={fetchTafsir} className="mt-2 rounded-full bg-blush-400 px-4 py-1.5 text-xs font-bold text-white">Cuba lagi</button>
          </div>
        )}
        {!tafsir && !error && <p className="mt-2 text-sm text-plum-soft">Memuatkan… 🌸</p>}
        {tafsir && <p className="mt-2 text-[15px] leading-relaxed text-plum">{tafsir.ayat[ayah - 1]}</p>}
        <p className="mt-3 text-[11px] leading-snug text-plum-soft">Sumber: {TAFSIR_SOURCE} (dalam Bahasa Indonesia).</p>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" disabled={ayah <= 1} onClick={() => onChangeAyah(ayah - 1)}
          className="rounded-2xl bg-white py-3 text-sm font-bold text-plum ring-1 ring-blush-200 active:scale-95 disabled:opacity-40">‹ Ayat {ayah > 1 ? ayah - 1 : ''}</button>
        <button type="button" disabled={ayah >= total} onClick={() => onChangeAyah(ayah + 1)}
          className="rounded-2xl bg-white py-3 text-sm font-bold text-plum ring-1 ring-blush-200 active:scale-95 disabled:opacity-40">Ayat {ayah < total ? ayah + 1 : ''} ›</button>
      </div>
      <button type="button" onClick={onClose}
        className="mt-3 w-full rounded-2xl bg-gradient-to-br from-blush-400 to-blush-500 py-3 text-sm font-bold text-white shadow-glow active:scale-95">
        Tutup
      </button>
      <button type="button" onClick={onWriteNote} className="mt-2 w-full py-1 text-xs font-semibold text-plum-soft">
        {hasNote ? '📝 Lihat catatan peribadi saya' : '✍️ Tulis catatan peribadi (pilihan)'}
      </button>
    </div>
  )
}

// Pengenalan surah (dipaparkan di atas halaman bacaan)
export function SurahIntro({ surah }) {
  const [open, setOpen] = useState(false)
  const [tafsir, setTafsir] = useState(null)
  const [error, setError] = useState(false)

  const toggle = () => {
    setOpen((o) => !o)
    if (!tafsir) {
      setError(false)
      loadTafsir(surah).then(setTafsir).catch(() => setError(true))
    }
  }

  return (
    <section className="mb-4 rounded-3xl bg-white/90 shadow-soft ring-1 ring-lilac-200">
      <button type="button" onClick={toggle} aria-expanded={open} className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left">
        <span className="text-sm font-bold text-plum">📖 Tentang surah ini</span>
        <span className="text-xs font-semibold text-lilac-500">{open ? 'Tutup ▴' : 'Baca ▾'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          {error && <p className="text-sm text-plum">Tidak dapat dimuatkan. Sila semak sambungan internet.</p>}
          {!tafsir && !error && <p className="text-sm text-plum-soft">Memuatkan… 🌸</p>}
          {tafsir && <p className="whitespace-pre-line text-sm leading-relaxed text-plum">{tafsir.intro}</p>}
          <p className="mt-2 text-[11px] text-plum-soft">Sumber: {TAFSIR_SOURCE} (dalam Bahasa Indonesia).</p>
        </div>
      )}
    </section>
  )
}
