import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://3fi9ibjk.ap-southeast.insforge.app',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'https://3fi9ibjk.ap-southeast.insforge.app',
        changeOrigin: true,
        secure: false,
      },
      '/rest': {
        target: 'https://3fi9ibjk.ap-southeast.insforge.app',
        changeOrigin: true,
        secure: false,
      },
      '/storage': {
        target: 'https://3fi9ibjk.ap-southeast.insforge.app',
        changeOrigin: true,
        secure: false,
      },
      '/realtime': {
        target: 'https://3fi9ibjk.ap-southeast.insforge.app',
        changeOrigin: true,
        ws: true,
        secure: false,
      }
    }
  }
})
