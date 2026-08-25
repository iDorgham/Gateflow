import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeSecurityHealthScore,
  calculateHourlyTraffic,
  calculateGateThroughput,
  computeOperationalMetrics,
  ScanRecord,
} from './operational-intelligence';

describe('computeSecurityHealthScore', () => {
  it('returns 100 OPTIMAL for clean operations with zero incidents and zero denials', () => {
    const health = computeSecurityHealthScore({
      totalScans: 500,
      deniedScans: 0,
      openIncidents: 0,
      criticalIncidents: 0,
      activeShifts: 4,
    });
    assert.equal(health.score, 100);
    assert.equal(health.grade, 'OPTIMAL');
    assert.equal(health.denialRate, 0);
  });

  it('penalizes health score appropriately when denials and incidents occur', () => {
    const health = computeSecurityHealthScore({
      totalScans: 100,
      deniedScans: 15, // 15% denial rate -> -20 pts
      openIncidents: 2, // 2 open incidents -> -10 pts
      criticalIncidents: 0,
      activeShifts: 2,
    });
    assert.equal(health.score, 70);
    assert.equal(health.grade, 'WARNING');
    assert.equal(health.denialRate, 15);
  });

  it('marks grade as CRITICAL when critical incidents exist regardless of base score', () => {
    const health = computeSecurityHealthScore({
      totalScans: 1000,
      deniedScans: 2,
      openIncidents: 1,
      criticalIncidents: 1, // 1 critical -> -25 pts
      activeShifts: 5,
    });
    assert.equal(health.grade, 'CRITICAL');
    assert.ok(health.score <= 75);
  });

  it('handles zero scans gracefully without division by zero', () => {
    const health = computeSecurityHealthScore({
      totalScans: 0,
      deniedScans: 0,
      openIncidents: 0,
      criticalIncidents: 0,
      activeShifts: 0,
    });
    assert.equal(health.score, 100);
    assert.equal(health.grade, 'OPTIMAL');
  });
});

describe('calculateHourlyTraffic', () => {
  it('aggregates scans into 24 hourly buckets', () => {
    const scans: ScanRecord[] = [
      {
        id: '1',
        status: 'GRANTED',
        scannedAt: new Date('2026-08-25T08:15:00Z'),
      },
      {
        id: '2',
        status: 'DENIED',
        scannedAt: new Date('2026-08-25T08:45:00Z'),
      },
      {
        id: '3',
        status: 'GRANTED',
        scannedAt: new Date('2026-08-25T14:30:00Z'),
      },
    ];

    const buckets = calculateHourlyTraffic(scans);
    assert.equal(buckets.length, 24);

    const bucket8 = buckets.find(
      (b) =>
        b.hourLabel.startsWith('08') ||
        b.hour === new Date('2026-08-25T08:15:00Z').getHours()
    );
    assert.ok(bucket8);
    assert.ok(bucket8.total >= 2);
  });
});

describe('calculateGateThroughput', () => {
  it('calculates distribution and denial rate per gate', () => {
    const scans: ScanRecord[] = [
      {
        id: '1',
        gateId: 'gate-a',
        gateName: 'North Gate',
        status: 'GRANTED',
        scannedAt: new Date(),
      },
      {
        id: '2',
        gateId: 'gate-a',
        gateName: 'North Gate',
        status: 'GRANTED',
        scannedAt: new Date(),
      },
      {
        id: '3',
        gateId: 'gate-a',
        gateName: 'North Gate',
        status: 'DENIED',
        scannedAt: new Date(),
      },
      {
        id: '4',
        gateId: 'gate-b',
        gateName: 'South Gate',
        status: 'GRANTED',
        scannedAt: new Date(),
      },
    ];

    const stats = calculateGateThroughput(scans);
    assert.equal(stats.length, 2);

    const northGate = stats.find((g) => g.gateId === 'gate-a');
    assert.ok(northGate);
    assert.equal(northGate.scansCount, 3);
    assert.equal(northGate.percentage, 75);
    assert.equal(northGate.denialRate, 33.3);
  });
});

describe('computeOperationalMetrics', () => {
  it('computes complete intelligence summary', () => {
    const scans: ScanRecord[] = [
      {
        id: '1',
        gateId: 'g1',
        gateName: 'Main',
        status: 'GRANTED',
        scannedAt: new Date(),
      },
      {
        id: '2',
        gateId: 'g1',
        gateName: 'Main',
        status: 'GRANTED',
        scannedAt: new Date(),
      },
    ];

    const summary = computeOperationalMetrics(
      scans,
      [],
      [{ id: 's1', userId: 'u1', gateId: 'g1', status: 'ACTIVE' }]
    );
    assert.equal(summary.totalTraffic, 2);
    assert.equal(summary.securityHealth.score, 100);
    assert.equal(summary.securityHealth.activeShiftsCount, 1);
    assert.equal(summary.topGates.length, 1);
  });
});
