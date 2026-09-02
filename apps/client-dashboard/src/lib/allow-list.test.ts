import {
  isIpAllowed,
  normalizeAllowList,
  ipToBuffer,
  allowListFingerprint,
} from './allow-list';

describe('allow-list engine', () => {
  it('allows everything when the list is empty', () => {
    expect(isIpAllowed('203.0.113.5', [])).toBe(true);
  });

  it('matches exact IPv4 and IPv6 addresses', () => {
    expect(isIpAllowed('203.0.113.5', ['203.0.113.5'])).toBe(true);
    expect(isIpAllowed('203.0.113.6', ['203.0.113.5'])).toBe(false);
    expect(isIpAllowed('2001:db8::1', ['2001:db8::1'])).toBe(true);
    expect(isIpAllowed('2001:db8::2', ['2001:db8::1'])).toBe(false);
  });

  it('matches IPv4 CIDR ranges', () => {
    expect(isIpAllowed('203.0.113.7', ['203.0.113.0/24'])).toBe(true);
    expect(isIpAllowed('203.0.114.1', ['203.0.113.0/24'])).toBe(false);
    expect(isIpAllowed('10.1.2.3', ['10.0.0.0/8'])).toBe(true);
  });

  it('matches IPv6 CIDR ranges', () => {
    expect(isIpAllowed('2001:db8:1234::5', ['2001:db8::/32'])).toBe(true);
    expect(isIpAllowed('2001:db9::1', ['2001:db8::/32'])).toBe(false);
  });

  it('supports the * allow-all and none deny-all tokens', () => {
    expect(isIpAllowed('203.0.113.9', ['*'])).toBe(true);
    expect(isIpAllowed('203.0.113.9', ['none'])).toBe(false);
    expect(isIpAllowed('2001:db8::9', ['*'])).toBe(true);
  });

  it('is case-insensitive for IPv6 entries', () => {
    const list = ['2001:DB8::1'];
    expect(isIpAllowed('2001:db8::1', list)).toBe(true);
  });

  it('rejects malformed addresses', () => {
    expect(isIpAllowed('not-an-ip', ['not-an-ip'])).toBe(false);
    expect(ipToBuffer('999.1.1.1')).toBeNull();
    expect(ipToBuffer('gg::1')).toBeNull();
    expect(ipToBuffer('1:2:3:4:5:6:7:8:9')).toBeNull();
  });

  it('normalizes valid entries and reports invalid ones', () => {
    const res = normalizeAllowList([
      '203.0.113.0/24',
      'garbage',
      '2001:db8::/32',
    ]);
    expect(res.valid).toBe(false);
    expect(res.entries).toContain('203.0.113.0/24');
    expect(res.entries).toContain('2001:db8::/32');
    expect(res.errors.some((e) => e.includes('garbage'))).toBe(true);
  });

  it('validates a fully valid list', () => {
    const res = normalizeAllowList(['203.0.113.5', '10.0.0.0/8']);
    expect(res.valid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it('rejects non-array inputs', () => {
    const res = normalizeAllowList('nope' as unknown);
    expect(res.valid).toBe(false);
  });

  it('produces a stable fingerprint independent of order', () => {
    expect(allowListFingerprint(['1.1.1.1', '2.2.2.2'])).toBe(
      allowListFingerprint(['2.2.2.2', '1.1.1.1'])
    );
  });

  it('parses the reserved tokens via normalization without errors', () => {
    const res = normalizeAllowList(['*', 'none']);
    expect(res.valid).toBe(true);
    expect(res.entries).toContain('*');
    expect(res.entries).toContain('none');
  });
});
