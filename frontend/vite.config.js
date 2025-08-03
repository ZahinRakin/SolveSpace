import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': 'https://solvespace-backend.onrender.com'
    }
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://solvespace-backend.onrender.com')
  }
})

