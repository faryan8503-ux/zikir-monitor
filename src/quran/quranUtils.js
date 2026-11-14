import { JUZ_STARTS, SURAHS } from './surahs'

export const TOTAL_AYAT = 6236

// Bilangan ayat sebelum setiap surah (untuk mengira kedudukan dalam keseluruhan Al-Quran)
const OFFSETS = []
let sum = 0
for (const s of SURAHS) {
  OFFSETS[s.n] = sum
  sum += s.ayat
}

// Kedudukan ayat dalam keseluruhan Al-Quran: 1 hingga 6236
export function ayatIndex(surah, ayat) {
  return OFFSETS[surah] + ayat
}

export function surahInfo(n) {
  return SURAHS[n - 1]
}

export function surahEndIndex(n) {
  return OFFSETS[n] + SURAHS[n - 1].ayat
}

export function juzOf(surah, ayat) {
  const idx = ayatIndex(surah, ayat)
  let juz = 1
  JUZ_STARTS.forEach(([s, a], i) => {
    if (ayatIndex(s, a) <= idx) juz = i + 1
  })
  return juz
}

// Ayat seterusnya selepas tanda bacaan
export function nextAyat(bookmark) {
  if (!bookmark) return { s: 1, a: 1 }
  const info = surahInfo(bookmark.s)
  if (bookmark.a < info.ayat) return { s: bookmark.s, a: bookmark.a + 1 }
  if (bookmark.s < 114) return { s: bookmark.s + 1, a: 1 }
  return { s: 1, a: 1 }
}

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'
export function toArabicNumber(n) {
  return String(n).replace(/\d/g, (d) => ARABIC_DIGITS[d])
}

export async function loadSurah(n) {
  const res = await fetch(`${import.meta.env.BASE_URL}quran/${n}.json`)
  if (!res.ok) throw new Error('gagal')
  return res.json()
}
