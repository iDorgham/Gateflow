import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildResidentVisitorRevokePath,
  buildVisitorSharePayload,
  unitMissingMessage,
} from './pilot-ux.ts';

describe('buildResidentVisitorRevokePath', () => {
  it('builds encoded revoke path', () => {
    assert.equal(
      buildResidentVisitorRevokePath('abc/123'),
      '/api/resident/visitors/abc%2F123'
    );
  });

  it('rejects empty id', () => {
    assert.throws(() => buildResidentVisitorRevokePath('  '), /visitorId/);
  });
});

describe('buildVisitorSharePayload', () => {
  it('includes name and code', () => {
    assert.deepEqual(
      buildVisitorSharePayload({
        visitorName: 'Alex',
        qrCode: 'signed-payload',
      }),
      {
        title: 'GateFlow pass for Alex',
        text: 'Your GateFlow guest pass for Alex:\nsigned-payload',
      }
    );
  });

  it('rejects missing code', () => {
    assert.throws(
      () => buildVisitorSharePayload({ visitorName: 'Alex', qrCode: '' }),
      /qrCode/
    );
  });
});

describe('unitMissingMessage', () => {
  it('returns distinct copy per intent', () => {
    assert.match(unitMissingMessage('visitor'), /guest pass/);
    assert.match(unitMissingMessage('open-qr'), /open-access/);
  });
});
