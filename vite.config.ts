import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function githubPagesSpa() {
  return {
    name: 'github-pages-spa',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist')
      const indexHtml = path.join(dist, 'index.html')
      if (!fs.existsSync(indexHtml)) return

      // Fallback for client-side routing on GitHub Pages
      fs.copyFileSync(indexHtml, path.join(dist, '404.html'))

      // Pre-generate directory indexes for known routes for HTTP 200
      const routes = ['blog', 'blog/5000x-faster-by-moving-a-single-word']
      for (const route of routes) {
        const routeDir = path.join(dist, route)
        fs.mkdirSync(routeDir, { recursive: true })
        fs.copyFileSync(indexHtml, path.join(routeDir, 'index.html'))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    githubPagesSpa(),
  ],
})
