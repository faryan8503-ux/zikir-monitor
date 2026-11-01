import { useEffect, useState } from 'react'
import { ZIKIR_LIST } from './zikirData'

// Simpanan sementara dalam pelayar (bukan pangkalan data).
// Kiraan akan bermula semula secara automatik setiap hari baru.
const STORAGE_KEY = 'zikir-monitor:today'

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function emptyDay() {
  return { date: todayKey(), counts: {}, zikirIndex: 0 }
}

function loadDay() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved && saved.date === todayKey()) return saved
  } catch {
    // abaikan jika simpanan tidak dapat dibaca
  }
  return emptyDay()
}

export function useZikirCounter() {
  const [day, setDay] = useState(loadDay)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(day))
    } catch {
      // abaikan jika pelayar tidak membenarkan simpanan
    }
  }, [day])

  // Jika hari sudah bertukar (contoh: aplikasi dibuka melepasi tengah malam)
  const current = day.date === todayKey() ? day : emptyDay()

  const zikir = ZIKIR_LIST[current.zikirIndex] ?? ZIKIR_LIST[0]
  const zikirCount = current.counts[zikir.id] ?? 0
  const total = Object.values(current.counts).reduce((a, b) => a + b, 0)

  const increment = () =>
    setDay((prev) => {
      const base = prev.date === todayKey() ? prev : emptyDay()
      const id = ZIKIR_LIST[base.zikirIndex].id
      return { ...base, counts: { ...base.counts, [id]: (base.counts[id] ?? 0) + 1 } }
    })

  const changeZikir = (step) =>
    setDay((prev) => {
      const base = prev.date === todayKey() ? prev : emptyDay()
      const n = ZIKIR_LIST.length
      return { ...base, zikirIndex: (base.zikirIndex + step + n) % n }
    })

  const resetCurrent = () =>
    setDay((prev) => ({ ...prev, counts: { ...prev.counts, [zikir.id]: 0 } }))

  return { zikir, zikirCount, total, counts: current.counts, increment, changeZikir, resetCurrent }
}
