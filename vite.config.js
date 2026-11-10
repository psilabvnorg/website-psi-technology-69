import { defineConfig } from 'vite';

// Relative base so the built site works from any folder / static host.
export default defineConfig({
  base: './',
  build: { outDir: 'dist', assetsInlineLimit: 0 },
});
