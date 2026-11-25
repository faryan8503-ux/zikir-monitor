import { useCallback, useState } from 'react'
import CounterButton from '../components/CounterButton'
import PageHeader from '../components/PageHeader'
import Toast from '../components/Toast'
import { go } from '../useHashRoute'
import { useZikirCounter } from '../useZikirCounter'
import { REZEKI_LIST } from '../zikirData'
import { playAlhamdulillah, playNote, playTap } from '../sounds'

const SOUND_KEY = 'zikir-monitor:sound'
function soundSetting() {
  try {
    return localStorage.getItem(SOUND_KEY) || 'tasbih'
  } catch {
    return 'tasbih'
  }
}

// Amalan Rezeki Harian: baca setiap amalan mengikut sasaran, satu demi satu
export default function AmalanRezeki() {
  const { counts, incrementFor, resetFor } = useZikirCounter()
  const countOf = (z) => counts[z.id] ?? 0
  const firstUnfinished = REZEKI_LIST.findIndex((z) => countOf(z) < z.target)
  const [active, setActive] = useState(firstUnfinished === -1 ? 0 : firstUnfinished)
  const [toast, setToast] = useState(null)
  const clearToast = useCallback(() => setToast(null), [])

  const item = REZEKI_LIST[active]
  const count = countOf(item)
  const doneCount = REZEKI_LIST.filter((z) => countOf(z) >= z.target).length
  const allDone = doneCount === REZEKI_LIST.length

  const tap = () => {
    const next = count + 1
    const sound = soundSetting()
    incrementFor(item.id)
    if (next === item.target) {
      const finishedAll = REZEKI_LIST.every((z) => (z.id === item.id ? next : countOf(z)) >= z.target)
      if (finishedAll) {
        if (sound !== 'off') playAlhamdulillah()
        setToast('Alhamdulillah! Semua amalan rezeki hari ini selesai 🌸')
      } else {
        if (sound !== 'off') [784, 988, 1319].forEach((f, i) => setTimeout(() => playNote(f, 0.8), i * 120))
        const nextIdx = REZEKI_LIST.findIndex((z, i) => i !== active && countOf(z) < z.target)
        setToast(`✓ ${item.name} selesai (${item.target}x)`)
        if (nextIdx !== -1) setTimeout(() => setActive(nextIdx), 700)
      }
    } else if (sound !== 'off') {
      playTap(sound)
    }
  }

  const reset = () => {
    if (count && window.confirm(`Set semula kiraan "${item.name}" hari ini?`)) resetFor(item.id)
  }

  return (
    <div className="islamic-pattern min-h-dvh">
      <main className="mx-auto max-w-md px-5 pb-10" style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}>
        <PageHeader title="Amalan Rezeki Harian" subtitle={allDone ? 'Selesai hari ini ✓' : `${doneCount} / ${REZEKI_LIST.length} selesai hari ini`} onBack={() => go('/')} />

        {/* Senarai amalan & kemajuan */}
        <ul className="flex flex-col gap-2">
          {REZEKI_LIST.map((z, i) => {
            const c = countOf(z)
            const done = c >= z.target
            return (
              <li key={z.id}>
                <button type="button" onClick={() => setActive(i)} aria-pressed={i === active}
                  className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left shadow-soft ring-1 transition active:scale-[0.98] ${i === active ? 'bg-white ring-2 ring-blush-300' : 'bg-white/80 ring-blush-100'}`}>
                  <span className={`grid size-9 shrink-0 place-items-center rounded-xl text-sm font-bold ${done ? 'bg-blush-400 text-white' : 'bg-blush-50 text-blush-600'}`}>
                    {done ? '✓' : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-plum">{z.latin}</span>
                    <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-blush-50">
                      <span className="block h-full rounded-full bg-gradient-to-r from-lilac-300 to-blush-400 transition-[width]" style={{ width: `${Math.min(100, (c / z.target) * 100)}%` }} />
                    </span>
                  </span>
                  <span className={`text-sm font-bold tabular-nums ${done ? 'text-blush-500' : 'text-plum-soft'}`}>{Math.min(c, 999)}/{z.target}</span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* Amalan semasa */}
        <section className="mt-4 rounded-[2rem] bg-white/90 p-5 text-center shadow-soft ring-1 ring-blush-100">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blush-400">Amalan {active + 1} · {item.target} kali</p>
          <p className="mt-2 font-quran text-[26px] leading-loose text-blush-600" lang="ar" dir="rtl">{item.arabic}</p>
          <p className="mt-1 text-base font-bold italic text-plum">{item.latin}</p>
          <p className="mt-1 text-xs leading-relaxed text-plum-soft">{item.meaning}</p>

          <div className="mt-4">
            <CounterButton count={count} progress={count / item.target} onTap={tap} />
          </div>
          <p className="mt-2 text-sm font-semibold text-plum-soft">
            {count >= item.target ? `Selesai ✓ (${count}x) — boleh teruskan jika mahu` : `Lagi ${item.target - count} kali`}
          </p>
          <button type="button" onClick={reset} disabled={!count}
            className="mt-2 rounded-full px-4 py-1.5 text-xs font-semibold text-plum-soft ring-1 ring-blush-200 disabled:opacity-40">
            ↺ Set semula
          </button>
        </section>

        {allDone && (
          <p className="mt-4 rounded-3xl bg-gradient-to-br from-blush-100 to-lilac-100 p-4 text-center text-sm font-bold text-plum">
            🌸 Alhamdulillah, amalan hari ini selesai. Semoga Allah murahkan rezeki dan bukakan pintu kebaikan.
          </p>
        )}

        <p className="mt-5 text-center text-[11px] leading-relaxed text-plum-soft">
          Bilangan ini ialah amalan yang popular, bukan bilangan khusus daripada hadis. Kiraan bermula semula setiap hari
          dan turut dikira dalam jumlah zikir hari ini.
        </p>
      </main>
      <Toast message={toast} onDone={clearToast} />
    </div>
  )
}
