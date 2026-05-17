import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:  ['react', 'react-dom'],
          icons:   ['lucide-react'],
          map:     ['leaflet', 'react-leaflet'],
          charts:  ['recharts'],
        },
      },
    },
  },
  server: {
    port: 5173,
  },
})
