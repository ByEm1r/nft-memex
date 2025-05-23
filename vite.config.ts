import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react', 'uuid'],
  },
  server: {
    proxy: {
      '/data': 'http://localhost:3000', // Varsa özel API'n için
    },
    hmr: {
      overlay: false
    },
    allowedHosts: ["nft.memextoken.org"],

    // Lokal geliştiriyorsan HTTPS kapalı olmalı
    https: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  base: '/',
});
