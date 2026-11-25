// Semak bacaan pada peringkat perkataan: bandingkan teks ayat dengan apa yang didengar
// oleh pengecaman suara. Tajwid dan baris tidak dapat disemak.

// Rangka huruf: buang baris & tanda, seragamkan huruf, abaikan alif & hamzah
// (ejaan Uthmani dan ejaan biasa banyak berbeza pada huruf-huruf ini)
export function skeleton(text) {
  return text
    .replace(/[ً-ٰٟۖ-ࣰۭ-ࣲـ ‌⁠۞۩]/g, '')
    .replace(/[ٱأإآا]/g, '')
    .replace(/[ءٔ]/g, '')
    .replace(/ى/g, '') // alif maqsurah dibaca seperti alif
    .replace(/[یئ]/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ة/g, 'ه')
    .replace(/ک/g, 'ك')
    .replace(/[^\u0621-\u064A]/g, '')
    .replace(/(.)\1+/g, '$1') // huruf berganda (contoh: الليل / ٱلَّیۡل, شيئا / شَیۡءࣰا)
}

// Penjajaran huruf (Gotoh, jurang afin): utamakan padanan berturutan supaya perkataan
// yang tertinggal tidak "mencuri" huruf daripada perkataan lain.
// Huruf tambahan dalam transkrip (di awal/akhir) tidak didenda.
// Pulangkan kedudukan dalam `a` yang sepadan, dan bilangan huruf tambahan sebelum setiap kedudukan.
const MATCH = 3
const MISMATCH = -2
const OPEN = 4
const EXT = 1
const NEG = -1e9

function align(a, b, live) {
  const n = a.length
  const m = b.length
  const W = m + 1
  const M = new Int32Array((n + 1) * W).fill(NEG)
  const X = new Int32Array((n + 1) * W).fill(NEG) // huruf ayat tidak dibaca
  const Y = new Int32Array((n + 1) * W).fill(NEG) // huruf tambahan dalam transkrip
  const pM = new Uint8Array((n + 1) * W)
  const pX = new Uint8Array((n + 1) * W)
  const pY = new Uint8Array((n + 1) * W)
  M[0] = 0
  for (let j = 1; j <= m; j++) Y[j] = 0 // huruf tambahan di awal: percuma
  for (let i = 1; i <= n; i++) X[i * W] = -(OPEN + (i - 1) * EXT)

  const best3 = (a1, a2, a3) => (a1 >= a2 && a1 >= a3 ? [a1, 0] : a2 >= a3 ? [a2, 1] : [a3, 2])
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const k = i * W + j
      const d = (i - 1) * W + (j - 1)
      const [vm, pm] = best3(M[d], X[d], Y[d])
      M[k] = vm + (a[i - 1] === b[j - 1] ? MATCH : MISMATCH)
      pM[k] = pm
      const u = (i - 1) * W + j
      const [vx, px] = best3(M[u] - OPEN, X[u] - EXT, Y[u] - OPEN)
      X[k] = vx
      pX[k] = px
      const l = i * W + j - 1
      const [vy, py] = best3(M[l] - OPEN, X[l] - OPEN, Y[l] - EXT)
      Y[k] = vy
      pY[k] = py
    }
  }

  // Titik tamat: seluruh ayat (huruf tambahan di hujung transkrip percuma);
  // semasa masih membaca, boleh juga tamat di tengah ayat bila transkrip habis.
  let bestScore = NEG
  let end = [n, 0, 0]
  const consider = (i, j) => {
    const k = i * W + j
    for (const [state, v] of [[0, M[k]], [1, X[k]], [2, Y[k]]]) {
      if (v > bestScore) {
        bestScore = v
        end = [i, j, state]
      }
    }
  }
  for (let j = 0; j <= m; j++) consider(n, j)
  if (live) for (let i = 0; i <= n; i++) consider(i, m)

  const matched = new Set()
  const inserted = new Int32Array(n + 1) // huruf tambahan yang dibaca sebelum a[i]
  let [i, j, state] = end
  while (i > 0 && j > 0) {
    const k = i * W + j
    if (state === 0) {
      if (a[i - 1] === b[j - 1]) matched.add(i - 1)
      state = pM[k]
      i--
      j--
    } else if (state === 1) {
      state = pX[k]
      i--
    } else {
      inserted[i]++
      state = pY[k]
      j--
    }
  }
  return { matched, inserted }
}

/**
 * Bandingkan ayat dengan transkrip.
 * Pulangkan { words: [{ text, status: 'betul' | 'salah' | 'belum' }], correct, total }
 * `final`: jika false (semasa masih membaca), perkataan selepas bahagian yang sudah dibaca ditanda 'belum'.
 */
export function checkRecitation(ayahText, transcript, final = true) {
  const words = ayahText.split(' ').filter(Boolean)
  const chars = []
  const owner = []
  words.forEach((w, wi) => {
    for (const ch of skeleton(w)) {
      chars.push(ch)
      owner.push(wi)
    }
  })
  // Rangka dibuat bagi setiap perkataan (huruf berganda hanya digabung dalam perkataan yang sama)
  const heard = transcript.split(/\s+/).map(skeleton).join('')
  const { matched, inserted } = align(chars, [...heard], !final)

  const hit = new Array(words.length).fill(0)
  const size = new Array(words.length).fill(0)
  const extra = new Array(words.length).fill(0)
  owner.forEach((wi, ci) => {
    size[wi]++
    if (matched.has(ci)) hit[wi]++
    // Huruf tambahan sebelum huruf ini (bukan di awal ayat) dikira sebagai kesilapan perkataan ini
    if (ci > 0) extra[wi] += inserted[ci]
  })
  // Kedudukan perkataan terakhir yang ada padanan (untuk semakan semasa membaca)
  let last = -1
  hit.forEach((h, wi) => {
    if (h > 0) last = wi
  })

  const result = words.map((text, wi) => {
    if (size[wi] === 0) return { text, status: final || wi <= last ? 'betul' : 'belum' }
    const ratio = hit[wi] / (size[wi] + extra[wi])
    if (ratio >= 0.75) return { text, status: 'betul' }
    if (!final && wi > last) return { text, status: 'belum' }
    return { text, status: 'salah' }
  })
  const correct = result.filter((r) => r.status === 'betul').length
  return { words: result, correct, total: words.length }
}
