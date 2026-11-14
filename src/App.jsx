import Home from './pages/Home'
import QuranList from './pages/QuranList'
import QuranReader from './pages/QuranReader'
import TadabburJournal from './pages/TadabburJournal'
import Koleksi from './pages/Koleksi'
import { useHashRoute } from './useHashRoute'

// Memilih halaman berdasarkan alamat (#/, #/quran, #/quran/2?ayat=5)
export default function App() {
  const { path, params } = useHashRoute()

  const reader = path.match(/^\/quran\/(\d+)$/)
  if (reader) {
    const surah = Number(reader[1])
    if (surah >= 1 && surah <= 114) {
      return <QuranReader key={surah} surah={surah} focusAyat={Number(params.get('ayat')) || null} openTadabbur={params.get('tadabbur') === '1'} openNote={params.get('catatan') === '1'} />
    }
  }
  if (path === '/tadabbur') return <TadabburJournal />
  if (path === '/koleksi') return <Koleksi />
  if (path.startsWith('/quran')) return <QuranList />
  return <Home />
}
