// Main bacaan Al-Quran: audio perkataan (Quran.com) & audio ayat penuh (Mishary Alafasy, everyayah.com)
const pad3 = (n) => String(n).padStart(3, '0')

export const wordAudioUrl = (s, a, w) => `https://audio.qurancdn.com/wbw/${pad3(s)}_${pad3(a)}_${pad3(w)}.mp3`
export const ayahAudioUrl = (s, a) => `https://everyayah.com/data/Alafasy_128kbps/${pad3(s)}${pad3(a)}.mp3`

// Nombor perkataan (bermula 1) dalam teks app bagi aksara pada kedudukan `index`
export function appWordAt(text, index) {
  let n = 1
  for (let i = 0; i < index && i < text.length; i++) if (text[i] === ' ') n++
  return n
}

// Tukar nombor perkataan app kepada nombor perkataan Quran.com (boleh lebih dari satu)
export function qcomWords(text, wm, appWord) {
  const appCount = text.split(' ').length
  const [map, count] = wm ?? [Array.from({ length: appCount }, (_, i) => i + 1), appCount]
  const start = map[appWord - 1]
  const end = appWord < map.length ? Math.max(start, map[appWord] - 1) : count
  const out = []
  for (let w = start; w <= end; w++) out.push(w)
  return out
}

// Julat perkataan penuh yang meliputi [start, end) dalam teks
export function wordBounds(text, start, end) {
  let s = start
  while (s > 0 && text[s - 1] !== ' ') s--
  let e = end
  while (e < text.length && text[e] !== ' ') e++
  return [s, e]
}

// Pemain tunggal: mainkan senarai URL satu demi satu
let audio = null
let listener = null

function emit(state) {
  if (listener) listener(state)
}

export function onPlayerState(fn) {
  listener = fn
}

export function stopAudio() {
  if (audio) {
    audio.onended = null
    audio.onerror = null
    audio.pause()
  }
  emit('idle')
}

export function playUrls(urls, id) {
  stopAudio()
  if (!audio) audio = new Audio()
  let i = 0
  const next = () => {
    if (i >= urls.length) {
      emit('idle')
      return
    }
    audio.src = urls[i++]
    audio.play().catch(() => emit('error'))
  }
  audio.onended = next
  audio.onerror = () => emit('error')
  audio.onplaying = () => emit(`playing:${id}`)
  emit(`loading:${id}`)
  next()
}
