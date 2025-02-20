import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/graphql': {
        target: 'https://http://bckndapeye.hstn.me',
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [react()],
  base: '/react/',
})
