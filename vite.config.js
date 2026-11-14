import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Nombor versi unik setiap kali app dibina, untuk semakan kemas kini automatik
const version = Date.now().toString()

const versionFile = {
  name: 'version-file',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ version }) })
  },
}

// Apabila diterbitkan ke GitHub Pages, app berada di /zikir-monitor/
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/zikir-monitor/' : '/',
  define: { __APP_VERSION__: JSON.stringify(version) },
  plugins: [react(), tailwindcss(), versionFile],
}))
