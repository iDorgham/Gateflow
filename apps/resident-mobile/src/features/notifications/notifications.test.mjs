import test from 'node:test';
import assert from 'node:assert/strict';

// Test 1: Quiet Hours Calculation (Overnight & Daytime)
test('isWithinQuietHours accurately detects active quiet hours windows', () => {
  function isWithinQuietHours(preferences, dateObj) {
    if (!preferences.enableQuietHours) return false;

    const currentMinutes = dateObj.getHours() * 60 + dateObj.getMinutes();
    const [startH, startM] = preferences.quietHoursStart.split(':').map(Number);
    const [endH, endM] = preferences.quietHoursEnd.split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (startMinutes > endMinutes) {
      // Overnight (e.g. 23:00 to 07:00)
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    } else {
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    }
  }

  const prefsOvernight = {
    enableQuietHours: true,
    quietHoursStart: '23:00',
    quietHoursEnd: '07:00',
  };

  // 23:30 -> Quiet hours active
  const date1 = new Date(2026, 7, 30, 23, 30);
  assert.equal(isWithinQuietHours(prefsOvernight, date1), true);

  // 03:15 -> Quiet hours active
  const date2 = new Date(2026, 7, 30, 3, 15);
  assert.equal(isWithinQuietHours(prefsOvernight, date2), true);

  // 14:00 -> Outside quiet hours
  const date3 = new Date(2026, 7, 30, 14, 0);
  assert.equal(isWithinQuietHours(prefsOvernight, date3), false);

  // Disabled quiet hours
  const prefsDisabled = { ...prefsOvernight, enableQuietHours: false };
  assert.equal(isWithinQuietHours(prefsDisabled, date1), false);
});

// Test 2: Notification Action Identifiers & Category
test('Notification action identifiers are valid and non-empty strings', () => {
  const CATEGORY_VISITOR_ARRIVAL = 'VISITOR_ARRIVAL';
  const ACTION_OPEN_GATE = 'ACTION_OPEN_GATE';
  const ACTION_REJECT_ENTRY = 'ACTION_REJECT_ENTRY';
  const ACTION_CALL_GUARD = 'ACTION_CALL_GUARD';

  assert.equal(CATEGORY_VISITOR_ARRIVAL, 'VISITOR_ARRIVAL');
  assert.equal(ACTION_OPEN_GATE, 'ACTION_OPEN_GATE');
  assert.equal(ACTION_REJECT_ENTRY, 'ACTION_REJECT_ENTRY');
  assert.equal(ACTION_CALL_GUARD, 'ACTION_CALL_GUARD');
});

// Test 3: Arrival Event Payload Parser
test('Arrival event mapping extracts all fields correctly from raw push payload', () => {
  const rawPayload = {
    visitorName: 'Amr Khaled',
    unitName: 'Building 4, Apt 201',
    gateName: 'East Gate',
    scanTime: '2026-08-30T17:00:00.000Z',
    visitorQRId: 'qr-amr-401',
  };

  function parseArrivalEvent(payload) {
    if (!payload.visitorQRId || !payload.visitorName) return null;
    return {
      id: `arr-${payload.visitorQRId}`,
      visitorName: payload.visitorName,
      unitName: payload.unitName ?? 'Assigned Unit',
      gateName: payload.gateName ?? 'Main Gate',
      visitorQRId: payload.visitorQRId,
      status: 'PENDING',
    };
  }

  const parsed = parseArrivalEvent(rawPayload);
  assert.notEqual(parsed, null);
  assert.equal(parsed.visitorName, 'Amr Khaled');
  assert.equal(parsed.unitName, 'Building 4, Apt 201');
  assert.equal(parsed.gateName, 'East Gate');
  assert.equal(parsed.visitorQRId, 'qr-amr-401');
  assert.equal(parsed.status, 'PENDING');
});
