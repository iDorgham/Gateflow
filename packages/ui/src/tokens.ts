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
    border: 'var(--gf-color-border)',
    input: 'var(--gf-color-border)',
    ring: 'var(--gf-color-primary)',
    background: 'var(--gf-color-bg-page)',
    foreground: 'var(--gf-color-text)',

    primary: {
      DEFAULT: 'var(--gf-color-primary)',
      foreground: 'var(--gf-color-primary-foreground)',
      subtle: 'var(--gf-color-primary-subtle)',
    },
    secondary: {
      DEFAULT: 'var(--gf-color-bg-raised)',
      foreground: 'var(--gf-color-text)',
    },
    destructive: {
      DEFAULT: 'var(--gf-color-danger)',
      foreground: 'var(--gf-color-neutral-0)',
    },
    muted: {
      DEFAULT: 'var(--gf-color-muted)',
      foreground: 'var(--gf-color-muted-foreground)',
    },
    accent: {
      DEFAULT: 'var(--gf-color-bg-raised)',
      foreground: 'var(--gf-color-text)',
    },
    popover: {
      DEFAULT: 'var(--gf-color-bg-raised)',
      foreground: 'var(--gf-color-text)',
    },
    card: {
      DEFAULT: 'var(--gf-color-bg-default)',
      foreground: 'var(--gf-color-text)',
    },
    // Semantic surface levels
    surface: {
      page: 'var(--gf-color-bg-page)',
      subtle: 'var(--gf-color-bg-subtle)',
      default: 'var(--gf-color-bg-default)',
      raised: 'var(--gf-color-bg-raised)',
      overlay: 'var(--gf-color-bg-overlay)',
    },
    // Status
    success: {
      DEFAULT: 'var(--gf-color-success)',
      subtle: 'var(--gf-color-success-subtle)',
      bold: 'var(--gf-color-success-bold)',
    },
    warning: {
      DEFAULT: 'var(--gf-color-warning)',
      subtle: 'var(--gf-color-warning-subtle)',
      bold: 'var(--gf-color-warning-bold)',
    },
    danger: {
      DEFAULT: 'var(--gf-color-danger)',
      subtle: 'var(--gf-color-danger-subtle)',
      bold: 'var(--gf-color-danger-bold)',
    },
    info: {
      DEFAULT: 'var(--gf-color-info)',
      subtle: 'var(--gf-color-info-subtle)',
      bold: 'var(--gf-color-info-bold)',
    },
    // DS namespace — all resolve from --gf-* via globals.css aliases
    ds: {
      background: {
        default: 'var(--ds-background-default)',
        subtle: 'var(--ds-background-neutral-subtle)',
        neutral: 'var(--ds-background-neutral)',
        'neutral-subtle': 'var(--ds-background-neutral-subtle)',
        'neutral-hovered': 'var(--ds-background-neutral-hovered)',
        selected: 'var(--ds-background-selected)',
        card: 'var(--gf-color-bg-default)',
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
          subtle: 'var(--gf-color-warning-subtle)',
        },
        success: {
          bold: 'var(--ds-background-success-bold)',
          subtle: 'var(--gf-color-success-subtle)',
        },
        information: {
          bold: 'var(--ds-background-information-bold)',
          subtle: 'var(--gf-color-info-subtle)',
        },
        input: 'var(--gf-color-bg-default)',
      },
      text: {
        DEFAULT: 'var(--ds-text)',
        heading: 'var(--ds-text)',
        subtle: 'var(--ds-text-subtle)',
        subtlest: 'var(--ds-text-subtlest)',
        disabled: 'var(--gf-color-neutral-400)',
        inverse: 'var(--ds-text-inverse)',
        selected: 'var(--ds-text-selected)',
        brand: 'var(--ds-text-brand)',
        danger: 'var(--ds-text-danger)',
        warning: 'var(--gf-color-text-warning)',
        success: 'var(--gf-color-text-success)',
        information: 'var(--gf-color-info)',
      },
      border: {
        DEFAULT: 'var(--ds-border)',
        bold: 'var(--ds-border-bold)',
        subtle: 'var(--ds-border-subtle)',
        focused: 'var(--ds-border-focused)',
        selected: 'var(--gf-color-primary)',
        brand: 'var(--ds-border-brand)',
        danger: 'var(--gf-color-danger)',
        warning: 'var(--gf-color-warning)',
        success: 'var(--gf-color-success)',
        input: 'var(--gf-color-border)',
      },
      icon: {
        DEFAULT: 'var(--gf-color-text)',
        subtle: 'var(--gf-color-text-subtle)',
        inverse: 'var(--gf-color-text-inverse)',
        brand: 'var(--gf-color-text-brand)',
        danger: 'var(--gf-color-danger)',
        warning: 'var(--gf-color-warning)',
        success: 'var(--gf-color-success)',
      },
      surface: {
        DEFAULT: 'var(--gf-color-bg-default)',
        sunken: 'var(--gf-color-bg-subtle)',
        raised: 'var(--gf-color-bg-raised)',
        overlay: 'var(--gf-color-bg-overlay)',
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
    neutral10: 'rgb(255, 255, 255)',
    neutral20: 'rgb(244, 245, 247)',
    neutral30: 'rgb(235, 236, 240)',
    neutral40: 'rgb(223, 225, 230)',
    neutral50: 'rgb(193, 199, 208)',
    neutral60: 'rgb(165, 173, 186)',
    neutral70: 'rgb(151, 160, 175)',
    neutral80: 'rgb(137, 147, 164)',
    neutral90: 'rgb(122, 134, 154)',
    neutral100: 'rgb(107, 119, 140)',
    neutral200: 'rgb(94, 108, 132)',
    neutral300: 'rgb(80, 95, 121)',
    neutral400: 'rgb(66, 82, 110)',
    neutral500: 'rgb(52, 69, 99)',
    neutral600: 'rgb(37, 56, 88)',
    neutral700: 'rgb(23, 43, 77)',
    neutral800: 'rgb(9, 30, 66)',

    // Semantic
    background: 'rgb(255, 255, 255)',
    foreground: 'rgb(23, 43, 77)', // Neutral 700
    card: 'rgb(255, 255, 255)',
    cardForeground: 'rgb(23, 43, 77)',
    primary: 'rgb(0, 82, 204)', // Atlassian Blue
    primaryForeground: 'rgb(255, 255, 255)',
    secondary: 'rgb(235, 236, 240)', // Neutral 30
    secondaryForeground: 'rgb(66, 82, 110)',
    muted: 'rgb(244, 245, 247)', // Neutral 20
    mutedForeground: 'rgb(107, 119, 140)', // Neutral 100
    neutral: 'rgb(107, 119, 140)',
    accent: 'rgb(222, 235, 255)', // Blue 50
    accentForeground: 'rgb(0, 82, 204)',
    destructive: 'rgb(222, 53, 11)', // Red
    destructiveForeground: 'rgb(255, 255, 255)',
    border: 'rgb(223, 225, 230)', // Neutral 40
    input: 'rgb(223, 225, 230)',
    ring: 'rgb(76, 154, 255)', // Blue 200

    // Extended semantic
    success: 'rgb(54, 179, 126)',
    successForeground: 'rgb(255, 255, 255)',
    warning: 'rgb(255, 171, 0)',
    warningForeground: 'rgb(23, 43, 77)',
    info: 'rgb(0, 184, 217)',
    infoForeground: 'rgb(255, 255, 255)',
    danger: 'rgb(255, 86, 48)',
    dangerForeground: 'rgb(255, 255, 255)',

    // Sidebar (Atlassian Blue)
    sidebar: 'rgb(7, 71, 166)',
    sidebarForeground: 'rgb(222, 235, 255)',
    sidebarAccent: 'rgb(0, 82, 204)',
    sidebarBorder: 'rgb(0, 82, 204)',
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
    sm: 4, // Mira: compact
    md: 6, // Mira: compact
    lg: 8, // Mira: compact
    xl: 12,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: 'rgb(0, 0, 0)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: 'rgb(0, 0, 0)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: 'rgb(0, 0, 0)',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 5,
    },
    xl: {
      shadowColor: 'rgb(0, 0, 0)',
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
 * - Kimchi (accent)
 * - Midnight Blue (foreground/dark bg)
 * - Dark Royalty (muted-foreground)
 * - Deep Sea (info)
 * - Anti-Flash White (background)
 * - Lace Cap (muted/secondary)
 */
export const nativeTokensRealEstate = {
  ...nativeTokens,
  colors: {
    ...nativeTokens.colors,
    // Base palette
    background: 'rgb(242, 243, 244)',
    foreground: 'rgb(2, 0, 53)',
    card: 'rgb(242, 243, 244)',
    cardForeground: 'rgb(2, 0, 53)',
    primary: 'rgb(237, 75, 0)',
    primaryForeground: 'rgb(255, 255, 255)',
    secondary: 'rgb(235, 234, 237)',
    secondaryForeground: 'rgb(2, 0, 53)',
    muted: 'rgb(235, 234, 237)',
    mutedForeground: 'rgb(2, 6, 111)',
    neutral: 'rgb(2, 6, 111)',
    accent: 'rgb(235, 234, 237)',
    accentForeground: 'rgb(2, 0, 53)',
    border: 'rgb(222, 221, 227)',
    input: 'rgb(222, 221, 227)',
    ring: 'rgb(237, 75, 0)',

    // Extended semantic
    success: 'rgb(22, 163, 74)',
    successForeground: 'rgb(242, 243, 244)',
    warning: 'rgb(245, 158, 11)',
    warningForeground: 'rgb(2, 0, 53)',
    info: 'rgb(32, 0, 177)',
    infoForeground: 'rgb(242, 243, 244)',
    danger: 'rgb(220, 38, 38)',
    dangerForeground: 'rgb(242, 243, 244)',

    // Optional dark surfaces (useful for headers/nav)
    sidebar: 'rgb(2, 0, 53)',
    sidebarForeground: 'rgb(242, 243, 244)',
    sidebarAccent: 'rgb(2, 6, 111)',
    sidebarBorder: 'rgb(2, 6, 111)',
  },
};

/**
 * React-Native tokens for the "New Era" - Satin-Charcoal & Kimchi Profile.
 * Aligned with Phase 7 Mobile Optimization.
 */
export const nativeTokensNewEra = {
  colors: {
    // Satin-Charcoal Depth (L8-L22)
    background: '#0c0d10', // oklch(8% 0.015 250)
    surfaceSubtle: '#131418', // oklch(11% 0.015 250)
    surfaceRaised: '#1a1c21', // oklch(14% 0.02 250)
    surfaceOverlay: '#2d3037', // oklch(22% 0.02 250)
    surfaceGlass: 'rgba(255, 255, 255, 0.03)',
    borderGlass: 'rgba(255, 255, 255, 0.08)',
    backdropGlass: 'rgba(0, 0, 0, 0.85)',

    // Accents (Kimchi Default)
    primary: '#ed4b00', // oklch(62% 0.22 35)
    primarySubtle: 'rgba(237, 75, 0, 0.15)',
    primaryBold: '#ff5c0a',

    // Accents (Secondary Profiles)
    cobalt: '#0052cc',
    emerald: '#00875a',

    // Text & Icons
    textHeading: '#f1f5f9',
    textPrimary: '#cbd5e1',
    textSubtle: '#94a3b8',
    textSubtlest: '#64748b',
    textInverse: '#ffffff',
    textBrand: '#ff5c0a',

    // Border & UI
    border: '#2d3037',
    borderSubtle: '#1e293b',
    borderBold: '#475569',
    input: '#131418',
    ring: '#ed4b00',

    // Status
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',

    // Status Subtle (Translucents)
    successSubtle: 'rgba(34, 197, 94, 0.1)',
    warningSubtle: 'rgba(245, 158, 11, 0.1)',
    dangerSubtle: 'rgba(239, 68, 68, 0.1)',
    infoSubtle: 'rgba(59, 130, 246, 0.1)',
  },
  spacing: {
    'space-050': 4,
    'space-100': 8,
    'space-150': 12,
    'space-200': 16,
    'space-300': 24,
    'space-400': 32,
    'space-500': 40,
    'space-600': 48,
  },
  shadows: {
    brandGlow: {
      shadowColor: '#ed4b00',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 15,
      elevation: 10,
    },
    satinRaised: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 6,
    },
    satinOverlay: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.5,
      shadowRadius: 24,
      elevation: 12,
    },
  },
  typography: {
    // Sentinel Style Tracking (0.4em mapped to approx letterSpacing)
    headerTracking: 3.5,
    subtitleTracking: 1.5,
    fontFamily: {
      sans: 'System', // Fallback, apps will map to Cairo/Inter
      heading: 'System',
      mono: 'Courier',
    },
  },
};

export type DesignTokens = typeof tokens;
