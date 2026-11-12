import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The studio site at the root of iaos21.com. The original Taiko Mass site is
// built separately (taiko/vite.config.js) into dist/taiko-mass/.
export default defineConfig({
  plugins: [react()],
  build: { target: 'es2022', sourcemap: false, outDir: 'dist', emptyOutDir: true },
})
