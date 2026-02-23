import type { Config } from 'tailwindcss';
import { tokens } from './src/tokens';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: tokens.colors,
      borderRadius: tokens.borderRadius,
    },
  },
} satisfies Config;
