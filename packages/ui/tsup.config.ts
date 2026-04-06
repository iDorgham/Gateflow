import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/components/**/*.{ts,tsx}'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'framer-motion',
    'lucide-react',
    'next',
    'react-hook-form',
  ],
});
