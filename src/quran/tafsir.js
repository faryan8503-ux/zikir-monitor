// Tafsir Ringkas Kementerian Agama RI (Bahasa Indonesia), dimuat bila diperlukan
const cache = new Map()

export function loadTafsir(n) {
  if (!cache.has(n)) {
    const p = fetch(`${import.meta.env.BASE_URL}tafsir/${n}.json`).then((r) => {
      if (!r.ok) throw new Error('gagal')
      return r.json()
    })
    p.catch(() => cache.delete(n))
    cache.set(n, p)
  }
  return cache.get(n)
}

export const TAFSIR_SOURCE = 'Tafsir Ringkas, Kementerian Agama Republik Indonesia'
