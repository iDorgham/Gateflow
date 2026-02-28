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

import { orgHasAssignments, getUserAssignedGateIds, checkGateAssignment } from './gate-assignment';

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
  it('returns null when org has no assignments (allow scan)', async () => {
    mockCount.mockResolvedValue(0);
    const claims = { sub: 'user_1', orgId: 'org_1' } as Parameters<typeof checkGateAssignment>[0];
    expect(await checkGateAssignment(claims, 'gate_1')).toBe(null);
  });

  it('returns null when user is assigned to the gate', async () => {
    mockCount.mockResolvedValue(1);
    mockFindMany.mockResolvedValue([{ gateId: 'gate_1' }]);
    const claims = { sub: 'user_1', orgId: 'org_1' } as Parameters<typeof checkGateAssignment>[0];
    expect(await checkGateAssignment(claims, 'gate_1')).toBe(null);
  });

  it('returns error message when org has assignments and user is not assigned to gate', async () => {
    mockCount.mockResolvedValue(1);
    mockFindMany.mockResolvedValue([{ gateId: 'other_gate' }]);
    const claims = { sub: 'user_1', orgId: 'org_1' } as Parameters<typeof checkGateAssignment>[0];
    const msg = await checkGateAssignment(claims, 'gate_1');
    expect(msg).toMatch(/not allowed to scan at this gate/);
  });

  it('returns null when claims have no orgId', async () => {
    jest.clearAllMocks();
    const claims = { sub: 'user_1', orgId: null } as Parameters<typeof checkGateAssignment>[0];
    expect(await checkGateAssignment(claims, 'gate_1')).toBe(null);
    expect(mockCount).not.toHaveBeenCalled();
  });
});
