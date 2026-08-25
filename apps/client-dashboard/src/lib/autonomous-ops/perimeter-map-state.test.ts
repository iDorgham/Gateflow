import {
  calculatePerimeterMetrics,
  filterAndSortPerimeterEvents,
  updateGateNodeStatuses,
  GateTopologyNode,
  PerimeterAnomalyEvent,
} from './perimeter-map-state';

describe('perimeter-map-state', () => {
  const MOCK_GATES: GateTopologyNode[] = [
    {
      gateId: 'gate-01',
      gateName: 'North Gate Main',
      gateZone: 'Zone A',
      coordinates: { x: 25, y: 15 },
      status: 'NOMINAL',
      cameraCount: 4,
      lastHeartbeat: '2026-08-24T16:00:00Z',
    },
    {
      gateId: 'gate-02',
      gateName: 'South Service Gate',
      gateZone: 'Zone C',
      coordinates: { x: 75, y: 85 },
      status: 'NOMINAL',
      cameraCount: 2,
      lastHeartbeat: '2026-08-24T16:00:00Z',
    },
  ];

  const MOCK_EVENTS: PerimeterAnomalyEvent[] = [
    {
      id: 'evt-01',
      gateId: 'gate-01',
      gateName: 'North Gate Main',
      type: 'TAILGATING',
      severity: 'CRITICAL',
      timestamp: '2026-08-24T16:05:00Z',
      message: 'Tailgating vehicle detected',
      messageAr: 'تم رصد مركبة تتبعية',
      isResolved: false,
    },
    {
      id: 'evt-02',
      gateId: 'gate-02',
      gateName: 'South Service Gate',
      type: 'HARDWARE_ANOMALY',
      severity: 'WARNING',
      timestamp: '2026-08-24T16:02:00Z',
      message: 'Camera frame rate drop',
      messageAr: 'انخفاض معدل إطارات الكاميرا',
      isResolved: false,
    },
    {
      id: 'evt-03',
      gateId: 'gate-01',
      gateName: 'North Gate Main',
      type: 'AGENTIC_DISPATCH',
      severity: 'INFO',
      timestamp: '2026-08-24T16:06:00Z',
      message: 'Auto-dispatched work order',
      messageAr: 'تم إصدار بلاغ صيانة تلقائي',
      isResolved: true,
    },
  ];

  describe('calculatePerimeterMetrics', () => {
    it('accurately computes summary metrics and security score', () => {
      const metrics = calculatePerimeterMetrics(MOCK_GATES, MOCK_EVENTS);

      expect(metrics.totalGates).toBe(2);
      expect(metrics.activeCameras).toBe(6);
      expect(metrics.unresolvedIncidents).toBe(1); // evt-01
      expect(metrics.agenticActions24h).toBe(1); // evt-03
      expect(metrics.perimeterSecurityScore).toBe(80); // 100 - (1*15 + 1*5)
    });
  });

  describe('filterAndSortPerimeterEvents', () => {
    it('sorts events with most recent first', () => {
      const sorted = filterAndSortPerimeterEvents(MOCK_EVENTS);
      expect(sorted[0].id).toBe('evt-03'); // 16:06
      expect(sorted[1].id).toBe('evt-01'); // 16:05
      expect(sorted[2].id).toBe('evt-02'); // 16:02
    });

    it('filters by severity accurately', () => {
      const filtered = filterAndSortPerimeterEvents(MOCK_EVENTS, {
        severity: 'CRITICAL',
      });
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('evt-01');
    });

    it('filters by gateId accurately', () => {
      const filtered = filterAndSortPerimeterEvents(MOCK_EVENTS, {
        gateId: 'gate-02',
      });
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('evt-02');
    });

    it('filters unresolved events only', () => {
      const filtered = filterAndSortPerimeterEvents(MOCK_EVENTS, {
        unresolvedOnly: true,
      });
      expect(filtered.length).toBe(2);
      expect(filtered.some((e) => e.id === 'evt-03')).toBe(false);
    });
  });

  describe('updateGateNodeStatuses', () => {
    it('sets gate status to INCIDENT on critical events and ANOMALY on warning events', () => {
      const updated = updateGateNodeStatuses(MOCK_GATES, MOCK_EVENTS);

      expect(updated.find((g) => g.gateId === 'gate-01')?.status).toBe(
        'INCIDENT'
      );
      expect(updated.find((g) => g.gateId === 'gate-02')?.status).toBe(
        'ANOMALY'
      );
    });
  });
});
