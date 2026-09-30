import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: [
      'ozkr.net',
      'www.ozkr.net',
    ],
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/blog': 'http://127.0.0.1:8000',
      '/rss.xml': 'http://127.0.0.1:8000',
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  assetsInclude: ['**/*.yaml', '**/*.yml']
})
