import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      // Add this workbox block to increase the cache limit to 5MB
      workbox: {
        maximumFileSizeToCacheInBytes: 5000000 
      },
      manifest: {
        name: 'GeetaDrishti',
        short_name: 'GeetaDrishti',
        description: 'Bhagavad Gita Reader & Semantic Search',
        theme_color: '#fffaf2',
        background_color: '#fffaf2',
        display: 'standalone',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})