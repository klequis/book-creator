import { defineConfig } from '@solidjs/start/config'

export default defineConfig({
  server: {
    preset: 'node-server',
    port: 3000
  },
  vite: {
    server: {
      port: 3000
    }
  }
})
