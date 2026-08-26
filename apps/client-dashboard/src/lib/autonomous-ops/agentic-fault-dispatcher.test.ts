import {
  evaluateTelemetryAnomaly,
  selectBestVendor,
  createAutonomousWorkOrder,
  GateScanFailureEvent,
  ApprovedVendor,
} from './agentic-fault-dispatcher';

describe('agentic-fault-dispatcher', () => {
  const MOCK_EVENTS: GateScanFailureEvent[] = [
    {
      gateId: 'gate-north-01',
      gateName: 'North Gate Main Entrance',
      organizationId: 'org-palm-hills',
      errorReason: 'CAMERA_TIMEOUT',
      timestamp: '2026-08-24T16:00:10Z',
    },
    {
      gateId: 'gate-north-01',
      gateName: 'North Gate Main Entrance',
      organizationId: 'org-palm-hills',
      errorReason: 'CAMERA_TIMEOUT',
      timestamp: '2026-08-24T16:00:25Z',
    },
    {
      gateId: 'gate-north-01',
      gateName: 'North Gate Main Entrance',
      organizationId: 'org-palm-hills',
      errorReason: 'CAMERA_TIMEOUT',
      timestamp: '2026-08-24T16:00:40Z',
    },
    {
      gateId: 'gate-north-01',
      gateName: 'North Gate Main Entrance',
      organizationId: 'org-palm-hills',
      errorReason: 'BARRIER_TIMEOUT',
      timestamp: '2026-08-24T16:01:00Z',
    },
    {
      gateId: 'gate-north-01',
      gateName: 'North Gate Main Entrance',
      organizationId: 'org-palm-hills',
      errorReason: 'CAMERA_TIMEOUT',
      timestamp: '2026-08-24T16:01:15Z',
    },
  ];

  const MOCK_VENDORS: ApprovedVendor[] = [
    {
      vendorId: 'vend-101',
      name: 'OpticSense Hardware Tech',
      specialty: 'GATE_HARDWARE',
      assignedZones: ['north-zone', 'service-zone'],
    },
    {
      vendorId: 'vend-102',
      name: 'VoltSafe Electrical Systems',
      specialty: 'ELECTRICAL',
      assignedZones: ['*'],
    },
  ];

  describe('evaluateTelemetryAnomaly', () => {
    it('detects anomaly when 5 errors occur within 2 minutes', () => {
      const now = new Date('2026-08-24T16:01:30Z');
      const anomaly = evaluateTelemetryAnomaly(MOCK_EVENTS, 5, 2, now);

      expect(anomaly.isAnomaly).toBe(true);
      expect(anomaly.failureCount).toBe(5);
      expect(anomaly.dominantErrorReason).toBe('CAMERA_TIMEOUT');
    });

    it('returns isAnomaly: false when failures are below threshold', () => {
      const now = new Date('2026-08-24T16:01:30Z');
      const anomaly = evaluateTelemetryAnomaly(
        MOCK_EVENTS.slice(0, 3),
        5,
        2,
        now
      );

      expect(anomaly.isAnomaly).toBe(false);
      expect(anomaly.failureCount).toBe(3);
    });
  });

  describe('selectBestVendor', () => {
    it('selects vendor matching category and gate zone', () => {
      const vendor = selectBestVendor(
        MOCK_VENDORS,
        'GATE_HARDWARE',
        'north-zone'
      );
      expect(vendor).not.toBeNull();
      expect(vendor?.vendorId).toBe('vend-101');
      expect(vendor?.name).toBe('OpticSense Hardware Tech');
    });
  });

  describe('createAutonomousWorkOrder', () => {
    it('constructs an urgent work order attributed to GATEAI_AGENTIC_SYSTEM', () => {
      const anomaly = {
        isAnomaly: true,
        failureCount: 5,
        timeSpanMinutes: 2,
        dominantErrorReason: 'CAMERA_TIMEOUT',
      };

      const order = createAutonomousWorkOrder(
        'gate-north-01',
        'North Gate Main Entrance',
        'org-palm-hills',
        anomaly,
        MOCK_VENDORS[0]
      );

      expect(order.priority).toBe('URGENT');
      expect(order.category).toBe('GATE_HARDWARE');
      expect(order.actor).toBe('GATEAI_AGENTIC_SYSTEM');
      expect(order.titleEn).toContain(
        '[Autonomous Incident] North Gate Main Entrance - CAMERA_TIMEOUT'
      );
      expect(order.assignedVendorId).toBe('vend-101');
      expect(order.assignedVendorName).toBe('OpticSense Hardware Tech');
    });
  });
});
