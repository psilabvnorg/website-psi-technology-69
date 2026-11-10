import { defineConfig } from 'vite';

// Standalone bundle of the 3D logo (three.js included) as one IIFE file:
// window.PSILogo3D.mount(canvas, { getSections }). Used by the design canvas
// preview and by anyone who wants the effect without the full site.
export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'dist/logo3d',
    emptyOutDir: true,
    lib: {
      entry: 'src/logo3d-standalone.js',
      name: 'PSILogo3D',
      formats: ['iife'],
      fileName: () => 'psi-logo3d.js',
    },
  },
});
