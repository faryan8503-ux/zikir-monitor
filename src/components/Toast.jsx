import { useEffect } from 'react'

// Mesej kecil yang hilang sendiri selepas beberapa saat
export default function Toast({ message, onDone, duration = 2200 }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDone, duration)
    return () => clearTimeout(t)
  }, [message, onDone, duration])

  if (!message) return null
  return (
    <div role="status" className="animate-toast fixed inset-x-5 bottom-6 z-30 mx-auto max-w-sm rounded-2xl bg-plum px-4 py-3 text-center text-sm font-medium text-white shadow-soft">
      {message}
    </div>
  )
}
