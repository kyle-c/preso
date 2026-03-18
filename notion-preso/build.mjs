import { build } from 'esbuild'

// Content script — single bundle
await build({
  entryPoints: ['content/overlay.ts'],
  bundle: true,
  outfile: 'dist/content.js',
  format: 'iife',
  target: 'chrome120',
  minify: false,
})

// Service worker
await build({
  entryPoints: ['background/service-worker.ts'],
  bundle: true,
  outfile: 'dist/service-worker.js',
  format: 'iife',
  target: 'chrome120',
  minify: false,
})

// Popup
await build({
  entryPoints: ['popup/popup.ts'],
  bundle: true,
  outfile: 'popup/popup.js',
  format: 'iife',
  target: 'chrome120',
  minify: false,
})

// Options
await build({
  entryPoints: ['options/options.ts'],
  bundle: true,
  outfile: 'options/options.js',
  format: 'iife',
  target: 'chrome120',
  minify: false,
})

console.log('Build complete ✓')
