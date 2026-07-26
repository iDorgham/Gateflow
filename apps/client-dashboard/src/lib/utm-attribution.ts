import { createHash } from 'node:crypto';

const UTM_MAX_LENGTH = 128;
const USER_AGENT_MAX_LENGTH = 256;

interface StoredShortLinkScope {
  id: string;
  organizationId: string;
  projectId: string | null;
}

function boundedLabel(value: string | null, maxLength: number): string | null {
  if (value === null) return null;
  const normalized = value.trim();
  const hasControlCharacter = Array.from(normalized).some((character) => {
    const codePoint = character.codePointAt(0) ?? 0;
    return codePoint <= 31 || codePoint === 127;
  });
  if (
    normalized.length === 0 ||
    normalized.length > maxLength ||
    hasControlCharacter
  ) {
    return null;
  }
  return normalized;
}

export function buildShortLinkAttribution(
  link: StoredShortLinkScope,
  params: URLSearchParams,
  userAgent: string | null
) {
  const safeUserAgent = boundedLabel(userAgent, USER_AGENT_MAX_LENGTH);

  return {
    shortLinkId: link.id,
    organizationId: link.organizationId,
    projectId: link.projectId,
    utmSource: boundedLabel(params.get('utm_source'), UTM_MAX_LENGTH),
    utmMedium: boundedLabel(params.get('utm_medium'), UTM_MAX_LENGTH),
    utmCampaign: boundedLabel(params.get('utm_campaign'), UTM_MAX_LENGTH),
    utmContent: boundedLabel(params.get('utm_content'), UTM_MAX_LENGTH),
    utmTerm: boundedLabel(params.get('utm_term'), UTM_MAX_LENGTH),
    deviceInfo: safeUserAgent ? { userAgent: safeUserAgent } : null,
  };
}

export function getAttributionRateLimitKey(
  shortLinkId: string,
  networkIdentifier: string
): string {
  const fingerprint = createHash('sha256')
    .update(networkIdentifier)
    .digest('hex');
  return `short-link-click:${shortLinkId}:${fingerprint}`;
}
