import {
  buildLiveShiftsUrl,
  parseLiveShiftPayload,
  LiveGateShiftTelemetry,
  LiveShiftSummary,
} from './use-live-shifts';

describe('use-live-shifts utilities', () => {
  describe('buildLiveShiftsUrl', () => {
    it('constructs base url when no projectId is provided', () => {
      const url = buildLiveShiftsUrl('http://localhost:3001');
      expect(url).toBe('http://localhost:3001/api/shifts/live');
    });

    it('appends project query parameter when projectId is present', () => {
      const url = buildLiveShiftsUrl('https://app.gateflow.site', 'proj_alpha');
      expect(url).toBe(
        'https://app.gateflow.site/api/shifts/live?project=proj_alpha'
      );
    });

    it('ignores null or undefined projectId', () => {
      const urlNull = buildLiveShiftsUrl('https://app.gateflow.site', null);
      expect(urlNull).toBe('https://app.gateflow.site/api/shifts/live');

      const urlUndef = buildLiveShiftsUrl(
        'https://app.gateflow.site',
        undefined
      );
      expect(urlUndef).toBe('https://app.gateflow.site/api/shifts/live');
    });
  });

  describe('parseLiveShiftPayload', () => {
    const mockGates: LiveGateShiftTelemetry[] = [
      {
        gateId: 'gate_1',
        gateName: 'Main North Gate',
        location: 'Sector 1',
        latitude: 30.05,
        longitude: 31.25,
        isActive: true,
        projectId: 'proj_1',
        projectName: 'Compound Lotus',
        status: 'ACTIVE',
        isTerminalConnected: true,
        lastHeartbeatAt: '2026-08-28T09:00:00.000Z',
        activeShift: {
          id: 'shift_101',
          guardId: 'guard_1',
          guardName: 'Tarek',
          guardAvatar: null,
          startTime: '2026-08-28T08:00:00.000Z',
          elapsedMinutes: 60,
        },
        scheduledGuards: [],
        scansTodayCount: 42,
      },
    ];

    const mockSummary: LiveShiftSummary = {
      totalGates: 1,
      activeShiftsCount: 1,
      unmannedGatesCount: 0,
      overrunShiftsCount: 0,
      scheduledGatesCount: 0,
      activeGuardsCount: 1,
    };

    it('successfully extracts gates and summary from compliant response', () => {
      const response = {
        success: true,
        data: {
          gates: mockGates,
          summary: mockSummary,
        },
      };

      const result = parseLiveShiftPayload(response);
      expect(result.gates).toHaveLength(1);
      expect(result.gates[0].gateName).toBe('Main North Gate');
      expect(result.gates[0].scansTodayCount).toBe(42);
      expect(result.summary?.activeGuardsCount).toBe(1);
    });

    it('throws when success is false', () => {
      const failedResponse = {
        success: false,
        message: 'Unauthorized access to shifts',
      };

      expect(() => parseLiveShiftPayload(failedResponse)).toThrow(
        'Unauthorized access to shifts'
      );
    });

    it('throws when payload is null or non-object', () => {
      expect(() => parseLiveShiftPayload(null)).toThrow(
        'Invalid response structure'
      );
      expect(() => parseLiveShiftPayload('invalid')).toThrow(
        'Invalid response structure'
      );
    });

    it('defaults gates to empty array and summary to null if missing in data', () => {
      const partialResponse = {
        success: true,
        data: {},
      };

      const result = parseLiveShiftPayload(partialResponse);
      expect(result.gates).toEqual([]);
      expect(result.summary).toBeNull();
    });
  });
});
