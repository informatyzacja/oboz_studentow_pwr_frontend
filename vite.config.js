import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA({ 
    manifest: {
      name: 'Obóz Studentów PWr',
      short_name: 'Obóz PWR',
      themeColor: '#de7539',
      msTileColor: '#000000',
      orientation: "portrait-primary",
      lang: 'pl',
      description: "Aplikacja mobilna Obóz Studentów PWr",
      appleMobileWebAppCapable: 'yes',
      appleMobileWebAppStatusBarStyle: 'black-translucent',
    },
    registerType: 'autoUpdate'
   })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    VERSION_NUMBER: JSON.stringify(new Date().toISOString().slice(2, 10).replace(/-/g, '.'))
  }
})
