import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePhoneNumber,
  extractContactDisplayName,
  buildInvitationMessage,
} from './contact-utils.js';

test('normalizePhoneNumber removes spaces, hyphens, and parentheses', () => {
  assert.equal(normalizePhoneNumber('+20 (10) 1234-5678'), '+201012345678');
  assert.equal(normalizePhoneNumber('010 1234 5678'), '01012345678');
  assert.equal(normalizePhoneNumber(''), '');
});

test('extractContactDisplayName formats names correctly', () => {
  assert.equal(
    extractContactDisplayName({ name: 'Ahmed Hassan', firstName: 'Ahmed' }),
    'Ahmed Hassan'
  );
  assert.equal(
    extractContactDisplayName({ firstName: 'Fatima', lastName: 'Ali' }),
    'Fatima Ali'
  );
  assert.equal(extractContactDisplayName({}), 'Guest');
});

test('buildInvitationMessage formats localized invitations', () => {
  const enMsg = buildInvitationMessage({
    visitorName: 'Omar',
    shareUrl: 'https://gateflow.site/s/abc12345?sig=sig123',
    unitName: 'Villa 104',
    locale: 'en',
  });
  assert.match(
    enMsg,
    /Hi Omar, your GateFlow access pass to Villa 104 is ready:/
  );
  assert.match(enMsg, /https:\/\/gateflow.site\/s\/abc12345\?sig=sig123/);

  const arMsg = buildInvitationMessage({
    visitorName: 'عمر',
    shareUrl: 'https://gateflow.site/s/abc12345?sig=sig123',
    unitName: 'فيلا 104',
    locale: 'ar',
  });
  assert.match(arMsg, /مرحباً عمر/);
  assert.match(arMsg, /https:\/\/gateflow.site\/s\/abc12345\?sig=sig123/);
});
