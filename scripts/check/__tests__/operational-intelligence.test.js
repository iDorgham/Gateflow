const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('Operational Analytics & Security Intelligence Math Engine', () => {
  function computeSecurityHealthScore(params) {
    const {
      totalScans,
      deniedScans,
      openIncidents,
      criticalIncidents,
      activeShifts,
    } = params;
    if (totalScans === 0 && openIncidents === 0) {
      return { score: 100, grade: 'OPTIMAL', denialRate: 0 };
    }
    let baseScore = 100;
    const denialRate = totalScans > 0 ? (deniedScans / totalScans) * 100 : 0;
    if (denialRate > 20) baseScore -= 35;
    else if (denialRate > 10) baseScore -= 20;
    else if (denialRate > 5) baseScore -= 10;

    baseScore -= criticalIncidents * 25;
    baseScore -= openIncidents * 5;

    const score = Math.max(0, Math.min(100, Math.round(baseScore)));
    let grade = 'OPTIMAL';
    if (score < 60 || criticalIncidents > 0) grade = 'CRITICAL';
    else if (score < 85) grade = 'WARNING';

    return { score, grade, denialRate: Number(denialRate.toFixed(2)) };
  }

  function calculateHourlyBuckets(scans) {
    const buckets = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      hourLabel: `${i.toString().padStart(2, '0')}:00`,
      total: 0,
    }));
    for (const scan of scans) {
      const d = new Date(scan.scannedAt);
      const h = d.getHours();
      if (h >= 0 && h < 24) buckets[h].total += 1;
    }
    return buckets;
  }

  it('calculates 100% security score for zero denial and clean shift posture', () => {
    const health = computeSecurityHealthScore({
      totalScans: 1000,
      deniedScans: 0,
      openIncidents: 0,
      criticalIncidents: 0,
      activeShifts: 6,
    });
    assert.equal(health.score, 100);
    assert.equal(health.grade, 'OPTIMAL');
  });

  it('penalizes high denial rate and drops to WARNING', () => {
    const health = computeSecurityHealthScore({
      totalScans: 100,
      deniedScans: 15,
      openIncidents: 1,
      criticalIncidents: 0,
      activeShifts: 2,
    });
    assert.equal(health.score, 75);
    assert.equal(health.grade, 'WARNING');
    assert.equal(health.denialRate, 15);
  });

  it('escalates to CRITICAL when critical incidents are reported', () => {
    const health = computeSecurityHealthScore({
      totalScans: 50,
      deniedScans: 1,
      openIncidents: 1,
      criticalIncidents: 1,
      activeShifts: 1,
    });
    assert.equal(health.grade, 'CRITICAL');
  });

  it('aggregates hourly traffic into 24-hour distribution bins', () => {
    const scans = [
      { scannedAt: new Date('2026-08-25T08:00:00Z') },
      { scannedAt: new Date('2026-08-25T08:30:00Z') },
      { scannedAt: new Date('2026-08-25T18:15:00Z') },
    ];
    const buckets = calculateHourlyBuckets(scans);
    assert.equal(buckets.length, 24);
    const sum = buckets.reduce((acc, b) => acc + b.total, 0);
    assert.equal(sum, 3);
  });
});
