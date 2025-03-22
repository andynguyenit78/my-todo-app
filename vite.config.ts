import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'dnd-vendor': ['react-beautiful-dnd'],
        }
      }
    }
  },
  server: {
    host: true,
    port: 3000
  }
})
