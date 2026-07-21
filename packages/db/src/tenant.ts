/**
 * Request-local tenant isolation for Prisma access.
 *
 * - Context lives in AsyncLocalStorage (no process-global bleed).
 * - Tenant `db` fails closed when organization context is missing.
 * - Soft-deletable models default to `deletedAt: null` on reads.
 * - Use `privilegedDb` / `runPrivileged*` only for reviewed global admin paths.
 *
 * PostgreSQL RLS is intentionally deferred; see phase log RLS decision.
 */
import { AsyncLocalStorage } from 'node:async_hooks';
import { prisma as basePrisma } from './client';

export type OrganizationContext = {
  organizationId: string | null;
};

export class TenantContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TenantContextError';
  }
}

type AlsStore = {
  organizationId: string | null;
  mode: 'tenant' | 'privileged';
};

const als = new AsyncLocalStorage<AlsStore>();

/** Prisma client delegate keys for models with organizationId. */
const TENANT_MODELS = new Set([
  'project',
  'vendor',
  'role',
  'user',
  'invitation',
  'task',
  'chatMessage',
  'gateAssignment',
  'shiftLog',
  'gate',
  'watchlistEntry',
  'incident',
  'scanAttachment',
  'qRCode',
  'auditLog',
  'webhook',
  'apiKey',
  'adminAuthorizationKey',
  'qrShortLink',
  'shortLinkClick',
  'tag',
  'contact',
  'unit',
  'residentLimit',
  'eventLog',
  'aiTask',
  'aiActionLog',
  'aiAutomation',
  'organizationCommunicationConfig',
  'communicationLog',
  'workOrder',
  'merchant',
  'service',
  'serviceBooking',
  'aiGeneratedAsset',
  'lead',
  'deal',
  'knowledgeSource',
  'knowledgeItem',
  'taskBoard',
  'taskBotRule',
  'notification',
  'organizationBranding',
  'brandingSnapshot',
  'landingPage',
  'blogPost',
  'supportTicket',
  'taskBot',
]);

/** Prisma client delegate keys for models with deletedAt. */
const SOFT_DELETE_MODELS = new Set([
  'organization',
  'project',
  'vendor',
  'user',
  'task',
  'gateAssignment',
  'gate',
  'watchlistEntry',
  'qRCode',
  'webhook',
  'tag',
  'contact',
  'unit',
  'aiAutomation',
  'workOrder',
  'merchant',
  'service',
  'serviceBooking',
  'lead',
  'deal',
  'supportTicket',
]);

const READ_OPS = new Set([
  'findUnique',
  'findUniqueOrThrow',
  'findFirst',
  'findFirstOrThrow',
  'findMany',
  'count',
  'aggregate',
  'groupBy',
]);

const WRITE_WHERE_OPS = new Set([
  'update',
  'updateMany',
  'delete',
  'deleteMany',
  'upsert',
]);

function currentStore(): AlsStore | undefined {
  return als.getStore();
}

export function runWithOrganization<T>(organizationId: string, fn: () => T): T {
  if (!organizationId) {
    throw new TenantContextError('organizationId is required');
  }
  return als.run({ organizationId, mode: 'tenant' }, fn);
}

export function runWithOrganizationAsync<T>(
  organizationId: string,
  fn: () => Promise<T>
): Promise<T> {
  if (!organizationId) {
    return Promise.reject(new TenantContextError('organizationId is required'));
  }
  return als.run({ organizationId, mode: 'tenant' }, fn);
}

export function runPrivileged<T>(fn: () => T): T {
  return als.run({ organizationId: null, mode: 'privileged' }, fn);
}

export function runPrivilegedAsync<T>(fn: () => Promise<T>): Promise<T> {
  return als.run({ organizationId: null, mode: 'privileged' }, fn);
}

/**
 * Middleware-friendly enterWith. Prefer `runWithOrganization*` when possible.
 * Clearing / null org puts the async context in fail-closed tenant mode.
 */
export function setOrganizationContext(context: OrganizationContext): void {
  als.enterWith({
    organizationId: context.organizationId,
    mode: 'tenant',
  });
}

export function getOrganizationContext(): OrganizationContext {
  const store = currentStore();
  return { organizationId: store?.organizationId ?? null };
}

export function clearOrganizationContext(): void {
  als.enterWith({ organizationId: null, mode: 'tenant' });
}

export function isPrivilegedContext(): boolean {
  return currentStore()?.mode === 'privileged';
}

function requireOrgId(model: string, operation: string): string {
  const store = currentStore();
  if (!store?.organizationId) {
    throw new TenantContextError(
      `Missing organization context for ${model}.${operation}`
    );
  }
  return store.organizationId;
}

function mergeWhere(
  existing: Record<string, unknown> | undefined,
  extra: Record<string, unknown>
): Record<string, unknown> {
  return { ...(existing ?? {}), ...extra };
}

function applyTenantGuards(
  model: string,
  operation: string,
  args: Record<string, unknown> | undefined
): Record<string, unknown> | undefined {
  const orgId = requireOrgId(model, operation);
  const next: Record<string, unknown> = { ...(args ?? {}) };

  if (READ_OPS.has(operation) || WRITE_WHERE_OPS.has(operation)) {
    const whereExtra: Record<string, unknown> = { organizationId: orgId };
    if (
      SOFT_DELETE_MODELS.has(model) &&
      (next.where as Record<string, unknown> | undefined)?.deletedAt ===
        undefined
    ) {
      // Applies to reads AND writes: a soft-deleted row must not be
      // readable, mutable, or re-deletable through the tenant client.
      whereExtra.deletedAt = null;
    }
    next.where = mergeWhere(
      next.where as Record<string, unknown> | undefined,
      whereExtra
    );
  }

  if (
    SOFT_DELETE_MODELS.has(model) &&
    (operation === 'delete' || operation === 'deleteMany')
  ) {
    throw new TenantContextError(
      `Hard delete rejected for ${model}.${operation} — use update({ data: { deletedAt: new Date() } }) instead`
    );
  }

  if (operation === 'create') {
    const data = { ...((next.data as Record<string, unknown>) ?? {}) };
    if (
      typeof data.organizationId === 'string' &&
      data.organizationId !== orgId
    ) {
      throw new TenantContextError(
        `Cross-tenant create rejected for ${model} (got ${data.organizationId}, expected ${orgId})`
      );
    }
    data.organizationId = orgId;
    next.data = data;
  }

  if (operation === 'createMany' || operation === 'createManyAndReturn') {
    // Prisma's createMany `data` accepts a single object or an array
    // (Enumerable<T>) — guard both shapes, not just the array case.
    const isArray = Array.isArray(next.data);
    const rows = (
      isArray
        ? (next.data as Record<string, unknown>[])
        : [(next.data ?? {}) as Record<string, unknown>]
    ).map((row) => {
      const r = { ...row };
      if (typeof r.organizationId === 'string' && r.organizationId !== orgId) {
        throw new TenantContextError(
          `Cross-tenant createMany rejected for ${model}`
        );
      }
      r.organizationId = orgId;
      return r;
    });
    next.data = isArray ? rows : rows[0];
  }

  if (operation === 'update' || operation === 'updateMany') {
    next.data = rejectOrgReassignment(
      model,
      operation,
      orgId,
      (next.data as Record<string, unknown>) ?? {}
    );
  }

  if (operation === 'upsert') {
    const create = {
      ...((next.create as Record<string, unknown>) ?? {}),
    };
    if (
      typeof create.organizationId === 'string' &&
      create.organizationId !== orgId
    ) {
      throw new TenantContextError(`Cross-tenant upsert rejected for ${model}`);
    }
    create.organizationId = orgId;
    next.create = create;
    next.update = rejectOrgReassignment(
      model,
      operation,
      orgId,
      (next.update as Record<string, unknown>) ?? {}
    );
    next.where = mergeWhere(next.where as Record<string, unknown> | undefined, {
      organizationId: orgId,
    });
  }

  return next;
}

/**
 * organizationId is immutable post-creation: reject any tenant write that
 * tries to change it (moving a row into another org), rather than silently
 * dropping or forwarding the field.
 */
function rejectOrgReassignment(
  model: string,
  operation: string,
  orgId: string,
  data: Record<string, unknown>
): Record<string, unknown> {
  if ('organizationId' in data && data.organizationId !== orgId) {
    throw new TenantContextError(
      `Cross-tenant ${operation} rejected for ${model} (cannot reassign organizationId)`
    );
  }
  const next = { ...data };
  delete next.organizationId;
  return next;
}

function applyScanLogGuards(
  operation: string,
  args: Record<string, unknown> | undefined
): Record<string, unknown> | undefined {
  const orgId = requireOrgId('scanLog', operation);

  if (operation === 'create' || operation === 'createMany') {
    // scanLog has no organizationId of its own (scoped via gate) and no
    // synchronous way to verify gate ownership here. Rather than forward
    // create args through a `where`-only guard (invalid for Prisma create,
    // and unchecked), reject — callers must validate gate ownership
    // themselves and write via `privilegedDb.scanLog` / a `$transaction`,
    // matching the existing call sites in the codebase.
    throw new TenantContextError(
      `db.scanLog.${operation} is not supported on the tenant client — validate gate ownership and use privilegedDb.scanLog.${operation} (or a $transaction) instead`
    );
  }

  const next: Record<string, unknown> = { ...(args ?? {}) };
  const where = {
    ...((next.where as Record<string, unknown>) ?? {}),
  };
  const gate = {
    ...((where.gate as Record<string, unknown>) ?? {}),
    organizationId: orgId,
  };
  where.gate = gate;
  if (READ_OPS.has(operation) || WRITE_WHERE_OPS.has(operation)) {
    next.where = where;
  }
  return next;
}

function wrapDelegate(model: string, delegate: object): object {
  return new Proxy(delegate, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof prop !== 'string' || typeof value !== 'function') {
        return value;
      }
      return (...fnArgs: unknown[]) => {
        try {
          const [first, ...rest] = fnArgs;
          const guarded = applyTenantGuards(
            model,
            prop,
            first as Record<string, unknown> | undefined
          );
          return (value as (...a: unknown[]) => unknown).apply(target, [
            guarded,
            ...rest,
          ]);
        } catch (err) {
          return Promise.reject(err);
        }
      };
    },
  });
}

function wrapScanLogDelegate(delegate: object): object {
  return new Proxy(delegate, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof prop !== 'string' || typeof value !== 'function') {
        return value;
      }
      return (...fnArgs: unknown[]) => {
        try {
          const [first, ...rest] = fnArgs;
          const guarded = applyScanLogGuards(
            prop,
            first as Record<string, unknown> | undefined
          );
          return (value as (...a: unknown[]) => unknown).apply(target, [
            guarded,
            ...rest,
          ]);
        } catch (err) {
          return Promise.reject(err);
        }
      };
    },
  });
}

/** Build a tenant-scoped client over any Prisma-like object (used in tests). */
export function createTenantScopedClient<T extends object>(client: T): T {
  return new Proxy(client, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof prop !== 'string') return value;
      if (
        prop === '$transaction' ||
        prop === '$queryRaw' ||
        prop === '$executeRaw' ||
        prop === '$queryRawUnsafe' ||
        prop === '$executeRawUnsafe' ||
        prop === '$extends'
      ) {
        throw new TenantContextError(`${prop} is privileged-only`);
      }

      if (prop === 'scanLog' && value && typeof value === 'object') {
        return wrapScanLogDelegate(value);
      }

      if (TENANT_MODELS.has(prop) && value && typeof value === 'object') {
        return wrapDelegate(prop, value);
      }

      return value;
    },
  }) as T;
}

/**
 * Tenant-scoped Prisma client. Requires organization context for tenant models.
 * Does not wrap `$transaction` / `$queryRaw` — those stay privileged-only.
 */
export const db = createTenantScopedClient(basePrisma);

/** Explicit privileged / platform-admin client (no automatic tenant filter). */
export const privilegedDb = basePrisma;

export type DbClient = typeof db;
