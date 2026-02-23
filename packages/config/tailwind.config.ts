import type { Config } from 'tailwindcss';

// @ts-ignore – relative import for jiti
import { tokens } from '../ui/src/tokens';

const config: Config = {
  darkMode: ['class'],
  content: [
    '../../apps/*/src/**/*.{ts,tsx}',
    '../../apps/*/app/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: tokens.colors,
      borderRadius: tokens.borderRadius,
    },
  },
};

export default config;
