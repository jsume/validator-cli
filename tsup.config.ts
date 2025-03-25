import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/cli.ts',
  ],
  shims: true,
  format: ['esm'],
  clean: true,
  treeshake: true,
})
