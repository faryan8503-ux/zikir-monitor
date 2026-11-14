// Semak sama ada versi app yang lebih baharu telah diterbitkan.
// Jika ada, muat semula app supaya ciri baharu terus muncul.
const RELOAD_KEY = 'zikir-monitor:reloaded-to'

export function checkForUpdate() {
  if (import.meta.env.DEV) return
  const base = import.meta.env.BASE_URL
  fetch(`${base}version.json?t=${Date.now()}`, { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data?.version || data.version === __APP_VERSION__) return
      try {
        // Elak muat semula berulang-ulang untuk versi yang sama
        if (sessionStorage.getItem(RELOAD_KEY) === data.version) return
        sessionStorage.setItem(RELOAD_KEY, data.version)
      } catch {
        return
      }
      // Alamat baharu (?v=...) memaksa telefon mengambil halaman terkini
      window.location.replace(`${base}?v=${data.version}`)
    })
    .catch(() => {})
}

export function watchForUpdates() {
  checkForUpdate()
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdate()
  })
}
