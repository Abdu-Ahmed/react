import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/graphql': {
        target: 'https://ecommtest.wuaze.com',
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [react()],
  base: '/react/',
})
