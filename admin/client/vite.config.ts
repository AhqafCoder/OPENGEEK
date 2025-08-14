import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/admin': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/content': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/dashboard': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    base: '/',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  preview: {
    host: true,
    port: 5173,
  },
})