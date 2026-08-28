import {
  buildLivePatrolsUrl,
  parseLivePatrolPayload,
} from './use-live-patrols';

describe('use-live-patrols utility helpers', () => {
  describe('buildLivePatrolsUrl', () => {
    it('constructs correct live patrol telemetry endpoint url', () => {
      const url = buildLivePatrolsUrl('https://app.gateflow.site');
      expect(url).toBe('https://app.gateflow.site/api/patrols/live');
    });

    it('falls back to default localhost or origin when empty', () => {
      const url = buildLivePatrolsUrl('');
      expect(url).toContain('/api/patrols/live');
    });
  });

  describe('parseLivePatrolPayload', () => {
    it('successfully extracts active runs, routes, and summary', () => {
      const payload = {
        success: true,
        activeRuns: [
          {
            id: 'run_1',
            routeId: 'route_1',
            routeName: 'Perimeter Check',
            status: 'IN_PROGRESS',
            totalCheckpoints: 4,
            completedCheckpoints: 2,
            overdue: false,
            organizationId: 'org_1',
            createdAt: '2026-08-28T09:00:00Z',
            updatedAt: '2026-08-28T09:00:00Z',
          },
        ],
        routes: [
          {
            id: 'route_1',
            name: 'Perimeter Check',
            frequencyMinutes: 60,
            isStrictSequence: true,
            active: true,
            organizationId: 'org_1',
            checkpoints: [],
          },
        ],
        summary: {
          totalRoutes: 1,
          activeRunsCount: 1,
          scheduledRunsCount: 0,
          completedTodayCount: 3,
          overdueRunsCount: 0,
          activePatrolGuardsCount: 1,
        },
      };

      const result = parseLivePatrolPayload(payload);
      expect(result.activeRuns).toHaveLength(1);
      expect(result.routes).toHaveLength(1);
      expect(result.summary?.totalRoutes).toBe(1);
      expect(result.summary?.activeRunsCount).toBe(1);
    });

    it('throws when payload indicates success: false', () => {
      expect(() => {
        parseLivePatrolPayload({ success: false, message: 'Unauthorized' });
      }).toThrow('Unauthorized');
    });

    it('throws when input is null or not an object', () => {
      expect(() => parseLivePatrolPayload(null)).toThrow(
        'Invalid response structure'
      );
      expect(() => parseLivePatrolPayload('invalid')).toThrow(
        'Invalid response structure'
      );
    });
  });
});
