import { useEffect, useState } from 'react'
import CounterButton from './components/CounterButton'
import MenuButtons from './components/MenuButtons'
import Flower, { Crescent, Sparkle } from './components/Flower'
import { useZikirCounter } from './useZikirCounter'
import { DAILY_TARGET } from './zikirData'
import { playAlhamdulillah, playWaterDrop } from './waterDrop'

const SOUND_KEY = 'zikir-monitor:sound'

function loadSound() {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off'
  } catch {
    return true
  }
}

const HARI = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu']
const BULAN = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember']

function formatDate(d) {
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`
}

export default function App() {
  const { zikir, zikirCount, total, increment, changeZikir, resetCurrent } = useZikirCounter()
  const [toast, setToast] = useState(null)
  const [soundOn, setSoundOn] = useState(loadSound)

  const toggleSound = () => {
    const next = !soundOn
    setSoundOn(next)
    try {
      localStorage.setItem(SOUND_KEY, next ? 'on' : 'off')
    } catch {
      // abaikan
    }
    if (next) playWaterDrop()
    setToast(next ? 'Bunyi titisan air dihidupkan 💧' : 'Bunyi dimatikan')
  }

  const handleTap = () => {
    const next = zikirCount + 1
    const milestone = next % 100 === 0
    if (soundOn) {
      if (milestone) playAlhamdulillah()
      else playWaterDrop()
    }
    if (milestone) setToast(`Alhamdulillah! ${next} kali ${zikir.name} ✨`)
    increment()
  }

  const progress = total / DAILY_TARGET
  const percent = Math.min(100, Math.round(progress * 100))
  const remaining = Math.max(0, DAILY_TARGET - total)
  const done = total >= DAILY_TARGET

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const handleReset = () => {
    if (zikirCount === 0) return
    if (window.confirm(`Set semula kiraan ${zikir.name} kepada 0?`)) resetCurrent()
  }

  return (
    <div className="islamic-pattern relative min-h-dvh overflow-hidden">
      {/* Hiasan bunga terapung */}
      <Flower size={46} className="animate-float absolute -left-3 top-24 opacity-70" />
      <Flower size={30} petal="#e2d6f6" className="animate-float absolute right-4 top-40 opacity-80 [animation-delay:1.5s]" />
      <Flower size={38} petal="#fbd0e0" className="animate-float absolute -right-2 bottom-40 opacity-60 [animation-delay:3s]" />
      <Sparkle className="absolute left-10 top-56" />
      <Sparkle size={9} color="#f7aecb" className="absolute right-12 top-72" />

      <main
        className="relative mx-auto flex max-w-md flex-col gap-5 px-5 pb-8"
        style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))', paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        {/* 1. Tajuk aplikasi */}
        <header className="relative text-center">
          <p className="font-arabic text-lg text-blush-500" lang="ar" dir="rtl">بِسْمِ ٱللّٰهِ</p>
          <div className="mt-1 flex items-center justify-center gap-2">
            <Crescent />
            <h1 className="font-display text-4xl italic text-plum">Zikir Monitor</h1>
            <Flower size={24} />
          </div>
          <p className="mt-1 text-sm font-medium text-plum-soft">{formatDate(new Date())}</p>
          <button type="button" onClick={toggleSound} aria-pressed={soundOn}
            aria-label={soundOn ? 'Matikan bunyi' : 'Hidupkan bunyi'}
            className={`absolute right-0 top-0 grid size-10 place-items-center rounded-full shadow-soft ring-1 transition active:scale-90 ${soundOn ? 'bg-white text-blush-500 ring-blush-100' : 'bg-white/60 text-plum-soft ring-lilac-200'}`}>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H3v6h3l5 4z" fill="currentColor" fillOpacity="0.15" />
              {soundOn ? <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /> : <path d="M16 9l5 6M21 9l-5 6" />}
            </svg>
          </button>
        </header>

        {/* 2–4. Kad kaunter utama */}
        <section className="rounded-[2rem] bg-white/85 p-5 shadow-soft ring-1 ring-blush-100 backdrop-blur">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-blush-400">Kaunter Zikir Harian</p>

          {/* Nama zikir semasa */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <button type="button" onClick={() => changeZikir(-1)} aria-label="Zikir sebelum"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-lilac-100 text-lilac-500 transition active:scale-90">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div className="min-w-0 text-center">
              <p className={`font-arabic leading-snug text-blush-600 ${zikir.arabic.length > 30 ? 'text-2xl' : 'text-3xl'}`} lang="ar" dir="rtl">{zikir.arabic}</p>
              <p className="text-xl font-bold text-plum">{zikir.name}</p>
              {zikir.latin && <p className="text-sm font-medium italic text-blush-500">{zikir.latin}</p>}
              <p className="text-xs text-plum-soft">{zikir.meaning}</p>
            </div>
            <button type="button" onClick={() => changeZikir(1)} aria-label="Zikir seterusnya"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-lilac-100 text-lilac-500 transition active:scale-90">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>

          {/* Butang kira */}
          <div className="mt-4">
            <CounterButton count={zikirCount} progress={progress} onTap={handleTap} />
          </div>

          <div className="mt-3 flex justify-center">
            <button type="button" onClick={handleReset}
              className="rounded-full px-4 py-1.5 text-xs font-semibold text-plum-soft ring-1 ring-blush-200 transition active:scale-95 disabled:opacity-40"
              disabled={zikirCount === 0}>
              ↺ Set semula
            </button>
          </div>
        </section>

        {/* 5–7. Sasaran, bar kemajuan & jumlah hari ini */}
        <section className="rounded-[2rem] bg-gradient-to-br from-white/90 to-lilac-100/80 p-5 shadow-soft ring-1 ring-lilac-200">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-blush-50 p-3 ring-1 ring-blush-100">
              <p className="text-xs font-semibold text-plum-soft">Jumlah Zikir Hari Ini</p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-blush-500">{total}</p>
            </div>
            <div className="rounded-2xl bg-lilac-100 p-3 ring-1 ring-lilac-200">
              <p className="text-xs font-semibold text-plum-soft">Sasaran Harian</p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-lilac-500">{DAILY_TARGET}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
              <span className="text-plum">Kemajuan</span>
              <span className="text-blush-500">{percent}%</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-white p-0.5 ring-1 ring-blush-100" role="progressbar"
              aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="Kemajuan sasaran harian">
              <div className="h-full rounded-full bg-gradient-to-r from-blush-300 via-blush-400 to-lilac-300 transition-[width] duration-500"
                style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-2 text-center text-sm font-medium text-plum-soft">
              {done ? 'Masya-Allah! Sasaran hari ini tercapai 🌸' : `Lagi ${remaining} zikir untuk capai sasaran`}
            </p>
          </div>
        </section>

        {/* 8. Butang menu */}
        <MenuButtons onSelect={(label) => setToast(`Halaman ${label} akan datang tidak lama lagi 🌷`)} />

        <p className="text-center text-xs text-plum-soft">“Ketahuilah, dengan mengingati Allah hati menjadi tenang.” — Surah Ar-Ra‘d: 28</p>
      </main>

      {toast && (
        <div role="status" className="animate-toast fixed inset-x-5 bottom-6 z-10 mx-auto max-w-sm rounded-2xl bg-plum px-4 py-3 text-center text-sm font-medium text-white shadow-soft">
          {toast}
        </div>
      )}
    </div>
  )
}
