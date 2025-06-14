import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { resolve, dirname } from "path";

import modifyManifest from './src/modifyManifest.js'

import packageJSON from `./package.json` assert { type: "json" };

const rootDir = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    modifyManifest(),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(packageJSON.version)
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        options: resolve(__dirname, 'src', 'options', 'options.html'),
        background: resolve(__dirname, 'src', 'background.js'),
        offscreen: resolve(__dirname, 'src', 'offscreen', 'offscreen.html'),
      },
      output: {
        entryFileNames: (assetInfo) => {
          // assetInfo.facadeModuleId contains the input file's full path
          if (assetInfo.facadeModuleId && assetInfo.facadeModuleId.match(/\.js$/)) {
            // This is a js input
            const assetPath = dirname(assetInfo.facadeModuleId).replace(rootDir, '');
            return assetPath + '/[name].js';
          } else {
            // vite default value
            return 'assets/[name]-[hash].js';
          }
        },
      }
    },
  }
})
