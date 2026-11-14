import { useCallback, useEffect, useState } from 'react'

// Catatan tadabbur disimpan dalam pelayar telefon (bukan pangkalan data)
const KEY = 'zikir-monitor:tadabbur'
const EVENT = 'zikir-monitor:tadabbur-changed'

export const PROMPTS = [
  { id: 'pengajaran', icon: '💡', label: 'Apa pengajaran atau mesej ayat ini untuk saya?' },
  { id: 'amalan', icon: '🌱', label: 'Apa yang saya boleh amalkan hari ini?' },
  { id: 'doa', icon: '🤲', label: 'Doa atau perasaan saya' },
]

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

export const noteKey = (s, a) => `${s}:${a}`

export function useTadabbur() {
  const [notes, setNotes] = useState(load)

  useEffect(() => {
    const refresh = () => setNotes(load())
    window.addEventListener(EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const write = (next) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      return false
    }
    setNotes(next)
    window.dispatchEvent(new Event(EVENT))
    return true
  }

  const saveNote = useCallback((s, a, answers) => {
    const current = load()
    const k = noteKey(s, a)
    const now = Date.now()
    const isEmpty = PROMPTS.every((p) => !answers[p.id]?.trim())
    if (isEmpty) {
      delete current[k]
    } else {
      current[k] = { s, a, answers, createdAt: current[k]?.createdAt ?? now, updatedAt: now }
    }
    return write(current)
  }, [])

  const deleteNote = useCallback((s, a) => {
    const current = load()
    delete current[noteKey(s, a)]
    return write(current)
  }, [])

  const list = Object.values(notes).sort((x, y) => y.updatedAt - x.updatedAt)
  return { notes, list, saveNote, deleteNote }
}
