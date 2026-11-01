import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Apabila diterbitkan ke GitHub Pages, app berada di /zikir-monitor/
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/zikir-monitor/' : '/',
  plugins: [react(), tailwindcss()],
}))
