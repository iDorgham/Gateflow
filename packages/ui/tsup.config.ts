import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    utils: 'src/lib/utils.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: true,
  treeshake: true,
  external: [
    'react',
    'react-dom',
    'framer-motion',
    'lucide-react',
    'next',
    'react-hook-form',
  ],
});
