jest.mock('../advanced-seed-service', () => ({
  runEmulation: jest.fn(),
}));

import type { PrismaClient } from '@prisma/client';
import { executeSeedCli } from './seed-cli-run';

function mockDb(overrides: Partial<PrismaClient> = {}): PrismaClient {
  return {
    organization: {
      count: jest.fn().mockResolvedValue(5),
    },
    $queryRaw: jest.fn().mockResolvedValue([{ n: 0n }]),
    ...overrides,
  } as unknown as PrismaClient;
}

describe('seed-cli-run / executeSeedCli', () => {
  test('--dry-run skips legacy seed when no org range', async () => {
    const runLegacy = jest.fn();
    await executeSeedCli(['--dry-run'], {
      prisma: mockDb(),
      runLegacyDevSeed: runLegacy,
    });
    expect(runLegacy).not.toHaveBeenCalled();
  });

  test('--dry-run with org range calls organization.count', async () => {
    const runLegacy = jest.fn();
    const count = jest.fn().mockResolvedValue(3);
    await executeSeedCli(['--dry-run', '--organizations.min=1'], {
      prisma: mockDb({ organization: { count } } as unknown as PrismaClient),
      runLegacyDevSeed: runLegacy,
    });
    expect(count).toHaveBeenCalled();
    expect(runLegacy).not.toHaveBeenCalled();
  });

  test('org range without dry-run throws', async () => {
    await expect(
      executeSeedCli(['--organizations.min=1'], {
        prisma: mockDb(),
        runLegacyDevSeed: jest.fn(),
      })
    ).rejects.toThrow(/organizations\.min\/max require --dry-run/);
  });

  test('--help does not call legacy seed', async () => {
    const runLegacy = jest.fn();
    await executeSeedCli(['--help'], {
      prisma: mockDb(),
      runLegacyDevSeed: runLegacy,
    });
    expect(runLegacy).not.toHaveBeenCalled();
  });
});
