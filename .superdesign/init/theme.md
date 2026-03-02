# Theme Context

## tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

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
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
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
  plugins: [animate],
};

export default config;
```

## globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --radius: 0.5rem;
    --background: 210 5% 96%;
    --foreground: 235 94% 11%;
    --card: 210 5% 96%;
    --card-foreground: 235 94% 11%;
    --popover: 210 5% 96%;
    --popover-foreground: 235 94% 11%;
    --primary: 19 100% 46%;
    --primary-foreground: 0 0% 100%;
    --secondary: 260 7% 93%;
    --secondary-foreground: 235 94% 11%;
    --muted: 260 7% 93%;
    --muted-foreground: 234 96% 23%;
    --accent: 260 7% 93%;
    --accent-foreground: 235 94% 11%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 260 7% 88%;
    --input: 260 7% 88%;
    --ring: 19 100% 46%;
    --sidebar: 210 5% 96%;
    --sidebar-foreground: 235 94% 11%;
    --sidebar-primary: 19 100% 46%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 260 7% 93%;
    --sidebar-accent-foreground: 235 94% 11%;
    --sidebar-border: 260 7% 88%;
    --sidebar-ring: 19 100% 46%;
  }

  .dark {
    --background: 235 94% 11%;
    --foreground: 210 5% 96%;
    --card: 235 94% 11%;
    --card-foreground: 210 5% 96%;
    --primary: 19 100% 46%;
    --primary-foreground: 0 0% 100%;
    --secondary: 234 96% 23%;
    --secondary-foreground: 210 5% 96%;
    --muted: 234 96% 23%;
    --muted-foreground: 260 7% 93%;
    --accent: 234 96% 23%;
    --accent-foreground: 210 5% 96%;
    --border: 234 96% 28%;
    --input: 234 96% 28%;
    --ring: 19 100% 46%;
    --sidebar: 235 94% 11%;
    --sidebar-foreground: 210 5% 96%;
    --sidebar-primary: 19 100% 46%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 234 96% 23%;
    --sidebar-accent-foreground: 210 5% 96%;
    --sidebar-border: 234 96% 28%;
    --sidebar-ring: 19 100% 46%;
  }
}
```
