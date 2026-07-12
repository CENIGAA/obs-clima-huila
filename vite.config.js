import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('scheduler')) return 'vendor'
            if (id.includes('lucide-react')) return 'icons'
            if (id.includes('leaflet') || id.includes('react-leaflet')) return 'map'
            if (id.includes('recharts') || id.includes('victory-vendor')) return 'charts'
          }
          return undefined
        },
      },
    },
  },
  server: {
    port: 5173,
  },
})
