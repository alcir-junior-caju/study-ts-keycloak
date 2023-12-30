/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      exclude: [
        '**/node_modules/**',
        '**/*Dto.ts',
        '**/*Interface.ts',
        '**/index.ts',
        '**/main.ts'
      ]
    }
  },
  plugins: [tsconfigPaths()]
})
