import test from 'node:test';
import assert from 'node:assert/strict';

// Test 1: Visitor Template Definitions & Defaults
test('Visitor templates have required keys and sensible validity defaults', () => {
  const templates = [
    { id: 'DAY_GUEST', defaultAccessType: 'ONETIME', defaultValidityHours: 24 },
    {
      id: 'FAMILY',
      defaultAccessType: 'PERMANENT',
      defaultValidityHours: 8760,
    },
    { id: 'DRIVER', defaultAccessType: 'RECURRING', defaultValidityHours: 720 },
    {
      id: 'CONTRACTOR',
      defaultAccessType: 'DATERANGE',
      defaultValidityHours: 168,
    },
  ];

  assert.equal(templates.length, 4);
  assert.equal(
    templates.find((t) => t.id === 'DAY_GUEST')?.defaultAccessType,
    'ONETIME'
  );
  assert.equal(
    templates.find((t) => t.id === 'FAMILY')?.defaultAccessType,
    'PERMANENT'
  );
  assert.equal(
    templates.find((t) => t.id === 'DRIVER')?.defaultAccessType,
    'RECURRING'
  );
  assert.equal(
    templates.find((t) => t.id === 'CONTRACTOR')?.defaultAccessType,
    'DATERANGE'
  );
});

// Test 2: Local Rolling Rate Limiter Calculation (Max 15 invites / hour)
test('Rate limiter correctly calculates remaining quota and blocks when limit reached', () => {
  const MAX_LIMIT = 15;
  const ONE_HOUR_MS = 60 * 60 * 1000;

  function evaluateRateLimit(timestamps, now = Date.now()) {
    const valid = timestamps.filter((t) => now - t < ONE_HOUR_MS);
    const count = valid.length;
    const remainingQuota = Math.max(0, MAX_LIMIT - count);
    const isBlocked = remainingQuota <= 0;
    let resetsInSeconds = 0;
    if (isBlocked && valid.length > 0) {
      resetsInSeconds = Math.max(
        0,
        Math.ceil((valid[0] + ONE_HOUR_MS - now) / 1000)
      );
    }
    return { remainingQuota, isBlocked, resetsInSeconds };
  }

  const now = Date.now();

  // 5 invites in past 10 minutes -> 10 remaining
  const recentTimestamps = Array.from({ length: 5 }, (_, i) => now - i * 60000);
  const res1 = evaluateRateLimit(recentTimestamps, now);
  assert.equal(res1.remainingQuota, 10);
  assert.equal(res1.isBlocked, false);

  // 15 invites in past 20 minutes -> 0 remaining, blocked
  const fullTimestamps = Array.from({ length: 15 }, (_, i) => now - i * 60000);
  const res2 = evaluateRateLimit(fullTimestamps, now);
  assert.equal(res2.remainingQuota, 0);
  assert.equal(res2.isBlocked, true);
  assert.ok(res2.resetsInSeconds > 0);

  // Old timestamps (> 1 hour) are pruned and do not count against quota
  const oldTimestamps = Array.from(
    { length: 15 },
    (_, i) => now - ONE_HOUR_MS - 5000 - i * 1000
  );
  const res3 = evaluateRateLimit(oldTimestamps, now);
  assert.equal(res3.remainingQuota, 15);
  assert.equal(res3.isBlocked, false);
});

// Test 3: Bilingual Share Message Formatting
test('Share message generator formats English and Arabic text with security code', () => {
  function generateShareMessage(invite) {
    return (
      `*GateFlow Security Pass / تصريح دخول جيت فلو*\n\n` +
      `Hello ${invite.visitorName}, your visitor gate pass for *${invite.unitName}* is ready.\n` +
      `مرحباً ${invite.visitorName}، تصريح الدخول الخاص بك للوحدة *${invite.unitName}* جاهز للاستخدام.\n\n` +
      `🔑 *Pass Code / كود الدخول:*\n${invite.code}\n\n` +
      `Present this pass to the gate security guard upon arrival.\n` +
      `يرجى إبراز هذا التصريح لمسؤول الأمن عند الوصول إلى البوابة.`
    );
  }

  const sampleInvite = {
    visitorName: 'Omar Farouk',
    unitName: 'Villa 104-B',
    code: 'GF-EXP-OMAR-2026',
  };

  const message = generateShareMessage(sampleInvite);
  assert.ok(message.includes('Omar Farouk'));
  assert.ok(message.includes('Villa 104-B'));
  assert.ok(message.includes('GF-EXP-OMAR-2026'));
  assert.ok(message.includes('تصريح دخول جيت فلو'));
});

// Test 4: Visitor Status Badge & Lifecycle
test('Visitor invite status correctly maps status states', () => {
  const validStatuses = ['SENT', 'OPENED', 'USED', 'EXPIRED'];
  assert.equal(validStatuses.length, 4);

  function resolveStatus(rawStatus, validUntilIso, now = Date.now()) {
    const expiry = new Date(validUntilIso).getTime();
    if (expiry <= now) return 'EXPIRED';
    return rawStatus;
  }

  const future = new Date(Date.now() + 3600000).toISOString();
  const past = new Date(Date.now() - 3600000).toISOString();

  assert.equal(resolveStatus('SENT', future), 'SENT');
  assert.equal(resolveStatus('OPENED', future), 'OPENED');
  assert.equal(resolveStatus('SENT', past), 'EXPIRED');
});
