export const THEME_STORAGE_KEY = 'gateflow-theme';
export const THEME_COOKIE_NAME = 'gateflow-theme';
export const LEGACY_THEME_STORAGE_KEY = 'theme';
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const THEME_NAMES = ['light', 'dark', 'system'] as const;
export type ThemeName = (typeof THEME_NAMES)[number];

/** Parent domains that should share the theme cookie across subdomains. */
export const SHARED_THEME_PARENT_DOMAINS = ['gateflow.site'] as const;
