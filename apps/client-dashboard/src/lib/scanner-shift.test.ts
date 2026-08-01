/**
 * Unit tests for scanner-shift helpers (CAS close + serialized start).
 */

const mockFindFirst = jest.fn();
const mockUpdateMany = jest.fn();
const mockCreate = jest.fn();
const mockTransaction = jest.fn();
const mockQueryRaw = jest.fn();

jest.mock('@gate-access/db', () => {
  const { withSerializableRetry } = jest.requireActual<
    typeof import('../../../../packages/db/src/serialization-retry')
  >('../../../../packages/db/src/serialization-retry');
  return {
    Prisma: {
      TransactionIsolationLevel: { Serializable: 'Serializable' },
      sql: (strings: TemplateStringsArray, ...values: unknown[]) => ({
        strings,
        values,
      }),
      PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
        code: string;
        constructor(message: string, { code }: { code: string }) {
          super(message);
          this.code = code;
        }
      },
    },
    withSerializableRetry,
    prisma: {
      shiftLog: {
        findFirst: (...args: unknown[]) => mockFindFirst(...args),
        updateMany: (...args: unknown[]) => mockUpdateMany(...args),
        create: (...args: unknown[]) => mockCreate(...args),
      },
      $transaction: (...args: unknown[]) => mockTransaction(...args),
      $queryRaw: (...args: unknown[]) => mockQueryRaw(...args),
    },
  };
});

import { Prisma } from '@gate-access/db';
import {
  closeShift,
  lockOpenShiftForGate,
  serializeShift,
  startOrReuseShift,
} from './scanner-shift';

describe('lockOpenShiftForGate', () => {
  it('locks only shifts whose gate is active and not deleted', async () => {
    mockQueryRaw.mockResolvedValueOnce([]);

    await lockOpenShiftForGate({ $queryRaw: mockQueryRaw } as never, {
      organizationId: 'org_1',
      guardId: 'guard_1',
      gateId: 'gate_1',
    });

    const query = mockQueryRaw.mock.calls[0][0] as { strings: string[] };
    const sql = query.strings.join('?');
    expect(sql).toContain('INNER JOIN "Gate"');
    expect(sql).toContain('"Gate"."isActive" = TRUE');
    expect(sql).toContain('"Gate"."deletedAt" IS NULL');
  });
});

describe('serializeShift', () => {
  it('serializes ISO strings for API responses', () => {
    expect(
      serializeShift({
        id: 's1',
        gateId: 'g1',
        guardId: 'u1',
        organizationId: 'o1',
        startTime: new Date('2026-08-01T10:00:00.000Z'),
        endTime: null,
      })
    ).toEqual({
      id: 's1',
      gateId: 'g1',
      guardId: 'u1',
      organizationId: 'o1',
      startTime: '2026-08-01T10:00:00.000Z',
      endTime: null,
    });
  });
});

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

  it('reuses an open shift at the same gate and closes other open rows', async () => {
    const updateMany = jest.fn().mockResolvedValue({ count: 1 });
    const create = jest.fn();
    mockTransaction.mockImplementation(
      async (fn: (tx: unknown) => unknown, _opts?: unknown) => {
        const tx = {
          gate: { findFirst: jest.fn().mockResolvedValue({ id: 'gate_1' }) },
          $queryRaw: jest.fn().mockResolvedValue([
            {
              id: 'shift_open',
              gateId: 'gate_1',
              guardId: 'guard_1',
              organizationId: 'org_1',
              startTime: new Date(),
              endTime: null,
            },
          ]),
          shiftLog: {
            updateMany,
            create,
          },
        };
        return fn(tx);
      }
    );

    const result = await startOrReuseShift({
      organizationId: 'org_1',
      guardId: 'guard_1',
      gateId: 'gate_1',
    });

    expect(result.reused).toBe(true);
    expect(result.shift.id).toBe('shift_open');
    expect(create).not.toHaveBeenCalled();
    expect(updateMany).toHaveBeenCalledWith({
      where: {
        organizationId: 'org_1',
        guardId: 'guard_1',
        endTime: null,
        NOT: { id: 'shift_open' },
      },
      data: { endTime: expect.any(Date) },
    });
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

    mockTransaction.mockImplementation(
      async (fn: (tx: unknown) => unknown, _opts?: unknown) => {
        const tx = {
          gate: { findFirst: jest.fn().mockResolvedValue({ id: 'gate_2' }) },
          $queryRaw: jest.fn().mockResolvedValue([]),
          shiftLog: {
            updateMany,
            create,
          },
        };
        return fn(tx);
      }
    );

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

  it('forwards Serializable isolationLevel to $transaction', async () => {
    mockTransaction.mockImplementation(
      async (fn: (tx: unknown) => unknown, _opts?: unknown) => {
        const tx = {
          gate: { findFirst: jest.fn().mockResolvedValue({ id: 'gate_1' }) },
          $queryRaw: jest.fn().mockResolvedValue([]),
          shiftLog: {
            updateMany: jest.fn().mockResolvedValue({ count: 0 }),
            create: jest.fn().mockResolvedValue({
              id: 'shift_new',
              gateId: 'gate_1',
              guardId: 'guard_1',
              organizationId: 'org_1',
              startTime: new Date(),
              endTime: null,
            }),
          },
        };
        return fn(tx);
      }
    );

    await startOrReuseShift({
      organizationId: 'org_1',
      guardId: 'guard_1',
      gateId: 'gate_1',
    });

    expect(mockTransaction).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        isolationLevel: 'Serializable',
      })
    );
  });

  it('retries on P2034 then succeeds', async () => {
    const P2034 = new Prisma.PrismaClientKnownRequestError('conflict', {
      code: 'P2034',
    });

    let attempts = 0;
    mockTransaction.mockImplementation(
      async (fn: (tx: unknown) => unknown, _opts?: unknown) => {
        attempts += 1;
        if (attempts === 1) {
          throw P2034;
        }
        const tx = {
          gate: { findFirst: jest.fn().mockResolvedValue({ id: 'gate_1' }) },
          $queryRaw: jest.fn().mockResolvedValue([]),
          shiftLog: {
            updateMany: jest.fn().mockResolvedValue({ count: 0 }),
            create: jest.fn().mockResolvedValue({
              id: 'shift_retry',
              gateId: 'gate_1',
              guardId: 'guard_1',
              organizationId: 'org_1',
              startTime: new Date(),
              endTime: null,
            }),
          },
        };
        return fn(tx);
      }
    );

    const result = await startOrReuseShift({
      organizationId: 'org_1',
      guardId: 'guard_1',
      gateId: 'gate_1',
    });

    expect(result.shift.id).toBe('shift_retry');
    expect(attempts).toBe(2);
  });

  it('throws on non-retryable errors without looping', async () => {
    mockTransaction.mockRejectedValue(new Error('boom'));

    await expect(
      startOrReuseShift({
        organizationId: 'org_1',
        guardId: 'guard_1',
        gateId: 'gate_1',
      })
    ).rejects.toThrow('boom');

    expect(mockTransaction).toHaveBeenCalledTimes(1);
  });

  it('does not create or reuse a shift when the gate became inactive', async () => {
    const findShift = jest.fn();
    const create = jest.fn();
    mockTransaction.mockImplementation(async (fn: (tx: unknown) => unknown) =>
      fn({
        gate: { findFirst: jest.fn().mockResolvedValue(null) },
        $queryRaw: findShift,
        shiftLog: { create },
      })
    );

    await expect(
      startOrReuseShift({
        organizationId: 'org_1',
        guardId: 'guard_1',
        gateId: 'gate_1',
      })
    ).rejects.toThrow(/inactive or deleted gate/);
    expect(findShift).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });
});
