// Sebut nama dengan suara telefon (Arab jika ada, jika tidak, rumi dalam Bahasa Melayu)
function voices() {
  try {
    return window.speechSynthesis?.getVoices() ?? []
  } catch {
    return []
  }
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', () => window.speechSynthesis.getVoices())
}

export const canSpeak = typeof window !== 'undefined' && !!window.speechSynthesis

export function speakName(item, { rate = 0.8, onEnd } = {}) {
  if (!canSpeak) {
    onEnd?.()
    return
  }
  try {
    const synth = window.speechSynthesis
    synth.cancel()
    const arabic = voices().find((v) => v.lang?.toLowerCase().startsWith('ar'))
    const u = new SpeechSynthesisUtterance(arabic ? item.ar : item.rumi)
    if (arabic) u.voice = arabic
    u.lang = arabic ? arabic.lang : 'ms-MY'
    u.rate = rate
    let done = false
    const finish = () => {
      if (done) return
      done = true
      onEnd?.()
    }
    u.onend = finish
    u.onerror = finish
    // Jaga-jaga jika telefon tidak menghantar 'onend'
    setTimeout(finish, 6000)
    synth.speak(u)
  } catch {
    onEnd?.()
  }
}

export function stopSpeaking() {
  try {
    window.speechSynthesis?.cancel()
  } catch {
    // abaikan
  }
}
