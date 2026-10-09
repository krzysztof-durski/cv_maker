import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' },
  // Component and hook tests (*.test.jsx) run here in jsdom. Plain-logic tests (*.test.js) use node:test.
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.jsx'],
    setupFiles: ['src/testing/setup.js'],
  },
})
