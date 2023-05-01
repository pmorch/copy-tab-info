import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  build: {
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      input: {
        monaco: resolve(__dirname, 'monaco.js'),
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      }
    },
  }
})
