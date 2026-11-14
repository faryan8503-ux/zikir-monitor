import { AYAH_END_INFO, TAJWID_GROUPS, TAJWID_RULES, WAQAF, WAQAF_COLOR } from '../quran/tajwid'

export { default as RuleDetail } from './RuleDetail'

// Panduan semua warna tajwid dan tanda waqaf
export function TajwidGuide({ onClose }) {
  return (
    <div>
      <h3 className="text-center font-display text-2xl italic text-plum">Panduan Tajwid & Waqaf</h3>
      <p className="mt-1 text-center text-xs text-plum-soft">Tekan huruf berwarna atau tanda waqaf dalam ayat untuk penerangan.</p>

      {TAJWID_GROUPS.map((g) => (
        <section key={g.title} className="mt-5">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-blush-400">{g.title}</h4>
          <ul className="flex flex-col gap-2">
            {g.codes.map((c) => (
              <li key={c} className="flex gap-3 rounded-2xl bg-blush-50 p-3">
                <span className="mt-1 size-4 shrink-0 rounded-full" style={{ background: TAJWID_RULES[c].color }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: TAJWID_RULES[c].color }}>{TAJWID_RULES[c].name}</p>
                  <p className="text-xs leading-relaxed text-plum">{TAJWID_RULES[c].info}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="mt-5">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-blush-400">Tanda Berhenti (Waqaf)</h4>
        <ul className="flex flex-col gap-2">
          {[...Object.entries(WAQAF), ['end', AYAH_END_INFO]].map(([k, w]) => (
            <li key={k} className="flex gap-3 rounded-2xl bg-lilac-100/60 p-3">
              <span className="grid h-10 min-w-10 shrink-0 place-items-center rounded-xl bg-white px-1 font-quran text-lg" style={{ color: WAQAF_COLOR }} lang="ar" dir="rtl">{w.symbol}</span>
              <div>
                <p className="text-sm font-bold text-plum">{w.name} · <span style={{ color: WAQAF_COLOR }}>{w.action}</span></p>
                <p className="text-xs leading-relaxed text-plum">{w.info}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-4 text-center text-[11px] text-plum-soft">Warna tajwid: data Al-Quran Cloud (alquran.cloud). Sila rujuk guru untuk bacaan yang tepat.</p>
      <button type="button" onClick={onClose} className="mt-4 w-full rounded-2xl bg-gradient-to-br from-blush-400 to-blush-500 py-3 text-sm font-bold text-white shadow-glow active:scale-95">Tutup</button>
    </div>
  )
}
