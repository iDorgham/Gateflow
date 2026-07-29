import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  PORTAL_I18N_POLICY,
  resolveHtmlDocumentAttrs,
  toLogicalSpacingClass,
} from './portal-i18n.ts';
import { resolveOrganizationId } from './session-claims.ts';
import {
  resolveResidentApiBase,
  resolveResidentRewriteDestination,
} from './api-upstream.ts';
import { resolveDisplayedQrCode } from './qr-display.ts';
import { joinResidentApiPath } from './resident-api-url.ts';

describe('portal i18n policy (Phase 09)', () => {
  it('documents interim EN-only with explicit LTR until AR ships', () => {
    assert.equal(PORTAL_I18N_POLICY.mode, 'en-only-interim');
    assert.equal(PORTAL_I18N_POLICY.defaultLocale, 'en');
    assert.equal(PORTAL_I18N_POLICY.defaultDir, 'ltr');
    assert.match(PORTAL_I18N_POLICY.rationale, /logical CSS/i);
    assert.ok(PORTAL_I18N_POLICY.deferralExpiry);
  });

  it('resolves html lang/dir for default EN', () => {
    assert.deepEqual(resolveHtmlDocumentAttrs(), {
      lang: 'en',
      dir: 'ltr',
    });
  });

  it('maps physical spacing utilities to logical equivalents', () => {
    assert.equal(toLogicalSpacingClass('ml-2'), 'ms-2');
    assert.equal(toLogicalSpacingClass('mr-3'), 'me-3');
    assert.equal(toLogicalSpacingClass('pl-9'), 'ps-9');
    assert.equal(toLogicalSpacingClass('pr-4'), 'pe-4');
    assert.equal(toLogicalSpacingClass('left-3'), 'start-3');
    assert.equal(toLogicalSpacingClass('right-6'), 'end-6');
    assert.equal(toLogicalSpacingClass('text-left'), 'text-start');
    assert.equal(toLogicalSpacingClass('text-right'), 'text-end');
    assert.equal(toLogicalSpacingClass('flex-1'), 'flex-1');
  });
});

describe('Phase 06–07 regression extras', () => {
  it('resolveOrganizationId ignores whitespace-only orgId', () => {
    assert.equal(
      resolveOrganizationId({ orgId: '   ', org: 'org-fallback' }),
      'org-fallback'
    );
  });

  it('rewrite destination fails closed in production without upstream', () => {
    assert.throws(
      () =>
        resolveResidentRewriteDestination({
          NODE_ENV: 'production',
        }),
      /RESIDENT_API_UPSTREAM|NEXT_PUBLIC_API_URL/
    );
  });

  it('resolveResidentApiBase strips trailing slash from NEXT_PUBLIC_API_URL', () => {
    assert.equal(
      resolveResidentApiBase({
        NEXT_PUBLIC_API_URL: 'https://app.example/api/',
        NODE_ENV: 'production',
      }),
      'https://app.example/api'
    );
  });

  it('resolveDisplayedQrCode returns null when both sources empty', () => {
    assert.deepEqual(
      resolveDisplayedQrCode({
        liveCode: '',
        cachedCode: '  ',
        isOnline: true,
      }),
      { code: null, source: null }
    );
    assert.deepEqual(
      resolveDisplayedQrCode({
        liveCode: null,
        cachedCode: undefined,
        isOnline: false,
      }),
      { code: null, source: null }
    );
  });

  it('resolveDisplayedQrCode uses cache when online but live missing', () => {
    assert.deepEqual(
      resolveDisplayedQrCode({
        liveCode: null,
        cachedCode: 'cached-only',
        isOnline: true,
      }),
      { code: 'cached-only', source: 'cache' }
    );
  });

  it('joinResidentApiPath joins base and path without double slash', () => {
    assert.equal(
      joinResidentApiPath('https://app.example/api', '/resident/visitors'),
      'https://app.example/api/resident/visitors'
    );
    assert.equal(
      joinResidentApiPath('https://app.example/api/', 'resident/history'),
      'https://app.example/api/resident/history'
    );
  });
});
