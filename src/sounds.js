// Semua bunyi dihasilkan terus dalam pelayar (tiada fail audio diperlukan)
let ctx = null
let noise = null

function getCtx() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null
  if (!ctx) ctx = new AudioCtx()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function noiseBuffer(c) {
  if (!noise) {
    noise = c.createBuffer(1, Math.floor(c.sampleRate * 0.1), c.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  return noise
}

// Sampul bunyi: naik cepat, kemudian pudar
function envelope(c, t, peak, decay) {
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + 0.002)
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay)
  g.connect(c.destination)
  return g
}

function tone(c, t, { from, to = from, glide = 0.05, peak, decay, type = 'sine' }) {
  const osc = c.createOscillator()
  osc.type = type
  osc.frequency.setValueAtTime(from, t)
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, t + glide)
  osc.connect(envelope(c, t, peak, decay))
  osc.start(t)
  osc.stop(t + decay + 0.02)
}

function click(c, t, { freq, q = 6, peak, decay }) {
  const src = c.createBufferSource()
  src.buffer = noiseBuffer(c)
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = freq
  bp.Q.value = q
  src.connect(bp).connect(envelope(c, t, peak, decay))
  src.start(t)
  src.stop(t + decay + 0.02)
}

const vary = (n, amount = 0.08) => n * (1 + (Math.random() * 2 - 1) * amount)

// 1. Manik tasbih kayu: dua ketukan manik berlaga ("tak-tik")
function tasbih(c, t) {
  const p = vary(1900)
  click(c, t, { freq: p, q: 9, peak: 2.6, decay: 0.035 })
  tone(c, t, { from: p * 0.52, peak: 0.35, decay: 0.05 })
  const t2 = t + vary(0.045, 0.2)
  click(c, t2, { freq: p * 1.15, q: 9, peak: 1.3, decay: 0.03 })
  tone(c, t2, { from: p * 0.6, peak: 0.16, decay: 0.04 })
}

// 2. Titisan air
function air(c, t) {
  const base = vary(580, 0.1)
  tone(c, t, { from: base, to: base * 2.6, glide: 0.07, peak: 0.35, decay: 0.2 })
}

// 3. Pop gelembung
function pop(c, t) {
  const base = vary(320)
  tone(c, t, { from: base, to: base * 3, glide: 0.025, peak: 0.45, decay: 0.07 })
  click(c, t, { freq: 3500, q: 1, peak: 0.12, decay: 0.012 })
}

// 4. Klik lembut ("thock" dalam, macam papan kekunci)
function klik(c, t) {
  tone(c, t, { from: vary(210), to: 120, glide: 0.04, peak: 0.6, decay: 0.08 })
  click(c, t, { freq: 2800, q: 2, peak: 0.25, decay: 0.015 })
}

export const SOUNDS = [
  { id: 'tasbih', label: 'Manik Tasbih', emoji: '📿', play: tasbih },
  { id: 'air', label: 'Titisan Air', emoji: '💧', play: air },
  { id: 'pop', label: 'Pop Gelembung', emoji: '🫧', play: pop },
  { id: 'klik', label: 'Klik Lembut', emoji: '🌸', play: klik },
]

export function playTap(id) {
  try {
    const sound = SOUNDS.find((s) => s.id === id)
    const c = sound && getCtx()
    if (c) sound.play(c, c.currentTime + 0.005)
  } catch {
    // abaikan jika bunyi tidak dapat dimainkan
  }
}

// Loceng lembut + suara "Alhamdulillah" apabila kiraan mencapai 100
function playChime() {
  try {
    const c = getCtx()
    if (!c) return
    const now = c.currentTime
    ;[784, 988, 1319].forEach((freq, i) => {
      const t = now + i * 0.12
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9)
      osc.connect(gain).connect(c.destination)
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
