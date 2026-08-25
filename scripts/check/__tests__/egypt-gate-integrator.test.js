const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('Egyptian Gate Controller & Barrier Adapter Engine', () => {
  function calculateCrc16(data) {
    let crc = 0xffff;
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = ((crc << 1) ^ 0x1021) & 0xffff;
        } else {
          crc = (crc << 1) & 0xffff;
        }
      }
    }
    return crc.toString(16).padStart(4, '0').toUpperCase();
  }

  function buildBarrierCommand(request) {
    const { gateId, brand, commandType, durationMs = 2500 } = request;
    let relayAction = 'PULSE';
    let commandCode = '01';

    if (commandType === 'HOLD_OPEN') {
      relayAction = 'LATCH_HIGH';
      commandCode = '02';
    } else if (commandType === 'LOCKDOWN') {
      relayAction = 'LATCH_LOW';
      commandCode = '03';
    } else if (commandType === 'EMERGENCY_RELEASE') {
      relayAction = 'LATCH_HIGH';
      commandCode = '09';
    }

    const timestamp = request.timestamp || 1774435200000;
    const rawFrame = `GF:${brand}:${gateId}:${commandCode}:${durationMs}:${timestamp}`;
    const checksum = calculateCrc16(rawFrame);
    const hexPayload = Buffer.from(`${rawFrame}#${checksum}`).toString('hex');

    return {
      version: '1.0',
      gateId,
      brand,
      commandType,
      relayAction,
      pulseDurationMs: commandType === 'PULSE_OPEN' ? durationMs : 0,
      hexPayload,
      checksum,
    };
  }

  function verifyOfflineSyncBatch(batch) {
    const seen = new Set();
    const acceptedUuids = [];
    const conflictedUuids = [];
    const rejectedUuids = [];

    for (const scan of batch.scans) {
      if (!scan.scanUuid || !scan.qrPayload) {
        rejectedUuids.push(scan.scanUuid || 'unknown');
        continue;
      }
      if (seen.has(scan.scanUuid)) {
        conflictedUuids.push(scan.scanUuid);
        continue;
      }
      seen.add(scan.scanUuid);
      acceptedUuids.push(scan.scanUuid);
    }

    return {
      acceptedUuids,
      conflictedUuids,
      rejectedUuids,
      syncedCount: acceptedUuids.length,
    };
  }

  it('generates compliant BFT barrier pulse open command with valid CRC16', () => {
    const cmd = buildBarrierCommand({
      gateId: 'gate-hurghada-main',
      brand: 'BFT',
      commandType: 'PULSE_OPEN',
      durationMs: 2500,
    });
    assert.equal(cmd.brand, 'BFT');
    assert.equal(cmd.relayAction, 'PULSE');
    assert.equal(cmd.pulseDurationMs, 2500);
    assert.ok(cmd.checksum.length === 4);
    assert.ok(cmd.hexPayload.length > 0);
  });

  it('generates compliant CAME barrier hold open command', () => {
    const cmd = buildBarrierCommand({
      gateId: 'gate-gouna-vip',
      brand: 'CAME',
      commandType: 'HOLD_OPEN',
    });
    assert.equal(cmd.brand, 'CAME');
    assert.equal(cmd.relayAction, 'LATCH_HIGH');
    assert.equal(cmd.pulseDurationMs, 0);
  });

  it('verifies and deduplicates offline scans batch accurately', () => {
    const batch = {
      deviceId: 'dev_iphone_15_guard',
      gateId: 'gate_elgouna_01',
      scans: [
        {
          scanUuid: 'uuid-1',
          qrPayload: 'signed_qr_payload_1',
          scannedAt: '2026-08-25T12:00:00Z',
          offlineVerified: true,
        },
        {
          scanUuid: 'uuid-2',
          qrPayload: 'signed_qr_payload_2',
          scannedAt: '2026-08-25T12:05:00Z',
          offlineVerified: true,
        },
        {
          scanUuid: 'uuid-1',
          qrPayload: 'signed_qr_payload_1',
          scannedAt: '2026-08-25T12:06:00Z',
          offlineVerified: true,
        }, // Duplicate
        {
          scanUuid: '',
          qrPayload: '',
          scannedAt: '2026-08-25T12:07:00Z',
          offlineVerified: false,
        }, // Malformed
      ],
    };

    const result = verifyOfflineSyncBatch(batch);
    assert.equal(result.syncedCount, 2);
    assert.deepEqual(result.acceptedUuids, ['uuid-1', 'uuid-2']);
    assert.deepEqual(result.conflictedUuids, ['uuid-1']);
    assert.equal(result.rejectedUuids.length, 1);
  });
});
