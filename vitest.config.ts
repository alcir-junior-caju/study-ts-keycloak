/// <reference types="vitest" />
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      exclude: [
        '**/node_modules/**',
        '**/*Dto.ts',
        '**/*Interface.ts',
        '**/index.ts',
        '**/main.ts',
        '**/keycloak/**',
        '**/keywind/**'
      ]
    }
  },
  plugins: [tsconfigPaths()]
})
