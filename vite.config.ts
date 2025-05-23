import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react', 'uuid'],
  },
  server: {
    proxy: {
      '/data': 'http://localhost:3000',
      '/socket.io': {
        target: 'wss://nft.memextoken.org:24678',
        ws: true,
        secure: true,
        changeOrigin: true
      },
      'wss://nft.memextoken.org:24678': {
        target: 'wss://nft.memextoken.org:24678',
        secure: true,
        ws: true,
        changeOrigin: true
      },
      'ws://nft.memextoken.org:24678': {
        target: 'wss://nft.memextoken.org:24678',
        secure: true,
        ws: true,
        changeOrigin: true
      }
    },
    hmr: {
      overlay: false,
      protocol: 'wss',
    },
    allowedHosts: ["nft.memextoken.org"],
    https: true,
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
