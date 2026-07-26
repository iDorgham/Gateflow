import {
  buildShortLinkAttribution,
  getAttributionRateLimitKey,
} from './utm-attribution';

const link = {
  id: 'link-1',
  organizationId: 'org-1',
  projectId: 'project-1',
};

describe('short-link UTM attribution', () => {
  it('derives tenant ownership from the stored link and bounds untrusted labels', () => {
    const params = new URLSearchParams({
      utm_source: '  newsletter  ',
      utm_medium: 'email',
      utm_campaign: 'summer-access',
      utm_content: 'a'.repeat(129),
      utm_term: 'unsafe\u0000term',
    });

    expect(buildShortLinkAttribution(link, params, 'Browser/1.0')).toEqual({
      shortLinkId: 'link-1',
      organizationId: 'org-1',
      projectId: 'project-1',
      utmSource: 'newsletter',
      utmMedium: 'email',
      utmCampaign: 'summer-access',
      utmContent: null,
      utmTerm: null,
      deviceInfo: { userAgent: 'Browser/1.0' },
    });
  });

  it('omits client IP and rejects oversized user-agent metadata', () => {
    const result = buildShortLinkAttribution(
      link,
      new URLSearchParams(),
      'x'.repeat(257)
    );

    expect(result.deviceInfo).toBeNull();
    expect(JSON.stringify(result)).not.toContain('ip');
  });

  it('hashes the network identifier used for abuse control', () => {
    const key = getAttributionRateLimitKey('link-1', '203.0.113.42');

    expect(key).toMatch(/^short-link-click:link-1:[a-f0-9]{64}$/);
    expect(key).not.toContain('203.0.113.42');
  });
});
