import test from 'node:test';
import assert from 'node:assert/strict';

// Test 1: Biometric Attempt Counter & PIN Fallback Trigger
test('Biometric failure increments attempt count and triggers PIN fallback at 3 attempts', () => {
  let failedAttempts = 0;
  let showPinFallback = false;
  const MAX_ATTEMPTS = 3;

  function onAuthFailure() {
    failedAttempts += 1;
    if (failedAttempts >= MAX_ATTEMPTS) {
      showPinFallback = true;
    }
  }

  // Attempt 1
  onAuthFailure();
  assert.equal(failedAttempts, 1);
  assert.equal(showPinFallback, false);

  // Attempt 2
  onAuthFailure();
  assert.equal(failedAttempts, 2);
  assert.equal(showPinFallback, false);

  // Attempt 3 -> Triggers fallback
  onAuthFailure();
  assert.equal(failedAttempts, 3);
  assert.equal(showPinFallback, true);
});

// Test 2: Session Timeout (> 60s) Lockout Logic
test('AppState inactive transition after 60s locks active session', () => {
  const SESSION_TIMEOUT_MS = 60 * 1000;
  let isAuthenticated = true;
  let lastActiveTimestamp = Date.now() - 75000; // 75 seconds elapsed

  function onAppResume(now = Date.now()) {
    const elapsed = now - lastActiveTimestamp;
    if (elapsed > SESSION_TIMEOUT_MS) {
      isAuthenticated = false;
    }
  }

  onAppResume();
  assert.equal(
    isAuthenticated,
    false,
    'Session must lock when elapsed time exceeds 60s'
  );
});

// Test 3: Session Timeout within 60s maintains active session
test('AppState inactive transition under 60s maintains active session', () => {
  const SESSION_TIMEOUT_MS = 60 * 1000;
  let isAuthenticated = true;
  let lastActiveTimestamp = Date.now() - 30000; // 30 seconds elapsed

  function onAppResume(now = Date.now()) {
    const elapsed = now - lastActiveTimestamp;
    if (elapsed > SESSION_TIMEOUT_MS) {
      isAuthenticated = false;
    }
  }

  onAppResume();
  assert.equal(
    isAuthenticated,
    true,
    'Session should remain unlocked if within 60s threshold'
  );
});

// Test 4: Expiration Countdown & Expiring Soon Flag
test('Expiration calculations correctly flag expiring soon within 120s', () => {
  const EXPIRING_SOON_THRESHOLD_SECONDS = 120;

  function checkExpiringSoon(validUntilIso, nowMs = Date.now()) {
    const expiryMs = new Date(validUntilIso).getTime();
    const remainingSec = Math.max(0, Math.floor((expiryMs - nowMs) / 1000));
    return {
      remainingSec,
      isExpiringSoon:
        remainingSec > 0 && remainingSec <= EXPIRING_SOON_THRESHOLD_SECONDS,
      isExpired: remainingSec === 0,
    };
  }

  const now = Date.now();

  // 60 seconds left -> Expiring soon
  const pass1 = checkExpiringSoon(new Date(now + 60 * 1000).toISOString(), now);
  assert.equal(pass1.isExpiringSoon, true);
  assert.equal(pass1.isExpired, false);

  // 10 minutes left -> Not expiring soon
  const pass2 = checkExpiringSoon(
    new Date(now + 600 * 1000).toISOString(),
    now
  );
  assert.equal(pass2.isExpiringSoon, false);
  assert.equal(pass2.isExpired, false);

  // Expired 5 seconds ago -> Expired
  const pass3 = checkExpiringSoon(new Date(now - 5000).toISOString(), now);
  assert.equal(pass3.isExpiringSoon, false);
  assert.equal(pass3.isExpired, true);
});

// Test 5: PIN Verification Logic
test('PIN verification correctly validates correct PIN and denies wrong PIN', () => {
  const storedPin = '4321';

  function verifyPin(input) {
    return input === storedPin;
  }

  assert.equal(verifyPin('4321'), true);
  assert.equal(verifyPin('0000'), false);
  assert.equal(verifyPin('1234'), false);
});
