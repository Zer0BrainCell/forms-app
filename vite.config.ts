import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(),
    react(),
  ],
   server: {
    host: 'localhost',
    port:5173,
    proxy:{
      '/api':{
        changeOrigin: true,
        secure: false,
        target: 'http://localhost:4000/'
      }
    },
    strictPort:true
  },
})
