import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  THEME_BOOTSTRAP_SCRIPT,
  THEME_COOKIE_NAME,
  THEME_STORAGE_KEY,
  parseTheme,
  readThemeFromCookieHeader,
  resolveThemeCookieDomain,
  serializeThemeCookie,
} from './cookie';

describe('parseTheme', () => {
  it('accepts light, dark, and system', () => {
    assert.equal(parseTheme('light'), 'light');
    assert.equal(parseTheme('dark'), 'dark');
    assert.equal(parseTheme('system'), 'system');
    assert.equal(parseTheme('DARK'), 'dark');
  });

  it('rejects unknown values', () => {
    assert.equal(parseTheme('dim'), undefined);
    assert.equal(parseTheme(''), undefined);
    assert.equal(parseTheme(null), undefined);
  });
});

describe('resolveThemeCookieDomain', () => {
  it('uses the parent domain on gateflow.site hosts', () => {
    assert.equal(resolveThemeCookieDomain('gateflow.site'), '.gateflow.site');
    assert.equal(resolveThemeCookieDomain('app.gateflow.site'), '.gateflow.site');
    assert.equal(
      resolveThemeCookieDomain('portal.gateflow.site'),
      '.gateflow.site'
    );
    assert.equal(
      resolveThemeCookieDomain('www.gateflow.site'),
      '.gateflow.site'
    );
    assert.equal(
      resolveThemeCookieDomain('design.gateflow.site'),
      '.gateflow.site'
    );
    assert.equal(
      resolveThemeCookieDomain('admin.gateflow.site'),
      '.gateflow.site'
    );
  });

  it('stays host-only on localhost, IPs, and preview hosts', () => {
    assert.equal(resolveThemeCookieDomain('localhost'), undefined);
    assert.equal(resolveThemeCookieDomain('127.0.0.1'), undefined);
    assert.equal(resolveThemeCookieDomain('::1'), undefined);
    assert.equal(
      resolveThemeCookieDomain('gateflow-client-dashboard.vercel.app'),
      undefined
    );
    assert.equal(resolveThemeCookieDomain('example.com'), undefined);
  });
});

describe('serializeThemeCookie', () => {
  it('sets Domain on production GateFlow hosts', () => {
    const cookie = serializeThemeCookie('dark', {
      hostname: 'app.gateflow.site',
      secure: true,
    });
    assert.match(cookie, new RegExp(`^${THEME_COOKIE_NAME}=dark;`));
    assert.match(cookie, /Domain=\.gateflow\.site/);
    assert.match(cookie, /Secure/);
    assert.match(cookie, /SameSite=Lax/);
    assert.match(cookie, /Path=\//);
  });

  it('omits Domain and Secure on local http', () => {
    const cookie = serializeThemeCookie('light', {
      hostname: 'localhost',
      secure: false,
    });
    assert.equal(cookie.includes('Domain='), false);
    assert.equal(cookie.includes('Secure'), false);
    assert.match(cookie, /^gateflow-theme=light;/);
  });
});

describe('readThemeFromCookieHeader', () => {
  it('reads the shared cookie', () => {
    assert.equal(
      readThemeFromCookieHeader('gf_locale=en; gateflow-theme=dark; other=1'),
      'dark'
    );
  });

  it('falls back to a legacy theme cookie', () => {
    assert.equal(readThemeFromCookieHeader('theme=light'), 'light');
  });

  it('prefers the shared cookie over a legacy theme cookie', () => {
    assert.equal(
      readThemeFromCookieHeader('theme=light; gateflow-theme=dark'),
      'dark'
    );
  });

  it('ignores invalid values', () => {
    assert.equal(readThemeFromCookieHeader('gateflow-theme=neon'), undefined);
  });
});

describe('THEME_BOOTSTRAP_SCRIPT', () => {
  it('copies the shared cookie key into localStorage', () => {
    assert.equal(THEME_BOOTSTRAP_SCRIPT.includes(THEME_STORAGE_KEY), true);
    assert.equal(THEME_BOOTSTRAP_SCRIPT.includes('localStorage.setItem'), true);
    assert.equal(THEME_BOOTSTRAP_SCRIPT.includes('document.cookie'), true);
  });
});
