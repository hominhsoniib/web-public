import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Hash toàn bộ nội dung public/images/ -> dùng làm query-string cache-busting
// (?v=<hash>) cho ảnh, vì Vite copy public/ nguyên vẹn, không tự content-hash
// tên file như với JS/CSS import trong src/. Xem src/lib/assetVersion.ts.
function hashImagesDir(dir: string): string {
  const hash = createHash('sha256')
  const walk = (d: string) => {
    for (const entry of readdirSync(d).sort()) {
      const full = path.join(d, entry)
      if (statSync(full).isDirectory()) {
        walk(full)
      } else {
        hash.update(entry)
        hash.update(readFileSync(full))
      }
    }
  }
  walk(dir)
  return hash.digest('hex').slice(0, 10)
}

const assetVersion = hashImagesDir(path.resolve(__dirname, 'public/images'))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __ASSET_VERSION__: JSON.stringify(assetVersion),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})
