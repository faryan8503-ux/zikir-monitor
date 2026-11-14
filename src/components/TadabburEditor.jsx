import { useState } from 'react'
import { surahInfo, toArabicNumber } from '../quran/quranUtils'
import { PROMPTS, noteKey, useTadabbur } from '../tadabbur/useTadabbur'

const BULAN = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis']
export const formatDate = (t) => {
  const d = new Date(t)
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`
}

// Borang menulis renungan (tadabbur) bagi satu ayat
export default function TadabburEditor({ surah, ayah, arabic, translation, onClose, onSaved }) {
  const { notes, saveNote, deleteNote } = useTadabbur()
  const existing = notes[noteKey(surah, ayah)]
  const [answers, setAnswers] = useState(() => ({ ...(existing?.answers ?? {}) }))
  const changed = PROMPTS.some((p) => (answers[p.id] ?? '') !== (existing?.answers?.[p.id] ?? ''))

  const close = () => {
    if (changed && !window.confirm('Tutup tanpa menyimpan catatan?')) return
    onClose()
  }

  const save = () => {
    const ok = saveNote(surah, ayah, answers)
    if (ok) onSaved(PROMPTS.every((p) => !answers[p.id]?.trim()) ? 'deleted' : 'saved')
    else window.alert('Catatan tidak dapat disimpan. Ruang simpanan telefon mungkin penuh.')
  }

  const remove = () => {
    if (window.confirm('Padam catatan tadabbur untuk ayat ini?')) {
      deleteNote(surah, ayah)
      onSaved('deleted')
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-blush-400">✍️ Tadabbur · {surahInfo(surah).name} {ayah}</p>
      <p className="mt-2 max-h-40 overflow-y-auto rounded-2xl bg-blush-50 px-3 py-2 font-quran text-2xl leading-loose text-plum" lang="ar" dir="rtl">
        {arabic} <span className="text-blush-500">﴿{toArabicNumber(ayah)}﴾</span>
      </p>
      {translation && <p className="mt-2 text-sm leading-relaxed text-plum-soft">{translation}</p>}

      <div className="mt-4 flex flex-col gap-4">
        {PROMPTS.map((p) => (
          <label key={p.id} className="block">
            <span className="text-sm font-bold text-plum">{p.icon} {p.label}</span>
            <textarea value={answers[p.id] ?? ''} rows={3}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [p.id]: e.target.value }))}
              placeholder="Tulis di sini…"
              className="mt-1.5 w-full resize-y rounded-2xl bg-white px-4 py-3 text-base leading-relaxed text-plum outline-none ring-1 ring-blush-200 placeholder:text-plum-soft/60 focus:ring-2 focus:ring-blush-300" />
          </label>
        ))}
      </div>

      {existing && <p className="mt-2 text-[11px] text-plum-soft">Dikemas kini: {formatDate(existing.updatedAt)}</p>}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={close} className="rounded-2xl bg-white py-3 text-sm font-bold text-plum ring-1 ring-blush-200 active:scale-95">Tutup</button>
        <button type="button" onClick={save} disabled={!changed}
          className="rounded-2xl bg-gradient-to-br from-blush-400 to-blush-500 py-3 text-sm font-bold text-white shadow-glow transition active:scale-95 disabled:opacity-50">
          Simpan 💗
        </button>
      </div>
      {existing && (
        <button type="button" onClick={remove} className="mt-3 w-full py-1 text-xs font-semibold text-plum-soft">🗑 Padam catatan</button>
      )}
    </div>
  )
}
