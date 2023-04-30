import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { resolve } from "path";

import modifyManifest from './src/modifyManifest.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    modifyManifest(),
],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      input: {
        options: resolve(__dirname, 'options.html'),
        background: resolve(__dirname, 'src', 'background.js')
      },
    },
  }
})
