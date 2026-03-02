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
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'particle-float': {
          '0%, 100%': { transform: 'translate(0, 0)', opacity: '0.6' },
          '25%': { transform: 'translate(4px, -6px)', opacity: '0.4' },
          '50%': { transform: 'translate(-3px, 4px)', opacity: '0.7' },
          '75%': { transform: 'translate(5px, 3px)', opacity: '0.5' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-6px)' },
          '30%': { transform: 'translateX(6px)' },
          '45%': { transform: 'translateX(-4px)' },
          '60%': { transform: 'translateX(4px)' },
          '75%': { transform: 'translateX(-2px)' },
          '90%': { transform: 'translateX(2px)' },
        },
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
        'particle-float': 'particle-float 16s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
