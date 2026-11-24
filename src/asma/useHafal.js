import { useEffect, useState } from 'react'

// Senarai nama yang sudah dihafal (disimpan dalam telefon)
const KEY = 'zikir-monitor:asma-hafal'
const EVENT = 'zikir-monitor:asma-changed'

function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY)) || [])
  } catch {
    return new Set()
  }
}

export function useHafal() {
  const [hafal, setHafal] = useState(load)
  useEffect(() => {
    const refresh = () => setHafal(load())
    window.addEventListener(EVENT, refresh)
    return () => window.removeEventListener(EVENT, refresh)
  }, [])

  const setOne = (n, value) => {
    const next = load()
    if (value) next.add(n)
    else next.delete(n)
    try {
      localStorage.setItem(KEY, JSON.stringify([...next]))
    } catch {
      // abaikan
    }
    setHafal(next)
    window.dispatchEvent(new Event(EVENT))
  }

  return { hafal, setOne }
}
