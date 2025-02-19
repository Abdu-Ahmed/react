import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests starting with /graphql to your backend
      '/graphql': {
        target: 'https://ecommtest.wuaze.com',
        changeOrigin: true,
        secure: false, // use true if your backend has a valid SSL certificate
      },
    },
  },
});
