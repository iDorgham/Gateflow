import {
  executeRetention,
  type RetentionAdapter,
  type RetentionCategory,
} from './retention-executor';

function adapterFixture(
  candidates: Partial<Record<RetentionCategory, string[]>> = {}
) {
  const applied: Array<{ category: RetentionCategory; ids: string[] }> = [];
  let legalHold = false;
  const queues = new Map<RetentionCategory, string[]>(
    (
      [
        'idArtifacts',
        'incidents',
        'scanLogs',
        'visitorHistory',
      ] as RetentionCategory[]
    ).map((category) => [category, [...(candidates[category] ?? [])]])
  );
  const adapter: RetentionAdapter = {
    getGuard: async () => ({ legalHold, policyVersion: 'v1' }),
    countCandidates: async ({ category }) => queues.get(category)!.length,
    listCandidateIds: async ({ category, limit }) =>
      queues.get(category)!.slice(0, limit),
    applyAtomicBatch: async ({
      category,
      ids,
      expectedPolicyVersion,
      expectedLegalHold,
    }) => {
      // Simulate the required in-transaction validation
      const currentGuard = await adapter.getGuard({ organizationId: 'unused' });
      if (currentGuard.legalHold !== expectedLegalHold) {
        throw new Error(
          'Legal hold status changed between planning and execution.'
        );
      }
      if (currentGuard.policyVersion !== expectedPolicyVersion) {
        throw new Error(
          'Policy version changed between planning and execution.'
        );
      }

      applied.push({ category, ids });
      queues.set(
        category,
        queues.get(category)!.filter((id) => !ids.includes(id))
      );
      return { affected: ids.length, protectedRelationsDetached: true };
    },
  };
  return {
    adapter,
    applied,
    setLegalHold: (value: boolean) => {
      legalHold = value;
    },
  };
}

describe('retention executor', () => {
  test('dry run reports candidates without mutation', async () => {
    const fixture = adapterFixture({ scanLogs: ['s1', 's2'] });
    const result = await executeRetention(fixture.adapter, {
      organizationId: 'org-a',
      policyVersion: 'v1',
      mode: 'dry-run',
      batchSize: 1,
    });
    expect(result.categories.scanLogs.candidates).toBe(2);
    expect(fixture.applied).toEqual([]);
  });

  test('applies bounded batches in dependency order', async () => {
    const fixture = adapterFixture({
      idArtifacts: ['a1'],
      incidents: ['i1'],
      scanLogs: ['s1', 's2', 's3'],
      visitorHistory: ['v1'],
    });
    const result = await executeRetention(fixture.adapter, {
      organizationId: 'org-a',
      policyVersion: 'v1',
      mode: 'apply',
      batchSize: 2,
      confirm: 'APPLY_RETENTION',
    });
    expect(fixture.applied.map((entry) => entry.category)).toEqual([
      'idArtifacts',
      'incidents',
      'scanLogs',
      'scanLogs',
      'visitorHistory',
    ]);
    expect(fixture.applied.every((entry) => entry.ids.length <= 2)).toBe(true);
    expect(result.applied).toBe(6);
  });

  test('fails closed when legal hold is active', async () => {
    const fixture = adapterFixture({ scanLogs: ['s1'] });
    fixture.setLegalHold(true);
    await expect(
      executeRetention(fixture.adapter, {
        organizationId: 'org-a',
        policyVersion: 'v1',
        mode: 'apply',
        batchSize: 10,
        confirm: 'APPLY_RETENTION',
      })
    ).rejects.toThrow('legal hold');
    expect(fixture.applied).toEqual([]);
  });

  test('rechecks the guard before every mutation batch', async () => {
    const fixture = adapterFixture({ scanLogs: ['s1', 's2'] });
    const original = fixture.adapter.applyAtomicBatch;
    fixture.adapter.applyAtomicBatch = async (input) => {
      const result = await original(input);
      fixture.setLegalHold(true);
      return result;
    };
    await expect(
      executeRetention(fixture.adapter, {
        organizationId: 'org-a',
        policyVersion: 'v1',
        mode: 'apply',
        batchSize: 1,
        confirm: 'APPLY_RETENTION',
      })
    ).rejects.toThrow('legal hold');
    expect(fixture.applied).toHaveLength(1);
  });

  test('rejects wrong confirmation, stale policy, unsafe batch size, and missing tenant', async () => {
    const fixture = adapterFixture();
    await expect(
      executeRetention(fixture.adapter, {
        organizationId: '',
        policyVersion: 'v1',
        mode: 'dry-run',
        batchSize: 10,
      })
    ).rejects.toThrow('organizationId');
    await expect(
      executeRetention(fixture.adapter, {
        organizationId: 'org-a',
        policyVersion: 'v1',
        mode: 'apply',
        batchSize: 10,
        confirm: 'yes',
      })
    ).rejects.toThrow('confirmation');
    await expect(
      executeRetention(fixture.adapter, {
        organizationId: 'org-a',
        policyVersion: 'stale',
        mode: 'apply',
        batchSize: 10,
        confirm: 'APPLY_RETENTION',
      })
    ).rejects.toThrow('policy version');
    await expect(
      executeRetention(fixture.adapter, {
        organizationId: 'org-a',
        policyVersion: 'v1',
        mode: 'dry-run',
        batchSize: 501,
      })
    ).rejects.toThrow('batchSize');
  });

  test('rejects an unsupported mode without mutating anything', async () => {
    const fixture = adapterFixture({ scanLogs: ['s1'] });
    await expect(
      executeRetention(fixture.adapter, {
        organizationId: 'org-a',
        policyVersion: 'v1',
        // Intentionally bypasses the RetentionExecutionOptions['mode'] union
        // to simulate an untyped caller (e.g. parsed JSON/CLI input).
        mode: 'apply-now' as unknown as 'apply',
        batchSize: 10,
        confirm: 'APPLY_RETENTION',
      })
    ).rejects.toThrow('mode must be');
    expect(fixture.applied).toEqual([]);
  });

  test('rejects an adapter batch that cannot prove relationship safety', async () => {
    const fixture = adapterFixture({ scanLogs: ['s1'] });
    fixture.adapter.applyAtomicBatch = async () => ({
      affected: 1,
      protectedRelationsDetached: false,
    });
    await expect(
      executeRetention(fixture.adapter, {
        organizationId: 'org-a',
        policyVersion: 'v1',
        mode: 'apply',
        batchSize: 10,
        confirm: 'APPLY_RETENTION',
      })
    ).rejects.toThrow('relationship safety');
  });

  test('is idempotent when rerun against an adapter that removes completed candidates', async () => {
    const fixture = adapterFixture({ incidents: ['i1'] });
    const options = {
      organizationId: 'org-a',
      policyVersion: 'v1',
      mode: 'apply' as const,
      batchSize: 10,
      confirm: 'APPLY_RETENTION',
    };
    expect((await executeRetention(fixture.adapter, options)).applied).toBe(1);
    expect((await executeRetention(fixture.adapter, options)).applied).toBe(0);
  });

  test('passes the same tenant scope through every adapter boundary', async () => {
    const seen: string[] = [];
    const fixture = adapterFixture({ scanLogs: ['s1'] });
    for (const key of [
      'getGuard',
      'countCandidates',
      'listCandidateIds',
      'applyAtomicBatch',
    ] as const) {
      const original = fixture.adapter[key] as (input: {
        organizationId: string;
      }) => Promise<unknown>;
      (fixture.adapter[key] as typeof original) = async (input) => {
        seen.push(input.organizationId);
        return original(input);
      };
    }
    await executeRetention(fixture.adapter, {
      organizationId: 'org-only',
      policyVersion: 'v1',
      mode: 'apply',
      batchSize: 10,
      confirm: 'APPLY_RETENTION',
    });
    expect(seen.length).toBeGreaterThan(0);
    expect(new Set(seen)).toEqual(new Set(['org-only']));
  });
});
