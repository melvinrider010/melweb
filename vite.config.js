import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/storage': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('gsap')) {
              return 'vendor-animation';
            }
            return 'vendor-misc';
          }
          if (id.includes('/src/data/notices.json')) {
            return 'data-notices';
          }
          if (id.includes('/src/data/events.json')) {
            return 'data-events';
          }
          if (id.includes('/src/data/academicsHierarchyData') || id.includes('/src/data/programmeDetailsData')) {
            return 'data-academics';
          }
          if (id.includes('/src/admin/')) {
            return 'admin-portal';
          }
        },
      },
    },
  },
})