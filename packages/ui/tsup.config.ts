import { defineConfig } from 'tsup';

const external = [
  'react',
  'react-dom',
  'framer-motion',
  'lucide-react',
  'next',
  'react-hook-form',
];

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    splitting: false,
    treeshake: true,
    external,
  },
  {
    entry: { utils: 'src/lib/utils.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    external,
  },
  {
    entry: { tokens: 'src/tokens.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    external,
  },
]);
