
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path'
import dotenv from "dotenv";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA({
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],
    manifest: {
      name: 'Obóz Studentów PWr',
      short_name: 'Obóz PWR',
      /* THEME COLORS */
      theme_color: '#84c6e7',
      msTileColor: '#3e0e09',
      background_color: '#131313',
      orientation: "portrait-primary",
      lang: 'pl',
      description: "Aplikacja mobilna Obóz Studentów PWr",
      appleMobileWebAppCapable: 'yes',
      appleMobileWebAppStatusBarStyle: 'black-translucent',
      id: '/app/',
      icons: [
        {
          "src": "/android-chrome-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "/android-chrome-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        },
        {
          "src": "/favicon-32x32.png",
          "sizes": "32x32",
          "type": "image/png"
        },
        {
          "src": "/favicon-16x16.png",
          "sizes": "16x16",
          "type": "image/png"
        },
        {
          "src": "/apple-touch-icon.png",
          "sizes": "180x180",
          "type": "image/png"
        },
        {
          "src": "/safari-pinned-tab.svg",
          "sizes": "180x180",
          "type": "image/svg+xml"
        },
        {
          "src": "/mstile-150x150.png",
          "sizes": "150x150",
          "type": "image/png"
        }
      ]
    },
    "shortcuts": [
      {
        "name": "Sos",
        "url": "/sos"
      },
      {
        "name": "Home",
        "url": "/"
      },
      {
        "name": "Mapka",
        "url": "/mapka"
      },
      {
        "name": "Harmonogram",
        "url": "/harmonogram"
      },
      {
        "name": "Profil",
        "url": "/profil"
      }
    ],
    // strategies: 'injectManifest',
    injectRegister: null,
    // injectRegister: 'auto',
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true,
      type: 'module',
      navigateFallback: 'index.html'
    },
    workbox: {
      sourcemap: true
    }
  })],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    }
  },
  define: {
    'process.env': dotenv.config({ path: '.env' }).parsed
  }
})
