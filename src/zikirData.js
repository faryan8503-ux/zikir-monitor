// Senarai zikir yang boleh dipilih di skrin utama
export const ZIKIR_LIST = [
  { id: 'subhanallah', name: 'Subhanallah', arabic: 'سُبْحَانَ ٱللّٰهِ', meaning: 'Maha Suci Allah' },
  { id: 'alhamdulillah', name: 'Alhamdulillah', arabic: 'ٱلْحَمْدُ لِلّٰهِ', meaning: 'Segala puji bagi Allah' },
  { id: 'allahuakbar', name: 'Allahu Akbar', arabic: 'ٱللّٰهُ أَكْبَرُ', meaning: 'Allah Maha Besar' },
  { id: 'lailahaillallah', name: 'La ilaha illallah', arabic: 'لَا إِلٰهَ إِلَّا ٱللّٰهُ', meaning: 'Tiada Tuhan melainkan Allah' },
  { id: 'astaghfirullah', name: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللّٰهَ', meaning: 'Aku memohon ampun kepada Allah' },
  {
    id: 'hasbunallah',
    name: 'Hasbunallah',
    latin: 'Hasbunallah wa ni‘mal wakil',
    arabic: 'حَسْبُنَا ٱللّٰهُ وَنِعْمَ ٱلْوَكِيلُ',
    meaning: 'Cukuplah Allah bagi kami, dan Dialah sebaik-baik Pelindung (Ali ‘Imran: 173)',
  },
  {
    id: 'selawatjibril',
    name: 'Selawat Jibril',
    latin: 'Sallallahu ‘ala Muhammad',
    arabic: 'صَلَّى ٱللّٰهُ عَلَىٰ مُحَمَّد',
    meaning: 'Semoga Allah berselawat ke atas Nabi Muhammad',
  },
  {
    id: 'wamaramaita',
    name: 'Wama Ramaita',
    latin: 'Wa mā ramayta idh ramayta wa lākinnallāha ramā',
    arabic: 'وَمَا رَمَيْتَ إِذْ رَمَيْتَ وَلَٰكِنَّ ٱللّٰهَ رَمَىٰ',
    meaning: 'Bukan engkau yang melempar ketika engkau melempar, tetapi Allah yang melempar (Al-Anfal: 17)',
  },
  // Amalan Rezeki Harian (dengan sasaran tersendiri)
  {
    id: 'rabbiinni',
    name: 'Rabbi Inni Lima Anzalta',
    latin: 'Rabbi inni lima anzalta ilayya min khairin faqir',
    arabic: "رَبِّ إِنِّی لِمَاۤ أَنزَلۡتَ إِلَیَّ مِنۡ خَیۡرࣲ فَقِیرࣱ",
    meaning: 'Wahai Tuhanku, sesungguhnya aku sangat berhajat kepada sebarang rezeki pemberian yang Engkau berikan (Al-Qasas: 24)',
    target: 11,
    rezeki: true,
  },
  {
    id: 'innafatahna',
    name: 'Inna Fatahna',
    latin: 'Inna fatahna laka fathan mubina',
    arabic: "إِنَّا فَتَحۡنَا لَكَ فَتۡحࣰا مُّبِینࣰا",
    meaning: 'Sesungguhnya Kami telah membuka bagimu satu jalan kemenangan yang jelas nyata (Al-Fath: 1)',
    target: 11,
    rezeki: true,
  },
  {
    id: 'yarazzaq',
    name: 'Ya Allah Ya Razzaq Ya Fattah',
    latin: 'Ya Allah, Ya Razzaq, Ya Fattah',
    arabic: 'يَا اللّٰهُ يَا رَزَّاقُ يَا فَتَّاحُ',
    meaning: 'Wahai Allah, Wahai Yang Maha Pemberi Rezeki, Wahai Yang Maha Pembuka (pintu rahmat)',
    target: 44,
    rezeki: true,
  },
]

export const DAILY_TARGET = 100

// Amalan Rezeki Harian: bacaan mengikut susunan dan sasaran masing-masing
export const REZEKI_LIST = ZIKIR_LIST.filter((z) => z.rezeki)
