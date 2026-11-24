import { useMemo, useState } from 'react'
import { ASMA } from '../asma/names'
import { speakName } from '../asma/speak'

// Uji hafalan: lihat nama, cuba ingat maksudnya, kemudian semak
export default function HafalanQuiz({ range, hafal, setOne, onClose }) {
  const pool = useMemo(() => ASMA.slice(range[0] - 1, range[1]), [range])
  const pick = (exclude) => {
    const notYet = pool.filter((x) => !hafal.has(x.n) && x.n !== exclude)
    const from = notYet.length ? notYet : pool.filter((x) => x.n !== exclude)
    return from[Math.floor(Math.random() * from.length)] ?? pool[0]
  }
  const [item, setItem] = useState(() => pick())
  const [shown, setShown] = useState(false)
  const done = pool.filter((x) => hafal.has(x.n)).length

  const answer = (remembered) => {
    setOne(item.n, remembered)
    setShown(false)
    setItem(pick(item.n))
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-blush-400">🃏 Uji Hafalan · {range[0]}–{range[1]}</p>
        <span className="text-xs font-bold text-lilac-500">{done}/{pool.length} hafal</span>
      </div>
      <div className="mt-4 rounded-3xl bg-gradient-to-br from-blush-50 to-lilac-100 p-6 text-center ring-1 ring-blush-100">
        <span className="text-xs font-bold text-blush-400">Nama ke-{item.n}</span>
        <p className="mt-2 font-arabic text-5xl leading-[1.6] text-blush-600" lang="ar" dir="rtl">{item.ar}</p>
        <p className="mt-1 text-xl font-bold text-plum">{item.rumi}</p>
        <button type="button" onClick={() => speakName(item)} className="mt-2 text-sm font-semibold text-lilac-500">🔊 Dengar sebutan</button>
        {shown ? (
          <p className="mt-4 rounded-2xl bg-white/80 px-3 py-3 text-lg font-bold text-plum">{item.ms}</p>
        ) : (
          <p className="mt-4 text-sm text-plum-soft">Apakah maksud nama ini?</p>
        )}
      </div>
      {shown ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => answer(false)} className="rounded-2xl bg-white py-3 text-sm font-bold text-plum ring-1 ring-blush-200 active:scale-95">✗ Belum ingat</button>
          <button type="button" onClick={() => answer(true)} className="rounded-2xl bg-gradient-to-br from-blush-400 to-blush-500 py-3 text-sm font-bold text-white shadow-glow active:scale-95">✓ Saya ingat</button>
        </div>
      ) : (
        <button type="button" onClick={() => setShown(true)} className="mt-4 w-full rounded-2xl bg-gradient-to-br from-lilac-300 to-blush-400 py-3 text-sm font-bold text-white shadow-glow active:scale-95">
          Tunjuk maksud
        </button>
      )}
      <button type="button" onClick={onClose} className="mt-3 w-full py-1 text-xs font-semibold text-plum-soft">Tutup</button>
    </div>
  )
}
