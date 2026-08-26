import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getStatusBadgeConfig,
  formatHistoryDateLabel,
  filterHistoryItems,
  parsePushNotificationPayload,
} from './history-utils.js';

test('getStatusBadgeConfig returns appropriate styles and labels', () => {
  const admitted = getStatusBadgeConfig('SUCCESS');
  assert.equal(admitted.label, 'Admitted');
  assert.equal(admitted.bg, '#d1fae5');

  const denied = getStatusBadgeConfig('DENIED');
  assert.equal(denied.label, 'Denied');
  assert.equal(denied.bg, '#fee2e2');

  const expired = getStatusBadgeConfig('EXPIRED');
  assert.equal(expired.label, 'Expired');
});

test('formatHistoryDateLabel outputs relative dates correctly', () => {
  const refDate = new Date('2026-08-24T12:00:00Z');
  assert.equal(
    formatHistoryDateLabel('2026-08-24T08:00:00Z', refDate),
    'Today'
  );
  assert.equal(
    formatHistoryDateLabel('2026-08-23T08:00:00Z', refDate),
    'Yesterday'
  );
});

test('filterHistoryItems accurately filters by status', () => {
  const items = [
    { id: '1', status: 'SUCCESS' },
    { id: '2', status: 'DENIED' },
    { id: '3', status: 'GRANTED' },
  ];

  assert.equal(filterHistoryItems(items, 'all').length, 3);
  assert.equal(filterHistoryItems(items, 'granted').length, 2);
  assert.equal(filterHistoryItems(items, 'denied').length, 1);
});

test('parsePushNotificationPayload routes gate scans to history tab with highlight id', () => {
  const payload = {
    type: 'gate_scan',
    scanId: 'scan-999',
  };
  const parsed = parsePushNotificationPayload(payload);
  assert.notEqual(parsed, null);
  assert.equal(parsed.route, '/(tabs)/history');
  assert.equal(parsed.params.highlightId, 'scan-999');
});
