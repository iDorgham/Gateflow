import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseLocale,
  resolveLocaleCookieDomain,
  serializeLocaleCookie,
  readLocaleFromCookieHeader,
  LOCALE_COOKIE_NAME,
  LEGACY_LOCALE_COOKIE_NAME,
} from './cookie';

describe('parseLocale', () => {
  it('accepts en and ar-EG', () => {
    assert.equal(parseLocale('en'), 'en');
    assert.equal(parseLocale('ar-EG'), 'ar-EG');
    assert.equal(parseLocale('ar'), 'ar-EG');
  });

  it('rejects unknown values', () => {
    assert.equal(parseLocale(undefined), undefined);
    assert.equal(parseLocale(''), undefined);
    assert.equal(parseLocale('fr'), undefined);
    assert.equal(parseLocale('es'), undefined);
  });
});

describe('resolveLocaleCookieDomain', () => {
  it('uses parent domain on gateflow.site hosts', () => {
    assert.equal(resolveLocaleCookieDomain('gateflow.site'), '.gateflow.site');
    assert.equal(
      resolveLocaleCookieDomain('www.gateflow.site'),
      '.gateflow.site'
    );
    assert.equal(
      resolveLocaleCookieDomain('app.gateflow.site'),
      '.gateflow.site'
    );
    assert.equal(
      resolveLocaleCookieDomain('admin.gateflow.site'),
      '.gateflow.site'
    );
    assert.equal(
      resolveLocaleCookieDomain('portal.gateflow.site'),
      '.gateflow.site'
    );
  });

  it('stays host-only on localhost, IPs, and preview hosts', () => {
    assert.equal(resolveLocaleCookieDomain('localhost'), undefined);
    assert.equal(resolveLocaleCookieDomain('127.0.0.1'), undefined);
    assert.equal(
      resolveLocaleCookieDomain('gateflow-preview.vercel.app'),
      undefined
    );
  });
});

describe('serializeLocaleCookie', () => {
  it('sets Domain on production GateFlow hosts', () => {
    const cookie = serializeLocaleCookie('ar-EG', {
      hostname: 'app.gateflow.site',
      secure: true,
    });
    assert.match(cookie, new RegExp(`^${LOCALE_COOKIE_NAME}=ar-EG`));
    assert.match(cookie, /Domain=\.gateflow\.site/);
    assert.match(cookie, /Secure/);
    assert.match(cookie, /SameSite=Lax/);
  });

  it('omits Domain and Secure on local http', () => {
    const cookie = serializeLocaleCookie('en', {
      hostname: 'localhost',
      secure: false,
    });
    assert.match(cookie, new RegExp(`^${LOCALE_COOKIE_NAME}=en`));
    assert.doesNotMatch(cookie, /Domain=/);
    assert.doesNotMatch(cookie, /Secure/);
  });
});

describe('readLocaleFromCookieHeader', () => {
  it('reads the shared gf_locale cookie', () => {
    const header = `foo=bar; ${LOCALE_COOKIE_NAME}=ar-EG; session=123`;
    assert.equal(readLocaleFromCookieHeader(header), 'ar-EG');
  });

  it('falls back to legacy NEXT_LOCALE cookie', () => {
    const header = `foo=bar; ${LEGACY_LOCALE_COOKIE_NAME}=ar-EG`;
    assert.equal(readLocaleFromCookieHeader(header), 'ar-EG');
  });

  it('prefers gf_locale over legacy NEXT_LOCALE', () => {
    const header = `${LEGACY_LOCALE_COOKIE_NAME}=en; ${LOCALE_COOKIE_NAME}=ar-EG`;
    assert.equal(readLocaleFromCookieHeader(header), 'ar-EG');
  });

  it('ignores invalid values', () => {
    assert.equal(
      readLocaleFromCookieHeader(`${LOCALE_COOKIE_NAME}=invalid`),
      undefined
    );
  });
});
