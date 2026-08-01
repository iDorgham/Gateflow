/**
 * Unit tests for scanner-shift helpers (CAS close + serialized start).
 */

const mockFindFirst = jest.fn();
const mockUpdateMany = jest.fn();
const mockCreate = jest.fn();
const mockTransaction = jest.fn();

jest.mock('@gate-access/db', () => ({
  Prisma: {
    TransactionIsolationLevel: { Serializable: 'Serializable' },
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
      code: string;
      constructor(message: string, { code }: { code: string }) {
        super(message);
        this.code = code;
      }
    },
  },
  prisma: {
    shiftLog: {
      findFirst: (...args: unknown[]) => mockFindFirst(...args),
      updateMany: (...args: unknown[]) => mockUpdateMany(...args),
      create: (...args: unknown[]) => mockCreate(...args),
    },
    $transaction: (...args: unknown[]) => mockTransaction(...args),
  },
}));

import { closeShift, startOrReuseShift } from './scanner-shift';

describe('closeShift', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses updateMany CAS and returns null when no row updated', async () => {
    mockUpdateMany.mockResolvedValueOnce({ count: 0 });

    const result = await closeShift({
      organizationId: 'org_1',
      guardId: 'guard_1',
      shiftLogId: 'shift_1',
    });

    expect(result).toBeNull();
    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: {
        id: 'shift_1',
        organizationId: 'org_1',
        guardId: 'guard_1',
        endTime: null,
      },
      data: { endTime: expect.any(Date) },
    });
    expect(mockFindFirst).not.toHaveBeenCalled();
  });

  it('returns the closed shift when CAS update succeeds', async () => {
    mockUpdateMany.mockResolvedValueOnce({ count: 1 });
    mockFindFirst.mockResolvedValueOnce({
      id: 'shift_1',
      gateId: 'gate_1',
      guardId: 'guard_1',
      organizationId: 'org_1',
      startTime: new Date('2026-08-01T10:00:00.000Z'),
      endTime: new Date('2026-08-01T18:00:00.000Z'),
    });

    const result = await closeShift({
      organizationId: 'org_1',
      guardId: 'guard_1',
      shiftLogId: 'shift_1',
    });

    expect(result?.id).toBe('shift_1');
    expect(result?.endTime).toBeTruthy();
  });
});

describe('startOrReuseShift', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reuses an open shift at the same gate', async () => {
    mockTransaction.mockImplementation(async (fn: (tx: unknown) => unknown) => {
      const tx = {
        shiftLog: {
          findFirst: jest.fn().mockResolvedValue({
            id: 'shift_open',
            gateId: 'gate_1',
            guardId: 'guard_1',
            organizationId: 'org_1',
            startTime: new Date(),
            endTime: null,
          }),
          updateMany: jest.fn(),
          create: jest.fn(),
        },
      };
      return fn(tx);
    });

    const result = await startOrReuseShift({
      organizationId: 'org_1',
      guardId: 'guard_1',
      gateId: 'gate_1',
    });

    expect(result.reused).toBe(true);
    expect(result.shift.id).toBe('shift_open');
  });

  it('closes open shifts elsewhere then creates a new one', async () => {
    const updateMany = jest.fn().mockResolvedValue({ count: 1 });
    const create = jest.fn().mockResolvedValue({
      id: 'shift_new',
      gateId: 'gate_2',
      guardId: 'guard_1',
      organizationId: 'org_1',
      startTime: new Date('2026-08-01T11:00:00.000Z'),
      endTime: null,
    });

    mockTransaction.mockImplementation(async (fn: (tx: unknown) => unknown) => {
      const tx = {
        shiftLog: {
          findFirst: jest.fn().mockResolvedValue(null),
          updateMany,
          create,
        },
      };
      return fn(tx);
    });

    const result = await startOrReuseShift({
      organizationId: 'org_1',
      guardId: 'guard_1',
      gateId: 'gate_2',
    });

    expect(result.reused).toBe(false);
    expect(result.shift.id).toBe('shift_new');
    expect(updateMany).toHaveBeenCalledWith({
      where: {
        organizationId: 'org_1',
        guardId: 'guard_1',
        endTime: null,
      },
      data: { endTime: expect.any(Date) },
    });
    expect(create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        organizationId: 'org_1',
        guardId: 'guard_1',
        gateId: 'gate_2',
      }),
    });
  });
});
