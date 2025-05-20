import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],


  server: {
    proxy: {
      '/o': {
        target: 'https://firebasestorage.googleapis.com/v0/b/udemy-3d9ed.firebasestorage.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/o/, ''),
      },
    },
  },
})