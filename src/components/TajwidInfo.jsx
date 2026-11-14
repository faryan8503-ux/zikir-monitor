import { AYAH_END_INFO, TAJWID_GROUPS, TAJWID_RULES, WAQAF, WAQAF_COLOR } from '../quran/tajwid'

// Penerangan satu hukum tajwid atau tanda waqaf
export function RuleDetail({ item, onClose, onGuide }) {
  if (!item) return null
  const isWaqaf = item.type === 'waqaf'
  const rule = isWaqaf ? WAQAF[item.key] : TAJWID_RULES[item.key]
  const color = isWaqaf ? WAQAF_COLOR : rule.color
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl font-quran text-2xl" style={{ background: `${color}1f`, color }} lang="ar" dir="rtl">
          {isWaqaf ? rule.symbol : (item.sample || '●')}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color }}>{isWaqaf ? 'Tanda Waqaf' : 'Hukum Tajwid'}</p>
          <h3 className="text-lg font-bold text-plum">{rule.name}</h3>
        </div>
      </div>
      {isWaqaf && <p className="mt-3 inline-block rounded-full px-3 py-1 text-sm font-bold" style={{ background: `${color}1f`, color }}>{rule.action}</p>}
      <p className="mt-3 text-[15px] leading-relaxed text-plum">{rule.info}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button type="button" onClick={onGuide} className="rounded-2xl bg-white py-3 text-sm font-bold text-plum ring-1 ring-blush-200 active:scale-95">📘 Panduan penuh</button>
        <button type="button" onClick={onClose} className="rounded-2xl bg-gradient-to-br from-blush-400 to-blush-500 py-3 text-sm font-bold text-white shadow-glow active:scale-95">Faham 👍</button>
      </div>
    </div>
  )
}

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
