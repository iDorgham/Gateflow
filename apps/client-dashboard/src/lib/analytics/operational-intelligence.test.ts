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
    expect(health.score).toBe(100);
    expect(health.grade).toBe('OPTIMAL');
    expect(health.denialRate).toBe(0);
  });

  it('penalizes health score appropriately when denials and incidents occur', () => {
    const health = computeSecurityHealthScore({
      totalScans: 100,
      deniedScans: 15, // 15% denial rate -> -20 pts
      openIncidents: 2, // 2 open incidents -> -10 pts
      criticalIncidents: 0,
      activeShifts: 2,
    });
    expect(health.score).toBe(70);
    expect(health.grade).toBe('WARNING');
    expect(health.denialRate).toBe(15);
  });

  it('marks grade as CRITICAL when critical incidents exist regardless of base score', () => {
    const health = computeSecurityHealthScore({
      totalScans: 1000,
      deniedScans: 2,
      openIncidents: 1,
      criticalIncidents: 1, // 1 critical -> -25 pts
      activeShifts: 5,
    });
    expect(health.grade).toBe('CRITICAL');
    expect(health.score).toBeLessThanOrEqual(75);
  });

  it('handles zero scans gracefully without division by zero', () => {
    const health = computeSecurityHealthScore({
      totalScans: 0,
      deniedScans: 0,
      openIncidents: 0,
      criticalIncidents: 0,
      activeShifts: 0,
    });
    expect(health.score).toBe(100);
    expect(health.grade).toBe('OPTIMAL');
  });
});

describe('calculateHourlyTraffic', () => {
  it('aggregates scans into 24 hourly buckets', () => {
    const d1 = new Date();
    d1.setHours(8, 15, 0, 0);
    const d2 = new Date();
    d2.setHours(8, 45, 0, 0);
    const d3 = new Date();
    d3.setHours(14, 30, 0, 0);

    const scans: ScanRecord[] = [
      {
        id: '1',
        status: 'GRANTED',
        scannedAt: d1,
      },
      {
        id: '2',
        status: 'DENIED',
        scannedAt: d2,
      },
      {
        id: '3',
        status: 'GRANTED',
        scannedAt: d3,
      },
    ];

    const buckets = calculateHourlyTraffic(scans);
    expect(buckets.length).toBe(24);

    const bucket8 = buckets[8];
    expect(bucket8).toBeDefined();
    expect(bucket8.total).toBe(2);
    expect(bucket8.granted).toBe(1);
    expect(bucket8.denied).toBe(1);
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
    expect(stats.length).toBe(2);

    const northGate = stats.find((g) => g.gateId === 'gate-a');
    expect(northGate).toBeDefined();
    expect(northGate?.scansCount).toBe(3);
    expect(northGate?.percentage).toBe(75);
    expect(northGate?.denialRate).toBe(33.3);
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
    expect(summary.totalTraffic).toBe(2);
    expect(summary.securityHealth.score).toBe(100);
    expect(summary.securityHealth.activeShiftsCount).toBe(1);
    expect(summary.topGates.length).toBe(1);
  });
});
