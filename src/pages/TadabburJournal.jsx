import { useCallback, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Toast from '../components/Toast'
import { formatDate } from '../components/TadabburEditor'
import { go } from '../useHashRoute'
import { surahInfo } from '../quran/quranUtils'
import { PROMPTS, useTadabbur } from '../tadabbur/useTadabbur'

// Senarai semua catatan tadabbur
export default function TadabburJournal() {
  const { list } = useTadabbur()
  const [toast, setToast] = useState(null)
  const clearToast = useCallback(() => setToast(null), [])

  // Salinan teks semua catatan (untuk disimpan di Nota / WhatsApp sebagai sandaran)
  const exportText = () =>
    [...list]
      .sort((x, y) => x.s - y.s || x.a - y.a)
      .map((n) => {
        const lines = [`${surahInfo(n.s).name} ${n.a} (${formatDate(n.updatedAt)})`]
        for (const p of PROMPTS) if (n.answers[p.id]?.trim()) lines.push(`${p.icon} ${p.label}\n${n.answers[p.id].trim()}`)
        return lines.join('\n')
      })
      .join('\n\n— — —\n\n')

  const share = async () => {
    const text = `Jurnal Tadabbur — Zikir Monitor\n\n${exportText()}`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Jurnal Tadabbur', text })
        return
      }
      await navigator.clipboard.writeText(text)
      setToast('Semua catatan disalin 📋')
    } catch {
      // pengguna membatalkan perkongsian
    }
  }

  return (
    <div className="islamic-pattern min-h-dvh">
      <main className="mx-auto max-w-md px-5 pb-10" style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}>
        <PageHeader title="Jurnal Tadabbur" subtitle={`${list.length} catatan renungan`} onBack={() => go('/quran')} />

        {list.length === 0 ? (
          <section className="rounded-[2rem] bg-white/90 p-6 text-center shadow-soft ring-1 ring-blush-100">
            <p className="text-4xl">📖✍️</p>
            <p className="mt-3 font-bold text-plum">Belum ada catatan</p>
            <p className="mt-1 text-sm leading-relaxed text-plum-soft">
              Semasa membaca Al-Quran, tekan butang <b>✍️ Tadabbur</b> pada mana-mana ayat untuk menulis renungan anda.
            </p>
            <button type="button" onClick={() => go('/quran')}
              className="mt-4 rounded-2xl bg-gradient-to-br from-blush-400 to-blush-500 px-5 py-3 text-sm font-bold text-white shadow-glow active:scale-95">
              Pergi ke Al-Quran
            </button>
          </section>
        ) : (
          <>
            <ul className="flex flex-col gap-3">
              {list.map((n) => {
                const first = PROMPTS.find((p) => n.answers[p.id]?.trim())
                return (
                  <li key={`${n.s}:${n.a}`}>
                    <button type="button" onClick={() => go(`/quran/${n.s}?ayat=${n.a}&tadabbur=1`)}
                      className="w-full rounded-3xl bg-white/90 p-4 text-left shadow-soft ring-1 ring-blush-100 transition active:scale-[0.98]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-plum">{surahInfo(n.s).name}, ayat {n.a}</span>
                        <span className="text-[11px] text-plum-soft">{formatDate(n.updatedAt)}</span>
                      </div>
                      {first && (
                        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-plum-soft">
                          {first.icon} {n.answers[first.id].trim()}
                        </p>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
            <button type="button" onClick={share}
              className="mt-5 w-full rounded-2xl bg-white py-3 text-sm font-bold text-plum shadow-soft ring-1 ring-blush-200 active:scale-95">
              📤 Simpan salinan / Kongsi semua catatan
            </button>
            <p className="mt-2 text-center text-[11px] leading-relaxed text-plum-soft">
              Catatan disimpan dalam telefon ini sahaja. Simpan salinan sekali-sekala (contohnya ke app Nota) supaya tidak hilang.
            </p>
          </>
        )}
      </main>
      <Toast message={toast} onDone={clearToast} />
    </div>
  )
}
