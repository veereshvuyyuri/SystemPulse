import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all local IPs
    allowedHosts: ['systempulse.local'], // Allow your custom domain
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../certs/server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, '../certs/server.crt')),
    },
    port: 5173,
  },
  define: {
    global: 'window',
  }
})
