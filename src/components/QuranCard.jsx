import { go } from '../useHashRoute'
import { useQuranProgress } from '../quran/useQuranProgress'
import { juzOf, nextAyat, surahInfo } from '../quran/quranUtils'

// Kad Al-Quran di skrin utama: tunjuk sampai mana bacaan & kemajuan khatam
export default function QuranCard() {
  const { bookmark, percent, today, khatam } = useQuranProgress()
  const next = nextAyat(bookmark)
  const where = bookmark
    ? `${surahInfo(bookmark.s).name}, ayat ${bookmark.a} · Juz ${juzOf(bookmark.s, bookmark.a)}`
    : 'Belum mula — mulakan dari Al-Fatihah'

  return (
    <section className="rounded-[2rem] bg-gradient-to-br from-white/90 to-blush-100/80 p-5 shadow-soft ring-1 ring-blush-100">
      <div className="flex items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blush-300 to-lilac-300 text-2xl shadow-soft">📖</span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blush-400">Bacaan Al-Quran</p>
          <p className="mt-0.5 text-sm font-semibold text-plum">{bookmark ? 'Bacaan terakhir:' : ''} {where}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs font-semibold">
          <span className="text-plum">Kemajuan khatam{khatam > 0 ? ` ke-${khatam + 1}` : ''}</span>
          <span className="text-blush-500">{percent}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white p-0.5 ring-1 ring-blush-100" role="progressbar"
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="Kemajuan khatam">
          <div className="h-full rounded-full bg-gradient-to-r from-lilac-300 to-blush-400 transition-[width] duration-500" style={{ width: `${Math.max(percent, 1)}%` }} />
        </div>
        <p className="mt-1.5 text-xs font-medium text-plum-soft">
          Hari ini: {today} ayat{khatam > 0 ? ` · Sudah khatam ${khatam} kali 🌸` : ''}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => go(`/quran/${next.s}?ayat=${next.a}`)}
          className="rounded-2xl bg-gradient-to-br from-blush-400 to-blush-500 px-3 py-3 text-sm font-bold text-white shadow-glow transition active:scale-95">
          {bookmark ? 'Teruskan Bacaan' : 'Mula Membaca'}
        </button>
        <button type="button" onClick={() => go('/quran')}
          className="rounded-2xl bg-white px-3 py-3 text-sm font-bold text-plum ring-1 ring-blush-200 transition active:scale-95">
          Senarai Surah
        </button>
      </div>
    </section>
  )
}
