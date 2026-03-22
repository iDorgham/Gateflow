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
    // Atlassian Semantic Tokens (Updated)
    ds: {
      background: {
        default: 'var(--ds-background-default)',
        subtle: 'var(--ds-background-subtle)',
        neutral: 'var(--ds-background-neutral)',
        'neutral-subtle': 'var(--ds-background-neutral-subtle)',
        'neutral-hovered': 'var(--ds-background-neutral-hovered)',
        selected: 'var(--ds-background-selected)',
        card: 'var(--ds-background-card)',
        brand: {
          bold: 'var(--ds-background-brand-bold)',
          subtle: 'var(--ds-background-brand-subtle)',
        },
        danger: {
          bold: 'var(--ds-background-danger-bold)',
          subtle: 'var(--ds-background-danger-subtle)',
        },
        warning: {
          bold: 'var(--ds-background-warning-bold)',
          subtle: 'var(--ds-background-warning-subtle)',
        },
        success: {
          bold: 'var(--ds-background-success-bold)',
          subtle: 'var(--ds-background-success-subtle)',
        },
        information: {
          bold: 'var(--ds-background-information-bold)',
          subtle: 'var(--ds-background-information-subtle)',
        },
        input: 'var(--ds-background-input)',
      },
      text: {
        DEFAULT: 'var(--ds-text)',
        subtle: 'var(--ds-text-subtle)',
        subtlest: 'var(--ds-text-subtlest)',
        disabled: 'var(--ds-text-disabled)',
        inverse: 'var(--ds-text-inverse)',
        selected: 'var(--ds-text-selected)',
        brand: 'var(--ds-text-brand)',
        danger: 'var(--ds-text-danger)',
        warning: 'var(--ds-text-warning)',
        success: 'var(--ds-text-success)',
        information: 'var(--ds-text-information)',
      },
      border: {
        DEFAULT: 'var(--ds-border)',
        bold: 'var(--ds-border-bold)',
        subtle: 'var(--ds-border-subtle)',
        focused: 'var(--ds-border-focused)',
        selected: 'var(--ds-border-selected)',
        brand: 'var(--ds-border-brand)',
        danger: 'var(--ds-border-danger)',
        warning: 'var(--ds-border-warning)',
        success: 'var(--ds-border-success)',
        input: 'var(--ds-border-input)',
      },
      icon: {
        DEFAULT: 'var(--ds-icon)',
        subtle: 'var(--ds-icon-subtle)',
        inverse: 'var(--ds-icon-inverse)',
        brand: 'var(--ds-icon-brand)',
        danger: 'var(--ds-icon-danger)',
        warning: 'var(--ds-icon-warning)',
        success: 'var(--ds-icon-success)',
      },
      surface: {
        DEFAULT: 'var(--ds-surface)',
        sunken: 'var(--ds-surface-sunken)',
        raised: 'var(--ds-surface-raised)',
        overlay: 'var(--ds-surface-overlay)',
      },
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
    },
  },
  spacing: {
    'space-0': '0rem',
    'space-050': 'var(--ds-space-050)',
    'space-100': 'var(--ds-space-100)',
    'space-150': 'var(--ds-space-150)',
    'space-200': 'var(--ds-space-200)',
    'space-250': 'var(--ds-space-250)',
    'space-300': 'var(--ds-space-300)',
    'space-400': 'var(--ds-space-400)',
    'space-500': 'var(--ds-space-500)',
    'space-600': 'var(--ds-space-600)',
  },
  typography: {
    fontFamily: {
      sans: 'var(--ds-font-family-sans)',
      heading: 'var(--ds-font-family-heading)',
      mono: 'var(--ds-font-family-mono)',
    },
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: {
    DEFAULT: 'var(--ds-border-radius)',
    xsmall: 'var(--ds-radius-xsmall)',
    small: 'var(--ds-radius-small)',
    medium: 'var(--ds-radius-medium)',
    large: 'var(--ds-radius-large)',
    circle: 'var(--ds-radius-circle)',
    sm: 'var(--ds-border-radius-sm)',
    lg: 'var(--ds-border-radius-lg)',
    full: '9999px',
  },
  // Added breakpoints for Grid Beta
  screens: {
    xs: '600px',
    sm: '768px',
    md: '992px',
    lg: '1200px',
  },
};

/* ── React-Native tokens (Zinc palette in hex, no CSS vars) ─────────────── */

export const nativeTokens = {
  colors: {
    // Atlassian Neutral scale
    neutral10: '#FFFFFF',
    neutral20: '#F4F5F7',
    neutral30: '#EBECF0',
    neutral40: '#DFE1E6',
    neutral50: '#C1C7D0',
    neutral60: '#A5ADBA',
    neutral70: '#97A0AF',
    neutral80: '#8993A4',
    neutral90: '#7A869A',
    neutral100: '#6B778C',
    neutral200: '#5E6C84',
    neutral300: '#505F79',
    neutral400: '#42526E',
    neutral500: '#344563',
    neutral600: '#253858',
    neutral700: '#172B4D',
    neutral800: '#091E42',

    // Semantic
    background: '#FFFFFF',
    foreground: '#172B4D',      // Neutral 700
    card: '#FFFFFF',
    cardForeground: '#172B4D',
    primary: '#0052CC',         // Atlassian Blue
    primaryForeground: '#FFFFFF',
    secondary: '#EBECF0',       // Neutral 30
    secondaryForeground: '#42526E',
    muted: '#F4F5F7',           // Neutral 20
    mutedForeground: '#6B778C', // Neutral 100
    neutral: '#6B778C',
    accent: '#DEEBFF',          // Blue 50
    accentForeground: '#0052CC',
    destructive: '#DE350B',     // Red
    destructiveForeground: '#FFFFFF',
    border: '#DFE1E6',          // Neutral 40
    input: '#DFE1E6',
    ring: '#4C9AFF',            // Blue 200

    // Extended semantic
    success: '#36B37E',
    successForeground: '#FFFFFF',
    warning: '#FFAB00',
    warningForeground: '#172B4D',
    info: '#00B8D9',
    infoForeground: '#FFFFFF',
    danger: '#FF5630',
    dangerForeground: '#FFFFFF',

    // Sidebar (Atlassian Blue)
    sidebar: '#0747A6',
    sidebarForeground: '#DEEBFF',
    sidebarAccent: '#0052CC',
    sidebarBorder: '#0052CC',
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
