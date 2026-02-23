import type { Config } from 'tailwindcss';

// @ts-ignore – relative import for jiti
import { tokens } from './packages/ui/src/tokens';

const config: Config = {
  darkMode: ['class'],
  content: [
    './apps/*/src/**/*.{ts,tsx,mdx}',
    './apps/*/app/**/*.{ts,tsx,mdx}',
    './packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: tokens.colors,
      borderRadius: tokens.borderRadius,
    },
  },
};

export default config;
