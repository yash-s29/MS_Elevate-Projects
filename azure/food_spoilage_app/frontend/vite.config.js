import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API calls to Flask during development
    proxy: {
      '/predict': 'http://127.0.0.1:5000',
      '/history': 'http://127.0.0.1:5000',
      '/delete':  'http://127.0.0.1:5000',
      '/feedback':'http://127.0.0.1:5000',
    },
  },
  build: {
    outDir: '../backend/static',
    emptyOutDir: true,
  },
});