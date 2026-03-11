/**
 * GateFlow Design Tokens
 *
 * Aligned to shadcn/ui — Zinc base · Mira (compact) style · Inter font.
 *
 * Web apps consume these via CSS variable references: hsl(var(--name)).
 * React-Native apps use the `nativeTokens` export directly.
 */

/* ── Web tokens (consumed by Tailwind theme.extend.colors) ──────────────── */

export const tokens = {
  colors: {
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    primary: {
      DEFAULT: 'hsl(var(--primary))',
      foreground: 'hsl(var(--primary-foreground))',
    },
    secondary: {
      DEFAULT: 'hsl(var(--secondary))',
      foreground: 'hsl(var(--secondary-foreground))',
    },
    destructive: {
      DEFAULT: 'hsl(var(--destructive))',
      foreground: 'hsl(var(--destructive-foreground))',
    },
    muted: {
      DEFAULT: 'hsl(var(--muted))',
      foreground: 'hsl(var(--muted-foreground))',
    },
    accent: {
      DEFAULT: 'hsl(var(--accent))',
      foreground: 'hsl(var(--accent-foreground))',
    },
    popover: {
      DEFAULT: 'hsl(var(--popover))',
      foreground: 'hsl(var(--popover-foreground))',
    },
    card: {
      DEFAULT: 'hsl(var(--card))',
      foreground: 'hsl(var(--card-foreground))',
    },
    // Extended semantic (project-specific)
    success: {
      DEFAULT: 'hsl(var(--success))',
      foreground: 'hsl(var(--success-foreground))',
    },
    warning: {
      DEFAULT: 'hsl(var(--warning))',
      foreground: 'hsl(var(--warning-foreground))',
    },
    info: {
      DEFAULT: 'hsl(var(--info))',
      foreground: 'hsl(var(--info-foreground))',
    },
    danger: {
      DEFAULT: 'hsl(var(--danger))',
      foreground: 'hsl(var(--danger-foreground))',
    },
    // Sidebar (dark panel)
    sidebar: {
      DEFAULT: 'hsl(var(--sidebar))',
      foreground: 'hsl(var(--sidebar-foreground))',
      primary: 'hsl(var(--sidebar-primary))',
      'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
      accent: 'hsl(var(--sidebar-accent))',
      'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
      border: 'hsl(var(--sidebar-border))',
      ring: 'hsl(var(--sidebar-ring))',
    },
    // Chart palette
    chart: {
      1: 'hsl(var(--chart-1))',
      2: 'hsl(var(--chart-2))',
      3: 'hsl(var(--chart-3))',
      4: 'hsl(var(--chart-4))',
      5: 'hsl(var(--chart-5))',
    },
  },
  borderRadius: {
    lg: 'var(--radius)',
    md: 'calc(var(--radius) - 2px)',
    sm: 'calc(var(--radius) - 4px)',
  },
};

/* ── React-Native tokens (Zinc palette in hex, no CSS vars) ─────────────── */

export const nativeTokens = {
  colors: {
    // Zinc scale
    zinc50: '#fafafa',
    zinc100: '#f4f4f5',
    zinc200: '#e4e4e7',
    zinc300: '#d4d4d8',
    zinc400: '#a1a1aa',
    zinc500: '#71717a',
    zinc600: '#52525b',
    zinc700: '#3f3f46',
    zinc800: '#27272a',
    zinc900: '#18181b',
    zinc950: '#09090b',

    // Semantic
    background: '#ffffff',
    foreground: '#18181b',      // zinc-900
    card: '#ffffff',
    cardForeground: '#18181b',
    primary: '#18181b',         // zinc-900
    primaryForeground: '#fafafa', // zinc-50
    secondary: '#f4f4f5',       // zinc-100
    secondaryForeground: '#18181b',
    muted: '#f4f4f5',           // zinc-100
    mutedForeground: '#71717a', // zinc-500
    neutral: '#71717a',        // alias for mutedForeground
    accent: '#f4f4f5',
    accentForeground: '#18181b',
    destructive: '#ef4444',     // red-500
    destructiveForeground: '#fafafa',
    border: '#e4e4e7',          // zinc-200
    input: '#e4e4e7',
    ring: '#a1a1aa',            // zinc-400

    // Extended semantic
    success: '#22c55e',
    successForeground: '#fafafa',
    warning: '#f59e0b',
    warningForeground: '#18181b',
    info: '#3b82f6',
    infoForeground: '#fafafa',
    danger: '#ef4444',
    dangerForeground: '#fafafa',

    // Sidebar (dark)
    sidebar: '#18181b',
    sidebarForeground: '#fafafa',
    sidebarAccent: '#27272a',
    sidebarBorder: '#27272a',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
  },
  borderRadius: {
    none: 0,
    sm: 4,     // Mira: compact
    md: 6,     // Mira: compact
    lg: 8,     // Mira: compact
    xl: 12,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
  },
  typography: {
    xs: { fontSize: 12, lineHeight: 16 },
    sm: { fontSize: 14, lineHeight: 20 },
    base: { fontSize: 16, lineHeight: 24 },
    lg: { fontSize: 18, lineHeight: 28 },
    xl: { fontSize: 20, lineHeight: 28 },
    '2xl': { fontSize: 24, lineHeight: 32 },
    '3xl': { fontSize: 30, lineHeight: 36 },
  },
};

/**
 * React-Native tokens aligned with the web "Real Estate Palette".
 *
 * Source of truth (web): `apps/client-dashboard/src/app/globals.css`
 * - Kimchi (accent): #ED4B00
 * - Midnight Blue (foreground/dark bg): #020035
 * - Dark Royalty (muted-foreground): #02066F
 * - Deep Sea (info): #2000B1
 * - Anti-Flash White (background): #F2F3F4
 * - Lace Cap (muted/secondary): #EBEAED
 */
export const nativeTokensRealEstate = {
  ...nativeTokens,
  colors: {
    ...nativeTokens.colors,
    // Base palette
    background: '#F2F3F4',
    foreground: '#020035',
    card: '#F2F3F4',
    cardForeground: '#020035',
    primary: '#ED4B00',
    primaryForeground: '#FFFFFF',
    secondary: '#EBEAED',
    secondaryForeground: '#020035',
    muted: '#EBEAED',
    mutedForeground: '#02066F',
    neutral: '#02066F',
    accent: '#EBEAED',
    accentForeground: '#020035',
    border: '#DEDDE3',
    input: '#DEDDE3',
    ring: '#ED4B00',

    // Extended semantic
    success: '#16A34A',
    successForeground: '#F2F3F4',
    warning: '#F59E0B',
    warningForeground: '#020035',
    info: '#2000B1',
    infoForeground: '#F2F3F4',
    danger: '#DC2626',
    dangerForeground: '#F2F3F4',

    // Optional dark surfaces (useful for headers/nav)
    sidebar: '#020035',
    sidebarForeground: '#F2F3F4',
    sidebarAccent: '#02066F',
    sidebarBorder: '#02066F',
  },
};

export type DesignTokens = typeof tokens;
