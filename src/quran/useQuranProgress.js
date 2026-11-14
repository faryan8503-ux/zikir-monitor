import { useCallback, useEffect, useState } from 'react'
import { TOTAL_AYAT, ayatIndex } from './quranUtils'

// Kemajuan bacaan disimpan dalam pelayar telefon (bukan pangkalan data)
const KEY = 'zikir-monitor:quran'

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (saved) return { bookmark: null, khatam: 0, log: {}, ...saved }
  } catch {
    // abaikan
  }
  return { bookmark: null, khatam: 0, log: {} }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // abaikan
  }
}

export function useQuranProgress() {
  const [state, setState] = useState(load)

  // Kemas kini jika halaman lain mengubah kemajuan
  useEffect(() => {
    const onStorage = (e) => e.key === KEY && setState(load())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const readIndex = state.bookmark ? ayatIndex(state.bookmark.s, state.bookmark.a) : 0
  const percent = Math.floor((readIndex / TOTAL_AYAT) * 1000) / 10
  const today = state.log[todayKey()] ?? 0

  // Tanda "saya baca sampai ayat ini". Pulangkan true jika khatam.
  const markRead = (s, a) => {
    const newIdx = ayatIndex(s, a)
    const gained = Math.max(0, newIdx - readIndex)
    const log = { ...state.log }
    if (gained) log[todayKey()] = (log[todayKey()] ?? 0) + gained
    const finished = newIdx === TOTAL_AYAT
    const next = finished
      ? { ...state, bookmark: null, khatam: state.khatam + 1, log }
      : { ...state, bookmark: { s, a }, log }
    save(next)
    setState(next)
    return finished
  }

  const resetProgress = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, bookmark: null }
      save(next)
      return next
    })
  }, [])

  return { ...state, readIndex, percent, today, markRead, resetProgress }
}
