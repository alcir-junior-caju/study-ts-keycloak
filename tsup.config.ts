import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*'],
  splitting: true,
  sourcemap: false,
  outDir: 'dist',
  minify: true
})
