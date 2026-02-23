import type { Config } from 'tailwindcss';

// @ts-ignore – relative import for jiti (Tailwind's TS loader)
import { tokens } from '../../packages/ui/src/tokens';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: tokens.colors,
      borderRadius: tokens.borderRadius,
    },
  },
  plugins: [],
};

export default config;
