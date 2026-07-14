import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import typography from '@tailwindcss/typography';

import { tokens } from '../../packages/ui/src/tokens';

const config: Config = {
  darkMode: ['selector', '[data-color-mode="dark"]'],
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    '../../packages/ui/src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: tokens.colors,
      spacing: tokens.spacing,
      fontWeight: tokens.typography.fontWeight,
      borderRadius: tokens.borderRadius,
      screens: tokens.screens,
      fontFamily: {
        sans: [tokens.typography.fontFamily.sans, 'system-ui', 'sans-serif'],
        mono: [tokens.typography.fontFamily.mono, 'monospace'],
        arabic: ['var(--font-cairo)', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      },
    },
  },
  plugins: [animate, typography],
};

export default config;
