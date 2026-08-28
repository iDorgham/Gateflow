import { GET } from './route';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: jest.fn(),
}));

jest.mock('@gate-access/db', () => ({
  prisma: {
    patrolRoute: {
      findMany: jest.fn(),
    },
    patrolRun: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('Live Patrol Telemetry API (/api/patrols/live)', () => {
  const orgId = 'org_test_gateflow';
  const userId = 'user_supervisor_1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when unauthenticated', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue(null);

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.success).toBe(false);
  });

  it('returns active runs and calculates live summary statistics', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue({ orgId, sub: userId });

    const mockRoutes = [
      {
        id: 'route_1',
        name: 'Perimeter North',
        frequencyMinutes: 30,
        isStrictSequence: true,
        active: true,
        startGateId: null,
        startGate: null,
        organizationId: orgId,
        createdAt: new Date('2026-08-28T08:00:00Z'),
        updatedAt: new Date('2026-08-28T08:00:00Z'),
        checkpoints: [
          {
            id: 'cp_1',
            routeId: 'route_1',
            name: 'Station 1',
            mapCoordinates: { x: 10, y: 20 },
            orderIndex: 0,
            organizationId: orgId,
            createdAt: new Date('2026-08-28T08:00:00Z'),
            updatedAt: new Date('2026-08-28T08:00:00Z'),
          },
          {
            id: 'cp_2',
            routeId: 'route_1',
            name: 'Station 2',
            mapCoordinates: { x: 50, y: 80 },
            orderIndex: 1,
            organizationId: orgId,
            createdAt: new Date('2026-08-28T08:00:00Z'),
            updatedAt: new Date('2026-08-28T08:00:00Z'),
          },
        ],
      },
    ];

    const mockActiveRuns = [
      {
        id: 'run_1',
        routeId: 'route_1',
        guardId: 'guard_123',
        status: 'IN_PROGRESS',
        startedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
        completedAt: null,
        organizationId: orgId,
        createdAt: new Date(),
        updatedAt: new Date(),
        route: mockRoutes[0],
        guard: { id: 'guard_123', name: 'Officer Ahmed', avatarUrl: null },
        logEntries: [
          {
            id: 'log_1',
            runId: 'run_1',
            checkpointId: 'cp_1',
            guardId: 'guard_123',
            scannedAt: new Date(Date.now() - 5 * 60 * 1000),
            latencySeconds: 300,
            organizationId: orgId,
            checkpoint: { id: 'cp_1', name: 'Station 1' },
            guard: { id: 'guard_123', name: 'Officer Ahmed' },
          },
        ],
      },
    ];

    (prisma.patrolRoute.findMany as jest.Mock).mockResolvedValue(mockRoutes);
    (prisma.patrolRun.findMany as jest.Mock).mockResolvedValue(mockActiveRuns);
    (prisma.patrolRun.count as jest.Mock).mockResolvedValue(4);

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.activeRuns).toHaveLength(1);
    expect(json.activeRuns[0].guardName).toBe('Officer Ahmed');
    expect(json.activeRuns[0].totalCheckpoints).toBe(2);
    expect(json.activeRuns[0].completedCheckpoints).toBe(1);
    expect(json.activeRuns[0].overdue).toBe(false);

    expect(json.summary.totalRoutes).toBe(1);
    expect(json.summary.activeRunsCount).toBe(1);
    expect(json.summary.completedTodayCount).toBe(4);
    expect(json.summary.activePatrolGuardsCount).toBe(1);
  });
});
