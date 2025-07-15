import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { fileMetadataPlugin } from './plugins/file-metadata.js'

export default defineConfig({
  plugins: [
    vue(),
    fileMetadataPlugin()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})