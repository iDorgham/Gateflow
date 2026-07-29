/**
 * Resident Portal i18n / document direction policy (Phase 09).
 *
 * Interim: EN-only with explicit `lang` + `dir="ltr"`. Full AR/RTL locale
 * routing is deferred — prefer logical CSS (`ms`/`me`/`ps`/`pe`/`start`/`end`)
 * on touched P0 UI so RTL can flip later without rewriting layouts.
 */

export type PortalTextDirection = 'ltr' | 'rtl';

export type PortalI18nPolicy = {
  mode: 'en-only-interim';
  defaultLocale: 'en';
  defaultDir: PortalTextDirection;
  rationale: string;
  /** ISO date — AR/RTL content pack owner decision expires */
  deferralExpiry: string;
  deferralOwner: string;
};

export const PORTAL_I18N_POLICY: PortalI18nPolicy = {
  mode: 'en-only-interim',
  defaultLocale: 'en',
  defaultDir: 'ltr',
  rationale:
    'Ship measurable EN pilot evidence with logical CSS on P0 routes; defer full AR content pack until Phase 10+ owner signs off.',
  deferralExpiry: '2026-08-31',
  deferralOwner: 'resident-portal-pilot',
};

export function resolveHtmlDocumentAttrs(locale?: string | null): {
  lang: string;
  dir: PortalTextDirection;
} {
  const normalized =
    typeof locale === 'string' && locale.trim().length > 0
      ? locale.trim().toLowerCase()
      : PORTAL_I18N_POLICY.defaultLocale;

  // Only EN is active; any other locale still renders LTR until AR ships.
  if (normalized === 'ar' || normalized.startsWith('ar-')) {
    return { lang: 'ar', dir: 'rtl' };
  }

  return {
    lang: PORTAL_I18N_POLICY.defaultLocale,
    dir: PORTAL_I18N_POLICY.defaultDir,
  };
}

const PHYSICAL_TO_LOGICAL: Record<string, string> = {
  ml: 'ms',
  mr: 'me',
  pl: 'ps',
  pr: 'pe',
  left: 'start',
  right: 'end',
  'text-left': 'text-start',
  'text-right': 'text-end',
};

/**
 * Map a single Tailwind physical spacing/alignment utility to its logical twin.
 * Unknown classes pass through unchanged.
 */
export function toLogicalSpacingClass(className: string): string {
  const trimmed = className.trim();
  if (PHYSICAL_TO_LOGICAL[trimmed]) {
    return PHYSICAL_TO_LOGICAL[trimmed];
  }

  const match = /^(ml|mr|pl|pr|left|right)-(.+)$/.exec(trimmed);
  if (!match) return trimmed;

  const [, physical, rest] = match;
  const logical = PHYSICAL_TO_LOGICAL[physical];
  return logical ? `${logical}-${rest}` : trimmed;
}
