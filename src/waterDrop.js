// Bunyi titisan air yang dihasilkan terus dalam pelayar (tiada fail audio diperlukan)
let ctx = null

export function playWaterDrop() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    if (!ctx) ctx = new AudioCtx()
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime
    // Sedikit variasi nada supaya setiap titisan terasa semula jadi
    const base = 520 + Math.random() * 120

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(base, now)
    osc.frequency.exponentialRampToValueAtTime(base * 2.6, now + 0.07)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)

    osc.connect(gain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.22)
  } catch {
    // abaikan jika bunyi tidak dapat dimainkan
  }
}

// Loceng lembut + suara "Alhamdulillah" apabila kiraan mencapai 100
function playChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    if (!ctx) ctx = new AudioCtx()
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime
    ;[784, 988, 1319].forEach((freq, i) => {
      const t = now + i * 0.12
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.95)
    })
  } catch {
    // abaikan
  }
}

export function playAlhamdulillah() {
  playChime()
  try {
    const synth = window.speechSynthesis
    if (!synth) return
    synth.cancel()
    const voices = synth.getVoices()
    const arabic = voices.find((v) => v.lang?.toLowerCase().startsWith('ar'))
    const say = new SpeechSynthesisUtterance(arabic ? 'الحمد لله' : 'Alhamdulillah')
    if (arabic) say.voice = arabic
    say.lang = arabic ? arabic.lang : 'ms-MY'
    say.rate = 0.85
    say.pitch = 1.05
    synth.speak(say)
  } catch {
    // abaikan jika suara tidak disokong
  }
}

// Muatkan senarai suara awal-awal (sesetengah pelayar memuatkannya lambat)
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', () => window.speechSynthesis.getVoices())
}
