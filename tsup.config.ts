import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/cli.ts',
  ],
  shims: true,
  format: ['esm'],
  dts: true,
  clean: true,
  splitting: true,
  treeshake: true,
})
