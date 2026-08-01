/**
 * Unit tests for gate-assignment helpers (orgHasAssignments, getUserAssignedGateIds, checkGateAssignment).
 */

const mockCount = jest.fn();
const mockFindMany = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    gateAssignment: {
      count: (...args: unknown[]) => mockCount(...args),
      findMany: (...args: unknown[]) => mockFindMany(...args),
    },
  },
}));

import {
  orgHasAssignments,
  getUserAssignedGateIds,
  checkGateAssignment,
} from './gate-assignment';

describe('orgHasAssignments', () => {
  it('returns false when org has no assignments', async () => {
    mockCount.mockResolvedValue(0);
    expect(await orgHasAssignments('org_1')).toBe(false);
    expect(mockCount).toHaveBeenCalledWith({
      where: { organizationId: 'org_1', deletedAt: null },
    });
  });

  it('returns true when org has at least one assignment', async () => {
    mockCount.mockResolvedValue(1);
    expect(await orgHasAssignments('org_1')).toBe(true);
  });
});

describe('getUserAssignedGateIds', () => {
  it('returns set of gate IDs for user in org', async () => {
    mockFindMany.mockResolvedValue([{ gateId: 'g1' }, { gateId: 'g2' }]);
    const set = await getUserAssignedGateIds('user_1', 'org_1');
    expect(set).toEqual(new Set(['g1', 'g2']));
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { userId: 'user_1', organizationId: 'org_1', deletedAt: null },
      select: { gateId: true },
    });
  });
});

describe('checkGateAssignment', () => {
  const noWindow = {
    startTime: null,
    endTime: null,
    shiftStart: null,
    shiftEnd: null,
  };

  it('returns null when org has no assignments (allow scan)', async () => {
    mockCount.mockResolvedValue(0);
    const claims = { sub: 'user_1', orgId: 'org_1' } as Parameters<
      typeof checkGateAssignment
    >[0];
    expect(await checkGateAssignment(claims, 'gate_1')).toBe(null);
  });

  it('returns null when user is assigned to the gate with no window restrictions', async () => {
    mockCount.mockResolvedValue(1);
    mockFindMany.mockResolvedValue([noWindow]);
    const claims = { sub: 'user_1', orgId: 'org_1' } as Parameters<
      typeof checkGateAssignment
    >[0];
    expect(await checkGateAssignment(claims, 'gate_1')).toBe(null);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        userId: 'user_1',
        organizationId: 'org_1',
        gateId: 'gate_1',
        deletedAt: null,
      },
      select: {
        startTime: true,
        endTime: true,
        shiftStart: true,
        shiftEnd: true,
      },
    });
  });

  it('returns error message when org has assignments and user has none for this gate', async () => {
    mockCount.mockResolvedValue(1);
    mockFindMany.mockResolvedValue([]);
    const claims = { sub: 'user_1', orgId: 'org_1' } as Parameters<
      typeof checkGateAssignment
    >[0];
    const msg = await checkGateAssignment(claims, 'gate_1');
    expect(msg).toMatch(/not allowed to scan at this gate/);
  });

  it('returns null when claims have no orgId', async () => {
    jest.clearAllMocks();
    const claims = { sub: 'user_1', orgId: null } as Parameters<
      typeof checkGateAssignment
    >[0];
    expect(await checkGateAssignment(claims, 'gate_1')).toBe(null);
    expect(mockCount).not.toHaveBeenCalled();
  });

  it('rejects an assignment whose date range has not started yet', async () => {
    mockCount.mockResolvedValue(1);
    mockFindMany.mockResolvedValue([
      { ...noWindow, startTime: new Date(Date.now() + 60 * 60 * 1000) },
    ]);
    const claims = { sub: 'user_1', orgId: 'org_1' } as Parameters<
      typeof checkGateAssignment
    >[0];
    const msg = await checkGateAssignment(claims, 'gate_1');
    expect(msg).toMatch(/not active at this time/);
  });

  it('rejects an assignment whose date range has already expired', async () => {
    mockCount.mockResolvedValue(1);
    mockFindMany.mockResolvedValue([
      { ...noWindow, endTime: new Date(Date.now() - 60 * 60 * 1000) },
    ]);
    const claims = { sub: 'user_1', orgId: 'org_1' } as Parameters<
      typeof checkGateAssignment
    >[0];
    const msg = await checkGateAssignment(claims, 'gate_1');
    expect(msg).toMatch(/not active at this time/);
  });

  it('allows an assignment currently within its date range', async () => {
    mockCount.mockResolvedValue(1);
    mockFindMany.mockResolvedValue([
      {
        ...noWindow,
        startTime: new Date(Date.now() - 60 * 60 * 1000),
        endTime: new Date(Date.now() + 60 * 60 * 1000),
      },
    ]);
    const claims = { sub: 'user_1', orgId: 'org_1' } as Parameters<
      typeof checkGateAssignment
    >[0];
    expect(await checkGateAssignment(claims, 'gate_1')).toBe(null);
  });

  it('rejects a shift-time-of-day window the current time falls outside', async () => {
    mockCount.mockResolvedValue(1);
    const now = new Date();
    const outsideHour = (now.getHours() + 2) % 24;
    mockFindMany.mockResolvedValue([
      {
        ...noWindow,
        shiftStart: `${String(outsideHour).padStart(2, '0')}:00`,
        shiftEnd: `${String(outsideHour).padStart(2, '0')}:05`,
      },
    ]);
    const claims = { sub: 'user_1', orgId: 'org_1' } as Parameters<
      typeof checkGateAssignment
    >[0];
    const msg = await checkGateAssignment(claims, 'gate_1');
    expect(msg).toMatch(/not active at this time/);
  });

  it('allows an overnight shift-time-of-day window that wraps past midnight', async () => {
    mockCount.mockResolvedValue(1);
    // A 4-hour window straddling "now" (2h before to 2h after, hour granularity)
    // that wraps past midnight for roughly half of all start-of-day values —
    // exercises the start > end branch without minute-level timing flakiness.
    const currentHour = new Date().getHours();
    const startHour = (currentHour + 22) % 24;
    const endHour = (currentHour + 2) % 24;
    mockFindMany.mockResolvedValue([
      {
        ...noWindow,
        shiftStart: `${String(startHour).padStart(2, '0')}:00`,
        shiftEnd: `${String(endHour).padStart(2, '0')}:00`,
      },
    ]);
    const claims = { sub: 'user_1', orgId: 'org_1' } as Parameters<
      typeof checkGateAssignment
    >[0];
    expect(await checkGateAssignment(claims, 'gate_1')).toBe(null);
  });

  it('allows scanning when any one of multiple assignments for the gate is active', async () => {
    mockCount.mockResolvedValue(1);
    mockFindMany.mockResolvedValue([
      { ...noWindow, endTime: new Date(Date.now() - 60 * 60 * 1000) },
      noWindow,
    ]);
    const claims = { sub: 'user_1', orgId: 'org_1' } as Parameters<
      typeof checkGateAssignment
    >[0];
    expect(await checkGateAssignment(claims, 'gate_1')).toBe(null);
  });
});
