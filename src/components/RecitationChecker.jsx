import { useEffect, useRef, useState } from 'react'
import { surahInfo, toArabicNumber } from '../quran/quranUtils'
import { checkRecitation } from '../quran/recitationCheck'
import { ayahAudioUrl, onPlayerState, playUrls, qcomWords, stopAudio, wordAudioUrl } from '../quran/recitation'
import { Recognition } from '../voiceCounter'

const ERRORS = {
  'not-allowed': 'Akses mikrofon tidak dibenarkan. Benarkan mikrofon untuk Safari dalam Tetapan iPhone, kemudian cuba lagi.',
  'service-not-allowed': 'Pengecaman suara tidak dibenarkan di sini. Cuba buka app dalam Safari (bukan dari ikon skrin utama).',
  'audio-capture': 'Mikrofon tidak dapat digunakan. Cuba matikan "Rakam suara saya" dan cuba lagi.',
  network: 'Semakan bacaan perlukan internet.',
}

// Semak bacaan satu ayat: dengar bacaan, tanda perkataan betul/salah, dan rakam suara
export default function RecitationChecker({ surah, ayah, text, wm, onNext, onClose }) {
  const [phase, setPhase] = useState('idle') // idle | listening | done
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const [record, setRecord] = useState(true)
  const [recordingUrl, setRecordingUrl] = useState(null)
  const [picked, setPicked] = useState(null)
  const [player, setPlayer] = useState('idle')

  const recRef = useRef(null)
  const wantRef = useRef(false)
  const baseRef = useRef('') // transkrip dari sesi pengecaman sebelumnya
  const transcriptRef = useRef('')
  const mediaRef = useRef(null)
  const chunksRef = useRef([])
  const myAudio = useRef(null)

  useEffect(() => {
    onPlayerState(setPlayer)
    return () => {
      wantRef.current = false
      try {
        recRef.current?.abort()
      } catch {
        // abaikan
      }
      stopRecorder()
      stopAudio()
      myAudio.current?.pause()
      onPlayerState(null)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => recordingUrl && URL.revokeObjectURL(recordingUrl), [recordingUrl])

  const result = checkRecitation(text, transcript, phase === 'done')

  function stopRecorder() {
    const media = mediaRef.current
    if (media && media.state !== 'inactive') media.stop()
    media?.stream?.getTracks().forEach((t) => t.stop())
  }

  const startRecognition = () => {
    const rec = new Recognition()
    rec.lang = 'ar-SA'
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (e) => {
      let session = ''
      for (let i = 0; i < e.results.length; i++) session += `${e.results[i][0].transcript} `
      transcriptRef.current = `${baseRef.current} ${session}`.trim()
      setTranscript(transcriptRef.current)
    }
    rec.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return
      wantRef.current = false
      setError(ERRORS[e.error] ?? 'Pengecaman suara terhenti. Cuba lagi.')
    }
    rec.onend = () => {
      if (wantRef.current) {
        // Telefon berhenti selepas senyap seketika: simpan apa yang didengar & sambung
        baseRef.current = transcriptRef.current
        try {
          startRecognition()
          return
        } catch {
          wantRef.current = false
        }
      }
      finish()
    }
    recRef.current = rec
    rec.start()
  }

  const start = async () => {
    if (!Recognition) return
    setError(null)
    setPicked(null)
    setTranscript('')
    baseRef.current = ''
    transcriptRef.current = ''
    if (recordingUrl) URL.revokeObjectURL(recordingUrl)
    setRecordingUrl(null)
    stopAudio()
    wantRef.current = true
    try {
      startRecognition()
      setPhase('listening')
    } catch {
      wantRef.current = false
      setError('Pengecaman suara tidak dapat dimulakan.')
      return
    }
    if (record && navigator.mediaDevices?.getUserMedia && window.MediaRecorder) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const media = new MediaRecorder(stream)
        chunksRef.current = []
        media.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data)
        media.onstop = () => {
          if (chunksRef.current.length) {
            setRecordingUrl(URL.createObjectURL(new Blob(chunksRef.current, { type: media.mimeType || 'audio/mp4' })))
          }
        }
        media.start()
        mediaRef.current = media
      } catch {
        // rakaman tidak tersedia; semakan tetap diteruskan
      }
    }
  }

  function finish() {
    wantRef.current = false
    stopRecorder()
    setPhase('done')
  }

  const stop = () => {
    wantRef.current = false
    try {
      recRef.current?.stop()
    } catch {
      finish()
    }
    // Sesetengah pelayar tidak menghantar 'onend' selepas stop
    setTimeout(() => setPhase((p) => (p === 'listening' ? (finish(), 'done') : p)), 1500)
  }

  const playMine = () => {
    stopAudio()
    if (!myAudio.current) myAudio.current = new Audio()
    myAudio.current.src = recordingUrl
    myAudio.current.play().catch(() => {})
  }

  const wrong = result.words.filter((w) => w.status === 'salah').length
  const pickedWord = picked != null ? result.words[picked] : null

  if (!Recognition) {
    return (
      <div className="text-center">
        <p className="text-sm text-plum">🎙️ Semakan bacaan tidak disokong oleh pelayar ini. Cuba buka app dalam Safari atau Chrome terkini.</p>
        <button type="button" onClick={onClose} className="mt-4 w-full rounded-2xl bg-blush-400 py-3 text-sm font-bold text-white">Tutup</button>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-blush-400">🎙️ Semak Bacaan · {surahInfo(surah).name} {ayah}</p>
      <p className="mt-1 text-xs text-plum-soft">
        {phase === 'idle' && 'Tekan Mula, baca ayat ini dengan jelas, kemudian tekan Selesai.'}
        {phase === 'listening' && 'Sedang mendengar… perkataan bertukar hijau bila dibaca dengan betul.'}
        {phase === 'done' && (wrong ? 'Tekan perkataan merah untuk lihat & dengar bacaan yang betul.' : '')}
      </p>

      {/* Ayat: setiap perkataan diwarnakan mengikut keputusan */}
      <p className="mt-3 max-h-64 overflow-y-auto rounded-2xl bg-blush-50 px-3 py-2 font-quran text-[26px] leading-[2.2]" lang="ar" dir="rtl">
        {result.words.map((w, i) => (
          <span key={i}>
            <span role={w.status === 'salah' ? 'button' : undefined} tabIndex={w.status === 'salah' ? 0 : undefined}
              onClick={() => w.status === 'salah' && setPicked(i)}
              className={`rounded-md px-0.5 transition-colors ${
                w.status === 'betul' ? 'text-green-700' : w.status === 'salah' ? `cursor-pointer bg-red-100 text-red-600 underline decoration-red-400 decoration-wavy ${picked === i ? 'ring-2 ring-red-300' : ''}` : 'text-plum'
              }`}>
              {w.text}
            </span>{' '}
          </span>
        ))}
        <span className="text-blush-500">﴿{toArabicNumber(ayah)}﴾</span>
      </p>

      {phase === 'listening' && (
        <p className="mt-2 truncate text-center text-xs text-plum-soft" aria-live="polite">Didengar: {transcript || '…'}</p>
      )}

      {phase === 'done' && (
        <div className={`mt-3 rounded-2xl p-3 text-center text-sm font-bold ${wrong ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
          {wrong
            ? `${result.correct} / ${result.total} perkataan betul · ${wrong} perlu dibetulkan`
            : `MasyaAllah! Semua ${result.total} perkataan dibaca dengan betul 🌸`}
        </div>
      )}

      {/* Pembetulan bagi perkataan yang dipilih */}
      {pickedWord && (
        <div className="mt-3 rounded-2xl bg-white p-3 ring-1 ring-red-200">
          <p className="text-xs font-semibold text-red-500">Perkataan ke-{picked + 1} · sepatutnya dibaca:</p>
          <p className="mt-1 text-center font-quran text-4xl leading-loose text-plum" lang="ar" dir="rtl">{pickedWord.text}</p>
          <button type="button"
            onClick={() => playUrls(qcomWords(text, wm, picked + 1).map((w) => wordAudioUrl(surah, ayah, w)), 'word')}
            className="w-full rounded-2xl bg-gradient-to-br from-blush-400 to-blush-500 py-2.5 text-sm font-bold text-white shadow-glow active:scale-95">
            {player === 'loading:word' ? '⏳ Memuatkan' : player === 'playing:word' ? '🔊 Sedang dimainkan' : '▶ Dengar sebutan yang betul'}
          </button>
        </div>
      )}

      {error && <p role="alert" className="mt-3 text-center text-xs font-semibold text-blush-600">{error}</p>}
      {player === 'error' && <p className="mt-2 text-center text-xs font-semibold text-blush-600">Audio tidak dapat dimainkan. Semak internet.</p>}

      <div className="mt-4 grid grid-cols-2 gap-2">
        {phase === 'listening' ? (
          <button type="button" onClick={stop} className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-blush-500 py-3 text-sm font-bold text-white shadow-glow active:scale-95">
            <span className="size-2.5 animate-ping rounded-full bg-white" /> Selesai
          </button>
        ) : (
          <button type="button" onClick={start} className="col-span-2 rounded-2xl bg-gradient-to-br from-blush-400 to-blush-500 py-3 text-sm font-bold text-white shadow-glow active:scale-95">
            🎙️ {phase === 'done' ? 'Cuba lagi' : 'Mula membaca'}
          </button>
        )}
        {phase === 'done' && recordingUrl && (
          <button type="button" onClick={playMine} className="rounded-2xl bg-lilac-100 py-2.5 text-sm font-bold text-lilac-500 active:scale-95">▶ Rakaman saya</button>
        )}
        {phase !== 'listening' && (
          <button type="button" onClick={() => playUrls([ayahAudioUrl(surah, ayah)], 'qari')}
            className={`rounded-2xl bg-white py-2.5 text-sm font-bold text-plum ring-1 ring-blush-200 active:scale-95 ${phase === 'done' && recordingUrl ? '' : 'col-span-2'}`}>
            {player === 'playing:qari' ? '🔊 Qari…' : '▶ Bacaan qari'}
          </button>
        )}
      </div>

      {phase === 'idle' && (
        <label className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-plum-soft">
          <input type="checkbox" checked={record} onChange={(e) => setRecord(e.target.checked)} className="size-4 accent-pink-500" />
          Rakam suara saya (untuk didengar semula)
        </label>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" onClick={onClose} disabled={phase === 'listening'} className="rounded-2xl bg-white py-2.5 text-sm font-bold text-plum ring-1 ring-blush-200 disabled:opacity-40">Tutup</button>
        <button type="button" onClick={onNext} disabled={phase === 'listening' || !onNext} className="rounded-2xl bg-white py-2.5 text-sm font-bold text-plum ring-1 ring-blush-200 disabled:opacity-40">Ayat seterusnya ›</button>
      </div>
      <p className="mt-3 text-center text-[11px] leading-snug text-plum-soft">
        Semakan ini hanya menyemak perkataan (salah, tertukar atau tertinggal), bukan tajwid atau baris. Rujuk guru untuk bacaan yang tepat.
      </p>
    </div>
  )
}
