export const RETENTION_ORDER = [
  'idArtifacts',
  'incidents',
  'scanLogs',
  'visitorHistory',
] as const;
export type RetentionCategory = (typeof RETENTION_ORDER)[number];

export type RetentionGuard = { legalHold: boolean; policyVersion: string };
export type RetentionBatchResult = {
  affected: number;
  protectedRelationsDetached: boolean;
};

export type RetentionAdapter = {
  getGuard(input: { organizationId: string }): Promise<RetentionGuard>;
  countCandidates(input: {
    organizationId: string;
    category: RetentionCategory;
  }): Promise<number>;
  listCandidateIds(input: {
    organizationId: string;
    category: RetentionCategory;
    limit: number;
  }): Promise<string[]>;
  /**
   * Atomically delete the specified records in a database transaction.
   *
   * CRITICAL: Implementations MUST, inside the same transaction before deletion:
   * 1. Re-read the current legal hold and policy version for this organization
   * 2. Verify legalHold matches expectedLegalHold (must be false) and policyVersion matches expectedPolicyVersion
   * 3. Perform relationship-safety validation to ensure no dependent records would be orphaned
   * 4. If any validation fails, abort/rollback the transaction (throw an error) before any deletions occur
   *
   * This prevents TOCTOU races between the pre-flight guard check and actual deletion.
   */
  applyAtomicBatch(input: {
    organizationId: string;
    category: RetentionCategory;
    ids: string[];
    expectedPolicyVersion: string;
    expectedLegalHold: boolean;
  }): Promise<RetentionBatchResult>;
};

export type RetentionExecutionOptions = {
  organizationId: string;
  policyVersion: string;
  mode: 'dry-run' | 'apply';
  batchSize: number;
  confirm?: string;
};

export type RetentionExecutionResult = {
  organizationId: string;
  policyVersion: string;
  mode: 'dry-run' | 'apply';
  applied: number;
  categories: Record<
    RetentionCategory,
    { candidates: number; applied: number; batches: number }
  >;
};

const MAX_BATCH_SIZE = 500;

function assertOptions(options: RetentionExecutionOptions): void {
  if (!options.organizationId.trim())
    throw new Error('organizationId is required.');
  if (!options.policyVersion.trim())
    throw new Error('policyVersion is required.');
  if (options.mode !== 'dry-run' && options.mode !== 'apply') {
    throw new Error('mode must be "dry-run" or "apply".');
  }
  if (
    !Number.isInteger(options.batchSize) ||
    options.batchSize < 1 ||
    options.batchSize > MAX_BATCH_SIZE
  ) {
    throw new Error(
      `batchSize must be an integer from 1 to ${MAX_BATCH_SIZE}.`
    );
  }
  if (options.mode === 'apply' && options.confirm !== 'APPLY_RETENTION') {
    throw new Error('Exact apply confirmation is required.');
  }
}

async function assertCurrentGuard(
  adapter: RetentionAdapter,
  options: RetentionExecutionOptions
): Promise<void> {
  const guard = await adapter.getGuard({
    organizationId: options.organizationId,
  });
  if (guard.legalHold) throw new Error('Retention blocked by legal hold.');
  if (guard.policyVersion !== options.policyVersion)
    throw new Error(
      'Retention policy version changed; regenerate and review the dry run.'
    );
}

export async function executeRetention(
  adapter: RetentionAdapter,
  options: RetentionExecutionOptions
): Promise<RetentionExecutionResult> {
  assertOptions(options);
  await assertCurrentGuard(adapter, options);

  const categories = Object.fromEntries(
    RETENTION_ORDER.map((category) => [
      category,
      { candidates: 0, applied: 0, batches: 0 },
    ])
  ) as RetentionExecutionResult['categories'];
  let applied = 0;

  for (const category of RETENTION_ORDER) {
    const candidates = await adapter.countCandidates({
      organizationId: options.organizationId,
      category,
    });
    categories[category].candidates = candidates;
    if (options.mode === 'dry-run') continue;

    for (;;) {
      await assertCurrentGuard(adapter, options);
      const ids = await adapter.listCandidateIds({
        organizationId: options.organizationId,
        category,
        limit: options.batchSize,
      });
      if (ids.length === 0) break;
      if (new Set(ids).size !== ids.length || ids.some((id) => !id))
        throw new Error('Adapter returned invalid candidate IDs.');

      const result = await adapter.applyAtomicBatch({
        organizationId: options.organizationId,
        category,
        ids,
        expectedPolicyVersion: options.policyVersion,
        expectedLegalHold: false,
      });
      if (!result.protectedRelationsDetached)
        throw new Error('Adapter could not prove relationship safety.');
      if (result.affected !== ids.length)
        throw new Error(
          'Atomic batch affected count did not match the reviewed candidate set.'
        );

      categories[category].applied += result.affected;
      categories[category].batches += 1;
      applied += result.affected;
    }
  }

  return {
    organizationId: options.organizationId,
    policyVersion: options.policyVersion,
    mode: options.mode,
    applied,
    categories,
  };
}
