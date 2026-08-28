const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockHasPermission = jest.fn();
jest.mock('@/lib/auth', () => ({
  hasPermission: (...args: unknown[]) => mockHasPermission(...args),
}));

const mockGateFindMany = jest.fn();
const mockShiftLogFindMany = jest.fn();
const mockGateAssignmentFindMany = jest.fn();
const mockScanLogGroupBy = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    gate: {
      findMany: (...args: unknown[]) => mockGateFindMany(...args),
    },
    shiftLog: {
      findMany: (...args: unknown[]) => mockShiftLogFindMany(...args),
    },
    gateAssignment: {
      findMany: (...args: unknown[]) => mockGateAssignmentFindMany(...args),
    },
    scanLog: {
      groupBy: (...args: unknown[]) => mockScanLogGroupBy(...args),
    },
  },
}));

import { NextRequest } from 'next/server';

describe('GET /api/shifts/live', () => {
  let GET: (req?: NextRequest) => Promise<Response>;

  beforeAll(async () => {
    const mod = await import('./route');
    GET = mod.GET;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockHasPermission.mockReturnValue(true);
  });

  it('returns 401 when caller has no session claims or orgId', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns 403 when the caller lacks gates:manage permission', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_123' });
    mockHasPermission.mockReturnValue(false);

    const res = await GET();

    expect(res.status).toBe(403);
    expect(mockGateFindMany).not.toHaveBeenCalled();
  });

  it('aggregates live shift states (ACTIVE, OVERRUN, SCHEDULED, UNMANNED, OFFLINE)', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_123' });

    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const nineHoursAgo = new Date(now.getTime() - 9 * 60 * 60 * 1000);

    mockGateFindMany.mockResolvedValue([
      {
        id: 'gate_1',
        name: 'Main Gate',
        location: 'North Entrance',
        latitude: 30.0444,
        longitude: 31.2357,
        isActive: true,
        projectId: 'proj_1',
        project: { id: 'proj_1', name: 'Palm Hills' },
        lastAccessedAt: new Date(),
      },
      {
        id: 'gate_2',
        name: 'Service Gate',
        location: 'South Entrance',
        latitude: null,
        longitude: null,
        isActive: true,
        projectId: null,
        project: null,
        lastAccessedAt: null,
      },
      {
        id: 'gate_3',
        name: 'VIP Gate',
        location: 'East Entrance',
        latitude: null,
        longitude: null,
        isActive: true,
        projectId: null,
        project: null,
        lastAccessedAt: null,
      },
      {
        id: 'gate_4',
        name: 'Maintenance Gate',
        location: 'West Entrance',
        latitude: null,
        longitude: null,
        isActive: false,
        projectId: null,
        project: null,
        lastAccessedAt: null,
      },
    ]);

    mockShiftLogFindMany.mockResolvedValue([
      {
        id: 'shift_1',
        guardId: 'guard_1',
        gateId: 'gate_1',
        startTime: twoHoursAgo,
        updatedAt: now,
        guard: {
          id: 'guard_1',
          name: 'Ahmed Hassan',
          avatar: '/avatars/1.jpg',
        },
      },
      {
        id: 'shift_2',
        guardId: 'guard_2',
        gateId: 'gate_2',
        startTime: nineHoursAgo,
        updatedAt: now,
        guard: { id: 'guard_2', name: 'Mohamed Ali', avatar: null },
      },
    ]);

    mockGateAssignmentFindMany.mockResolvedValue([
      {
        id: 'asgn_1',
        gateId: 'gate_3',
        userId: 'guard_3',
        shiftStart: '08:00',
        shiftEnd: '16:00',
        user: { id: 'guard_3', name: 'Youssef Omar', avatar: null },
      },
    ]);

    mockScanLogGroupBy.mockResolvedValue([
      {
        gateId: 'gate_1',
        _count: 42,
        _max: { scannedAt: now },
      },
    ]);

    const res = await GET();
    const payload = await res.json();

    expect(res.status).toBe(200);
    expect(payload.success).toBe(true);

    const { gates, summary } = payload.data;

    expect(gates).toHaveLength(4);

    // Gate 1: Active
    expect(gates[0].gateId).toBe('gate_1');
    expect(gates[0].status).toBe('ACTIVE');
    expect(gates[0].activeShift.guardName).toBe('Ahmed Hassan');
    expect(gates[0].scansTodayCount).toBe(42);
    expect(gates[0].isTerminalConnected).toBe(true);

    // Gate 2: Overrun (>8h)
    expect(gates[1].gateId).toBe('gate_2');
    expect(gates[1].status).toBe('OVERRUN');
    expect(gates[1].activeShift.elapsedMinutes).toBeGreaterThanOrEqual(540);

    // Gate 3: Scheduled
    expect(gates[2].gateId).toBe('gate_3');
    expect(gates[2].status).toBe('SCHEDULED');
    expect(gates[2].scheduledGuards[0].userName).toBe('Youssef Omar');

    // Gate 4: Offline (isActive: false)
    expect(gates[3].gateId).toBe('gate_4');
    expect(gates[3].status).toBe('OFFLINE');

    // Summary counts
    expect(summary.totalGates).toBe(4);
    expect(summary.activeShiftsCount).toBe(2); // 1 active + 1 overrun
    expect(summary.overrunShiftsCount).toBe(1);
    expect(summary.scheduledGatesCount).toBe(1);
    expect(summary.activeGuardsCount).toBe(2);
  });
});
