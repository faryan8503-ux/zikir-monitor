# Zikir Monitor 🌸

Aplikasi web comel untuk mengira zikir harian. Dibina dengan React, Vite dan Tailwind CSS.

## Cara menjalankan

1. Pasang [Node.js](https://nodejs.org) (versi 20 atau lebih baharu).
2. Dalam folder projek ini, jalankan:

```bash
npm install     # pasang pakej (sekali sahaja)
npm run dev     # mulakan aplikasi
```

3. Buka alamat yang dipaparkan (contoh: http://localhost:5173) dalam pelayar.
   Untuk cuba di iPhone, sambung ke Wi-Fi yang sama dan buka alamat "Network".

## Struktur fail

- `src/App.jsx` — pemilih halaman (skrin utama, senarai surah, bacaan)
- `src/pages/Home.jsx` — skrin utama
- `src/pages/QuranList.jsx` — senarai 114 surah & kemajuan khatam
- `src/pages/QuranReader.jsx` — bacaan surah, tanda "baca sampai sini"
- `src/quran/` — maklumat surah & logik kemajuan bacaan
- `src/pages/TadabburJournal.jsx`, `src/components/TadabburEditor.jsx`, `src/tadabbur/` — Jurnal Tadabbur
- `public/quran/` — teks Al-Quran & terjemahan (satu fail bagi setiap surah)
- `scripts/build-quran-data.py` — skrip untuk menjana data Al-Quran
- `src/components/CounterButton.jsx` — butang kira bulat merah jambu
- `src/components/MenuButtons.jsx` — butang Statistik, Rekod, Sasaran, Tetapan
- `src/components/Flower.jsx` — hiasan bunga, bintang dan bulan sabit
- `src/sounds.js` — bunyi tekan & suara Alhamdulillah
- `src/useZikirCounter.js` — logik kiraan (disimpan dalam pelayar, bermula semula setiap hari)
- `src/zikirData.js` — senarai zikir dan sasaran harian
- `src/index.css` — warna, fon dan animasi

## Sumber Al-Quran

- Teks Arab: Tanzil Project (tanzil.net, CC BY 3.0), versi Uthmani daripada Quran Academy
- Terjemahan Melayu: Abdullah Muhammad Basmeih, melalui Tanzil
- Warna tajwid: data Al-Quran Cloud (pakej npm @kmaslesa/tajweed), dipadankan huruf demi huruf dengan teks Uthmani oleh `scripts/tajwid_align.py`
- Audio contoh bacaan: audio perkataan Quran.com (audio.qurancdn.com) & bacaan ayat Mishary Alafasy (everyayah.com); padanan perkataan oleh `scripts/word_map.py`
- Data diambil melalui github.com/fawazahmed0/quran-api
