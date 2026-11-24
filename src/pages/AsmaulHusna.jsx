import { useState } from 'react'
import BottomSheet from '../components/BottomSheet'
import HafalanQuiz from '../components/HafalanQuiz'
import IramaPlayer from '../components/IramaPlayer'
import PageHeader from '../components/PageHeader'
import { ASMA } from '../asma/names'
import { canSpeak, speakName } from '../asma/speak'
import { useHafal } from '../asma/useHafal'
import { go } from '../useHashRoute'

const RANGES = [
  [1, 20], [21, 40], [41, 60], [61, 80], [81, 99], [1, 99],
]
const label = (r) => (r[0] === 1 && r[1] === 99 ? 'Semua' : `${r[0]}–${r[1]}`)
const YOUTUBE = 'https://www.youtube.com/results?search_query=lagu+asmaul+husna+99+nama+allah'

export default function AsmaulHusna() {
  const { hafal, setOne } = useHafal()
  const [range, setRange] = useState(RANGES[0])
  const [open, setOpen] = useState(null)
  const [irama, setIrama] = useState(false)
  const [quiz, setQuiz] = useState(false)
  const count = hafal.size
  const list = ASMA.slice(range[0] - 1, range[1])

  return (
    <div className="islamic-pattern min-h-dvh">
      <main className="mx-auto max-w-md px-5 pb-10" style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}>
        <PageHeader title="Asma'ul Husna" subtitle="99 nama Allah yang indah" onBack={() => go('/')} />

        <section className="rounded-[2rem] bg-white/90 p-5 text-center shadow-soft ring-1 ring-blush-100">
          <p className="font-quran text-2xl leading-loose text-blush-600" lang="ar" dir="rtl">وَلِلَّهِ ٱلۡأَسۡمَاۤءُ ٱلۡحُسۡنَىٰ فَٱدۡعُوهُ بِهَاۖ</p>
          <p className="text-xs text-plum-soft">“Dan Allah mempunyai nama-nama yang baik, maka serulah Dia dengannya.” (Al-A‘raf: 180)</p>
          <div className="mt-4 flex items-end justify-between text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blush-400">Sudah hafal</p>
              <p className="text-3xl font-bold text-blush-500">{count}<span className="text-base text-plum-soft"> / 99</span></p>
            </div>
            {count === 99 && <span className="text-2xl">🎉</span>}
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-blush-50 p-0.5 ring-1 ring-blush-100">
            <div className="h-full rounded-full bg-gradient-to-r from-lilac-300 to-blush-400" style={{ width: `${Math.max(1, (count / 99) * 100)}%` }} />
          </div>
        </section>

        <div className="mt-4 grid grid-cols-6 gap-1" role="tablist" aria-label="Bahagian">
          {RANGES.map((r) => (
            <button key={label(r)} type="button" role="tab" aria-selected={range === r} onClick={() => { setRange(r); setOpen(null) }}
              className={`rounded-full px-0.5 py-2 text-[11px] font-bold transition ${range === r ? 'bg-blush-400 text-white shadow-glow' : 'bg-white/90 text-plum ring-1 ring-blush-100'}`}>
              {label(r)}
            </button>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setIrama(true)}
            className="rounded-2xl bg-gradient-to-br from-blush-400 to-blush-500 py-3 text-sm font-bold text-white shadow-glow active:scale-95">
            🎵 Mod Irama
          </button>
          <button type="button" onClick={() => setQuiz(true)}
            className="rounded-2xl bg-white py-3 text-sm font-bold text-plum shadow-soft ring-1 ring-blush-200 active:scale-95">
            🃏 Uji Hafalan
          </button>
        </div>
        <a href={YOUTUBE} target="_blank" rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-white/90 py-3 text-sm font-bold text-plum shadow-soft ring-1 ring-lilac-200 active:scale-95">
          ▶️ Dengar lagu Asma'ul Husna di YouTube
        </a>

        <ul className="mt-4 flex flex-col gap-2.5">
          {list.map((x) => {
            const isOpen = open === x.n
            const done = hafal.has(x.n)
            return (
              <li key={x.n} className={`rounded-3xl bg-white/90 shadow-soft ring-1 ${isOpen ? 'ring-2 ring-blush-300' : 'ring-blush-100'}`}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : x.n)} className="flex w-full items-center gap-3 p-3 text-left">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold ${done ? 'bg-blush-400 text-white' : 'bg-blush-50 text-blush-600'}`}>
                    {done ? '✓' : x.n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-plum">{x.rumi}</span>
                    <span className="block text-xs leading-snug text-plum-soft">{x.ms}</span>
                  </span>
                  <span className="font-arabic text-2xl text-blush-600" lang="ar" dir="rtl">{x.ar}</span>
                </button>
                {isOpen && (
                  <div className="flex gap-2 border-t border-blush-100 p-3">
                    {canSpeak && (
                      <button type="button" onClick={() => speakName(x)}
                        className="flex-1 rounded-2xl bg-lilac-100 py-2.5 text-sm font-bold text-lilac-500 active:scale-95">🔊 Sebut</button>
                    )}
                    <button type="button" onClick={() => setOne(x.n, !done)}
                      className={`flex-1 rounded-2xl py-2.5 text-sm font-bold active:scale-95 ${done ? 'bg-white text-plum ring-1 ring-blush-200' : 'bg-gradient-to-br from-blush-400 to-blush-500 text-white shadow-glow'}`}>
                      {done ? '↺ Belum hafal' : '✓ Sudah hafal'}
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
        <p className="mt-6 text-center text-[11px] leading-relaxed text-plum-soft">
          Senarai 99 nama mengikut riwayat at-Tirmizi. Sebutan 🔊 menggunakan suara telefon.
        </p>
      </main>

      {irama && <IramaPlayer range={range} onClose={() => setIrama(false)} />}
      <BottomSheet open={quiz} onClose={() => setQuiz(false)} label="Uji hafalan">
        {quiz && <HafalanQuiz range={range} hafal={hafal} setOne={setOne} onClose={() => setQuiz(false)} />}
      </BottomSheet>
    </div>
  )
}
