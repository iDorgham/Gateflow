import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

// @ts-ignore – relative import for jiti (Tailwind's TS loader)
import { tokens } from '../../packages/ui/src/tokens';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    '../../packages/ui/src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: tokens.colors,
      borderRadius: tokens.borderRadius,
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
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
  plugins: [animate],
};

export default config;

