import { TAJWID_RULES, WAQAF, WAQAF_COLOR } from '../quran/tajwid'

// Pecahkan teks ayat kepada bahagian: teks biasa, teks berhukum tajwid, dan tanda waqaf
export function buildPieces(text, spans, showTajwid) {
  const rules = new Array(text.length).fill(null)
  if (showTajwid && spans) {
    for (const [s, e, r] of spans) for (let i = s; i < e && i < text.length; i++) rules[i] = r
  }
  const pieces = []
  let i = 0
  while (i < text.length) {
    if (WAQAF[text[i]]) {
      pieces.push({ waqaf: text[i] })
      i++
      continue
    }
    const r = rules[i]
    let j = i
    while (j < text.length && rules[j] === r && !WAQAF[text[j]]) j++
    pieces.push({ text: text.slice(i, j), rule: r })
    i = j
  }
  return pieces
}

// Senarai hukum & waqaf yang ada dalam satu ayat (untuk cip info di bawah ayat)
export function rulesInAyah(text, spans) {
  const codes = new Set((spans || []).map((s) => s[2]))
  const waqaf = [...new Set([...text].filter((c) => WAQAF[c]))]
  return { codes, waqaf }
}

export default function AyahText({ text, spans, showTajwid, onRule, onWaqaf }) {
  const pieces = buildPieces(text, spans, showTajwid)
  return pieces.map((p, k) => {
    if (p.waqaf) {
      return (
        <span key={k} role="button" tabIndex={0} onClick={() => onWaqaf(p.waqaf)} style={{ color: WAQAF_COLOR }} className="cursor-pointer">
          {p.waqaf}
        </span>
      )
    }
    if (p.rule && TAJWID_RULES[p.rule]) {
      return (
        <span key={k} role="button" tabIndex={0} onClick={() => onRule(p.rule, p.text)} style={{ color: TAJWID_RULES[p.rule].color }} className="cursor-pointer">
          {p.text}
        </span>
      )
    }
    return p.text
  })
}
