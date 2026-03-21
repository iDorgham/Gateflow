/**
 * UTM Tracking Capture Utility
 *
 * This utility extracts standard UTM parameters from the URL query string
 * and persists them to sessionStorage to ensure they are available during
 * multi-step guest registration flows.
 */

export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

const UTM_STORAGE_KEY = 'gf_utm_attribution';

/**
 * Capture UTM params from the current URL and store them in sessionStorage.
 * Should be called in a Client Component's useEffect or at the top of a page.
 */
export function captureUtmParams(): UtmParams | null {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const found: UtmParams = {};
  let hasAny = false;

  const mapping: Record<string, keyof UtmParams> = {
    utm_source: 'utmSource',
    utm_medium: 'utmMedium',
    utm_campaign: 'utmCampaign',
    utm_content: 'utmContent',
    utm_term: 'utmTerm',
  };

  for (const [param, key] of Object.entries(mapping)) {
    const val = urlParams.get(param);
    if (val) {
      found[key] = val;
      hasAny = true;
    }
  }

  if (hasAny) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(found));
    return found;
  }

  return getPersistedUtmParams();
}

/**
 * Retrieve previously captured UTM params from sessionStorage.
 */
export function getPersistedUtmParams(): UtmParams | null {
  if (typeof window === 'undefined') return null;

  const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as UtmParams;
    } catch (e) {
      console.error('Failed to parse UTM attribution data', e);
      return null;
    }
  }

  return null;
}

/**
 * Clear UTM params from storage.
 */
export function clearUtmParams(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(UTM_STORAGE_KEY);
}
