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
