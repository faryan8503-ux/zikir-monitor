// Hukum tajwid & tanda waqaf: warna dan penerangan ringkas dalam Bahasa Melayu.
// Warna mengikut skema mushaf tajwid berwarna yang biasa digunakan.

export const TAJWID_RULES = {
  g: {
    name: 'Ghunnah (Dengung)',
    color: '#FF7E1E',
    info: 'Huruf ن atau م yang bertasydid (ّ). Baca dengan dengung selama 2 harakat.',
  },
  f: {
    name: "Ikhfa' Haqiqi",
    color: '#9400A8',
    info: "Nun mati (نْ) atau tanwin bertemu salah satu daripada 15 huruf ikhfa'. Bunyi nun disamarkan sambil berdengung 2 harakat.",
  },
  c: {
    name: "Ikhfa' Syafawi",
    color: '#D500B7',
    info: 'Mim mati (مْ) bertemu huruf ب. Bunyi mim disamarkan di bibir sambil berdengung 2 harakat.',
  },
  i: {
    name: 'Iqlab',
    color: '#26BFFD',
    info: 'Nun mati atau tanwin bertemu huruf ب. Bunyi nun ditukar kepada bunyi mim (ada mim kecil ۢ), dengan dengung 2 harakat.',
  },
  a: {
    name: "Idgham Ma'al Ghunnah",
    color: '#169777',
    info: 'Nun mati atau tanwin bertemu huruf ي ن م و. Bunyi nun dimasukkan ke dalam huruf seterusnya dengan dengung 2 harakat.',
  },
  u: {
    name: 'Idgham Bila Ghunnah',
    color: '#169200',
    info: 'Nun mati atau tanwin bertemu huruf ل atau ر. Bunyi nun dimasukkan terus ke huruf seterusnya tanpa dengung.',
  },
  w: {
    name: 'Idgham Mithlain (Syafawi)',
    color: '#58B800',
    info: 'Mim mati bertemu huruf م. Kedua-dua mim digabungkan dan dibaca dengan dengung 2 harakat.',
  },
  d: {
    name: 'Idgham Mutajanisain',
    color: '#A1A1A1',
    info: 'Dua huruf yang sama tempat keluar (makhraj) tetapi berlainan sifat bertemu. Huruf pertama dimasukkan ke dalam huruf kedua.',
  },
  b: {
    name: 'Idgham Mutaqaribain',
    color: '#A1A1A1',
    info: 'Dua huruf yang hampir sama makhraj dan sifatnya bertemu. Huruf pertama dimasukkan ke dalam huruf kedua.',
  },
  q: {
    name: 'Qalqalah',
    color: '#DD0008',
    info: 'Huruf ق ط ب ج د yang bersukun (mati). Dibaca dengan bunyi melantun atau memantul.',
  },
  n: {
    name: "Mad Asli (Mad Tabi'i)",
    color: '#537FFF',
    info: 'Bacaan panjang biasa. Panjangkan 2 harakat.',
  },
  p: {
    name: "Mad 'Aridh Lissukun / Mad Lin",
    color: '#4050FF',
    info: 'Jika berhenti di sini, boleh dipanjangkan 2, 4 atau 6 harakat. Jika disambung, baca seperti biasa.',
  },
  o: {
    name: 'Mad Wajib Muttasil / Mad Jaiz Munfasil',
    color: '#2144C1',
    info: 'Huruf mad bertemu hamzah (ء). Panjangkan 4 atau 5 harakat. Wajib jika dalam satu kalimah (Muttasil); harus jika berlainan kalimah (Munfasil).',
  },
  m: {
    name: 'Mad Lazim',
    color: '#000EBC',
    info: 'Wajib dipanjangkan 6 harakat.',
  },
  h: {
    name: 'Hamzah Wasal',
    color: '#AAAAAA',
    info: 'Hamzah ini dibaca (dengan baris) hanya jika anda memulakan bacaan pada perkataan ini. Jika disambung dengan perkataan sebelumnya, ia tidak dibaca.',
  },
  l: {
    name: 'Alif Lam Syamsiah',
    color: '#AAAAAA',
    info: 'Huruf lam (ل) tidak dibaca. Bunyi terus masuk ke huruf selepasnya yang bertasydid.',
  },
  s: {
    name: 'Huruf Tidak Dibaca',
    color: '#AAAAAA',
    info: 'Huruf ini ditulis tetapi tidak dibunyikan.',
  },
}

// Susunan dalam panduan
export const TAJWID_GROUPS = [
  { title: 'Dengung & Nun/Mim Mati', codes: ['g', 'f', 'c', 'i', 'a', 'u', 'w', 'd', 'b'] },
  { title: 'Qalqalah', codes: ['q'] },
  { title: 'Bacaan Panjang (Mad)', codes: ['n', 'p', 'o', 'm'] },
  { title: 'Tidak Dibaca', codes: ['h', 'l', 's'] },
]

export const WAQAF_COLOR = '#0F9D58'

// Tanda berhenti (waqaf) dalam mushaf
export const WAQAF = {
  'ۘ': {
    symbol: 'مـ',
    name: 'Waqaf Lazim',
    action: 'Wajib berhenti',
    info: 'Mesti berhenti di sini. Jika disambung, maksud ayat boleh berubah.',
  },
  'ۗ': {
    symbol: 'قلى',
    name: 'Waqaf Aula',
    action: 'Lebih baik berhenti',
    info: 'Lebih baik berhenti di sini, tetapi boleh juga disambung.',
  },
  'ۚ': {
    symbol: 'ج',
    name: 'Waqaf Jaiz',
    action: 'Boleh berhenti atau sambung',
    info: 'Boleh berhenti atau terus sambung. Kedua-duanya sama baik.',
  },
  'ۖ': {
    symbol: 'صلى',
    name: 'Wasal Aula',
    action: 'Lebih baik sambung',
    info: 'Lebih baik terus sambung bacaan, tetapi boleh juga berhenti.',
  },
  'ۛ': {
    symbol: '∴',
    name: "Waqaf Mu'anaqah",
    action: 'Berhenti di salah satu',
    info: 'Tanda tiga titik ini datang berpasangan. Berhenti pada salah satu sahaja, jangan berhenti pada kedua-duanya.',
  },
  'ۙ': {
    symbol: 'لا',
    name: "Waqaf Mamnu' (Tanda Lā)",
    action: 'Jangan berhenti',
    info: 'Jangan berhenti di sini. Jika terpaksa berhenti kerana kehabisan nafas, ulang semula dari perkataan sebelumnya.',
  },
}

export const WAQAF_CHARS = Object.keys(WAQAF)

export const AYAH_END_INFO = {
  symbol: '﴿١﴾',
  name: 'Hujung Ayat',
  action: 'Digalakkan berhenti',
  info: 'Bulatan nombor menandakan hujung ayat. Digalakkan berhenti dan menarik nafas di sini.',
}

// Contoh klasik bagi setiap hukum: teks, rujukan [surah, ayat, perkataan Quran.com], cara baca
export const TAJWID_EXAMPLES = {
  g: [{ ar: "إِنَّ", s: 2, a: 6, words: [1], baca: "in-nna — tahan dengung pada nun selama 2 harakat" }, { ar: "وَمِمَّا", s: 2, a: 3, words: [6], baca: "wa mim-maa — tahan dengung pada mim selama 2 harakat" }],
  f: [{ ar: "ءَأَنذَرۡتَهُمۡ", s: 2, a: 6, words: [6], baca: "a-an(ng)dzartahum — bunyi nun disamarkan sambil berdengung sebelum huruf dzal" }],
  c: [{ ar: "تَرۡمِیهِم بِحِجَارَةࣲ", s: 105, a: 4, words: [1, 2], baca: "tarmiihim(m) bihijaaratin — mim disamarkan di bibir sebelum huruf ba" }],
  i: [{ ar: "أَنۢبِئۡهُم", s: 2, a: 33, words: [3], baca: "am-bi'hum — bunyi nun bertukar menjadi mim, dengan dengung" }],
  a: [{ ar: "مَن یَقُولُ", s: 2, a: 8, words: [3, 4], baca: "may-yaquulu — nun dimasukkan ke dalam ya dengan dengung" }],
  u: [{ ar: "مِّن رَّبِّهِمۡۖ", s: 2, a: 5, words: [4, 5], baca: "mir-rabbihim — nun tidak dibaca, terus masuk ke huruf ra tanpa dengung" }],
  w: [{ ar: "قُلُوبِهِم مَّرَضࣱ", s: 2, a: 10, words: [2, 3], baca: "quluubihim-maradhun — dua mim bergabung dengan dengung" }],
  d: [{ ar: "قَد تَّبَیَّنَ", s: 2, a: 256, words: [5, 6], baca: "qat-tabayyana — huruf dal dimasukkan ke dalam huruf ta" }],
  b: [{ ar: "نَخۡلُقكُّم", s: 77, a: 20, words: [2], baca: "nakhluk-kum — huruf qaf dimasukkan ke dalam huruf kaf" }],
  q: [{ ar: "یَلِدۡ", s: 112, a: 3, words: [2], baca: "yalid(d) — huruf dal mati dibaca melantun" }],
  n: [{ ar: "مَـٰلِكِ", s: 1, a: 4, words: [1], baca: "maa-liki — panjangkan 'maa' 2 harakat" }],
  p: [{ ar: "ٱلۡعَـٰلَمِینَ", s: 1, a: 2, words: [4], baca: "al-'aalamiin — bila berhenti, 'miin' boleh dipanjangkan 2, 4 atau 6 harakat" }],
  o: [{ ar: "جَاۤءَ", s: 110, a: 1, words: [2], baca: "jaaaa-a — Mad Wajib: panjangkan 4 atau 5 harakat sebelum hamzah" }, { ar: "بِمَاۤ أُنزِلَ", s: 2, a: 4, words: [3, 4], baca: "bimaaaa unzila — Mad Jaiz: panjangkan 4 atau 5 harakat" }],
  m: [{ ar: "ٱلضَّاۤلِّینَ", s: 1, a: 7, words: [9], baca: "adh-dhaaaaal-liin — panjangkan 6 harakat" }],
  h: [{ ar: "ٱهۡدِنَا", s: 1, a: 6, words: [1], baca: "ihdinaa — bila memulakan bacaan, hamzah dibaca 'i'. Jika disambung, hamzah gugur" }],
  l: [{ ar: "ٱلرَّحۡمَـٰنِ", s: 1, a: 3, words: [1], baca: "ar-rahmaan — huruf lam tidak dibaca, terus ke huruf ra" }],
  s: [{ ar: "كَفَرُوا۟", s: 2, a: 6, words: [3], baca: "kafaruu — alif di hujung tidak dibaca" }],
}
