import Home from './pages/Home'
import QuranList from './pages/QuranList'
import QuranReader from './pages/QuranReader'
import { useHashRoute } from './useHashRoute'

// Memilih halaman berdasarkan alamat (#/, #/quran, #/quran/2?ayat=5)
export default function App() {
  const { path, params } = useHashRoute()

  const reader = path.match(/^\/quran\/(\d+)$/)
  if (reader) {
    const surah = Number(reader[1])
    if (surah >= 1 && surah <= 114) {
      return <QuranReader key={surah} surah={surah} focusAyat={Number(params.get('ayat')) || null} />
    }
  }
  if (path.startsWith('/quran')) return <QuranList />
  return <Home />
}
