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

- `src/App.jsx` — skrin utama
- `src/components/CounterButton.jsx` — butang kira bulat merah jambu
- `src/components/MenuButtons.jsx` — butang Statistik, Rekod, Sasaran, Tetapan
- `src/components/Flower.jsx` — hiasan bunga, bintang dan bulan sabit
- `src/useZikirCounter.js` — logik kiraan (disimpan dalam pelayar, bermula semula setiap hari)
- `src/zikirData.js` — senarai zikir dan sasaran harian
- `src/index.css` — warna, fon dan animasi
