import { defineConfig } from 'vite';
import path from 'node:path';

// Vite configuration for building standalone browser widgets/utilities.
// Outputs ES and IIFE bundles into public/widgets so they can be loaded without Next.js.
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'widgets/src/index.ts'),
      name: 'PortfolioWidgets',
      formats: ['es', 'iife'],
  fileName: (format: string) => (format === 'iife' ? 'widgets.iife.js' : 'widgets.es.js'),
    },
    outDir: 'public/widgets',
    emptyOutDir: false,
    rollupOptions: {
      // No externals – produce a fully self-contained bundle
    },
  },
});
