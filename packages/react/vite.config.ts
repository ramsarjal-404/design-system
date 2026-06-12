/**
 * Library build for @lepidus/react.
 *
 * Emits dist/index.js (ESM, react externalized) and dist/style.css (all CSS
 * Modules extracted, classes hashed). Type declarations come from
 * `tsc -p tsconfig.build.json` (run together via `npm run build:react` at the
 * repo root). Consumers load @lepidus/tokens/css first, then ./style.css.
 */
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        assetFileNames: (info) => (info.name?.endsWith('.css') ? 'style.css' : 'assets/[name][extname]'),
      },
    },
  },
});
