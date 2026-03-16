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
  plugins: [animate],
};

export default config;
```

## globals.css (Client Dashboard)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --radius: 0.25rem; /* Atlassian: 4px */

    /* Atlassian Palette — light */
    --background: 210 20% 100%; /* #FFFFFF */
    --foreground: 220 54% 20%; /* #172B4D Neutral 700 */

    --card: 210 20% 100%;
    --card-foreground: 220 54% 20%;

    --popover: 210 20% 100%;
    --popover-foreground: 220 54% 20%;

    --primary: 216 100% 40%; /* #0052CC Atlassian Blue */
    --primary-foreground: 0 0% 100%;
    --primary-rgb: 0, 82, 204;

    --secondary: 220 18% 93%; /* #EBECF0 Neutral 30 */
    --secondary-foreground: 220 25% 35%; /* #42526E Neutral 400 */

    --muted: 210 17% 96%; /* #F4F5F7 Neutral 20 */
    --muted-foreground: 220 15% 48%; /* #6B778C Neutral 100 */

    --accent: 216 100% 94%; /* #DEEBFF Blue 50 */
    --accent-foreground: 216 100% 40%;

    --destructive: 11 90% 43%; /* #DE350B Red */
    --destructive-foreground: 0 0% 100%;

    --border: 220 12% 89%; /* #DFE1E6 Neutral 40 */
    --input: 220 12% 89%;
    --ring: 212 100% 65%; /* #4C9AFF Blue 200 */

    /* Extended semantic (Atlassian) */
    --success: 158 54% 46%; /* #36B37E */
    --success-foreground: 0 0% 100%;
    --warning: 40 100% 50%; /* #FFAB00 */
    --warning-foreground: 220 54% 20%;
    --info: 189 100% 43%; /* #00B8D9 */
    --info-foreground: 0 0% 100%;
    --danger: 11 100% 59%; /* #FF5630 */
    --danger-foreground: 0 0% 100%;

    /* Sidebar (Atlassian Blue) */
    --sidebar: 216 92% 34%; /* #0747A6 */
    --sidebar-foreground: 216 100% 94%;
    --sidebar-primary: 216 100% 40%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 216 100% 40%;
    --sidebar-accent-foreground: 216 100% 94%;
    --sidebar-border: 216 100% 40%;
    --sidebar-ring: 212 100% 65%;
  }

  .dark {
    /* Atlassian Dark Theme (approximate) */
    --background: 220 33% 8%; /* #091E42 Neutral 800 */
    --foreground: 220 18% 93%; /* #EBECF0 Neutral 30 */

    --card: 220 33% 12%;
    --card-foreground: 220 18% 93%;

    --popover: 220 33% 12%;
    --popover-foreground: 220 18% 93%;

    --primary: 212 100% 65%; /* #4C9AFF Blue 200 */
    --primary-foreground: 220 33% 8%;
    --primary-rgb: 76, 154, 255;

    --secondary: 220 33% 15%; /* Neutral 600 */
    --secondary-foreground: 220 18% 93%;

    --muted: 220 33% 15%;
    --muted-foreground: 220 15% 63%; /* Neutral 90 */

    --accent: 220 33% 20%;
    --accent-foreground: 212 100% 65%;

    --destructive: 11 90% 43%;
    --destructive-foreground: 0 0% 100%;

    --border: 220 33% 20%;
    --input: 220 33% 20%;
    --ring: 212 100% 65%;

    /* Extended semantic */
    --success: 158 54% 46%;
    --success-foreground: 220 33% 8%;
    --warning: 40 100% 50%;
    --warning-foreground: 220 33% 8%;
    --info: 189 100% 43%;
    --info-foreground: 220 33% 8%;
    --danger: 11 100% 59%;
    --danger-foreground: 0 0% 100%;

    /* Sidebar */
    --sidebar: 220 33% 5%;
    --sidebar-foreground: 220 18% 93%;
    --sidebar-primary: 212 100% 65%;
    --sidebar-primary-foreground: 220 33% 8%;
    --sidebar-accent: 220 33% 15%;
    --sidebar-accent-foreground: 220 18% 93%;
    --sidebar-border: 220 33% 15%;
    --sidebar-ring: 212 100% 65%;
  }
}
```
