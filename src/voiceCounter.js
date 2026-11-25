import { useCallback, useEffect, useRef, useState } from 'react'

// Kira zikir dengan suara menggunakan pengecaman suara pelayar (Web Speech API).

// Buang baris (harakat) & seragamkan huruf supaya mudah dipadankan
export function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[ً-ٰٟۖ-ۭـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
}

// Perkataan kunci bagi setiap zikir (Arab & rumi), dikira sekali bagi setiap sebutan
const PATTERNS = {
  subhanallah: [/سبحان/g, /su?b+h?an/g],
  alhamdulillah: [/الحمد/g, /hamdu/g],
  allahuakbar: [/اكبر/g, /akbar/g],
  lailahaillallah: [/الا ?الله/g, /il+all?ah?/g],
  astaghfirullah: [/استغفر/g, /st[ao]g?h?fir/g],
  hasbunallah: [/حسبنا/g, /hasbun/g],
  selawatjibril: [/محمد/g, /m[ou]hamm?[ae]d/g],
  wamaramaita: [/لكن ?الله/g, /laki?nn?al+ah/g],
  rabbiinni: [/فقير/g, /faq[ie]+[rl]/g],
  innafatahna: [/مبين/g, /mubi+na?/g],
  yarazzaq: [/فتاح/g, /fatt?a+h/g],
}

// Bilangan sebutan zikir dalam satu transkrip
export function countZikir(zikirId, transcript) {
  const text = normalize(transcript)
  const patterns = PATTERNS[zikirId] ?? []
  // Ambil kiraan tertinggi antara corak Arab & rumi (transkrip biasanya dalam satu tulisan sahaja)
  return Math.max(0, ...patterns.map((re) => (text.match(re) || []).length))
}

export const Recognition = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined
export const voiceSupported = !!Recognition

const ERRORS = {
  'not-allowed': 'Akses mikrofon tidak dibenarkan. Benarkan mikrofon dalam tetapan Safari, kemudian cuba lagi.',
  'service-not-allowed': 'Pengecaman suara tidak dibenarkan di sini. Cuba buka app dalam Safari (bukan dari ikon skrin utama).',
  'audio-capture': 'Mikrofon tidak dijumpai.',
  network: 'Pengecaman suara perlukan internet.',
  'language-not-supported': 'Bahasa ini tidak disokong oleh telefon anda. Cuba tukar bahasa.',
}

export function useVoiceCounter({ zikirId, lang, onCount }) {
  const [listening, setListening] = useState(false)
  const [error, setError] = useState(null)
  const [heard, setHeard] = useState('')
  const recRef = useRef(null)
  const wantRef = useRef(false)
  const countedRef = useRef([])
  const zikirRef = useRef(zikirId)
  const onCountRef = useRef(onCount)
  const langRef = useRef(lang)
  langRef.current = lang
  zikirRef.current = zikirId
  onCountRef.current = onCount

  // Tukar zikir: mula kiraan baru supaya sebutan lama tidak dikira semula
  useEffect(() => {
    countedRef.current = countedRef.current.map(() => Infinity)
  }, [zikirId])

  const startSession = useCallback(() => {
    const rec = new Recognition()
    rec.lang = langRef.current
    rec.continuous = true
    rec.interimResults = true
    countedRef.current = []
    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript
        const n = countZikir(zikirRef.current, transcript)
        const prev = countedRef.current[i] ?? 0
        if (prev === Infinity) {
          // keputusan dari sebelum zikir ditukar: abaikan
          continue
        }
        if (n > prev) {
          countedRef.current[i] = n
          onCountRef.current(n - prev)
        }
        setHeard(transcript.trim().split(/\s+/).slice(-6).join(' '))
      }
    }
    rec.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return
      wantRef.current = false
      setError(ERRORS[e.error] ?? 'Pengecaman suara terhenti. Cuba lagi.')
    }
    rec.onend = () => {
      // Telefon menghentikan pendengaran selepas senyap seketika: sambung semula
      if (wantRef.current) {
        try {
          startSession()
          return
        } catch {
          wantRef.current = false
        }
      }
      setListening(false)
    }
    recRef.current = rec
    rec.start()
  }, [])

  const start = useCallback(() => {
    if (!Recognition) return
    setError(null)
    setHeard('')
    wantRef.current = true
    try {
      startSession()
      setListening(true)
    } catch {
      wantRef.current = false
      setError('Pengecaman suara tidak dapat dimulakan.')
    }
  }, [startSession])

  const stop = useCallback(() => {
    wantRef.current = false
    try {
      recRef.current?.stop()
    } catch {
      // abaikan
    }
    setListening(false)
  }, [])

  // Hentikan bila keluar dari halaman
  useEffect(() => () => {
    wantRef.current = false
    try {
      recRef.current?.abort()
    } catch {
      // abaikan
    }
  }, [])

  // Tukar bahasa semasa mendengar: mulakan semula
  useEffect(() => {
    if (wantRef.current) {
      try {
        recRef.current?.abort()
      } catch {
        // abaikan
      }
    }
  }, [lang])

  return { supported: voiceSupported, listening, error, heard, start, stop }
}
