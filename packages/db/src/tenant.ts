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
      READ_OPS.has(operation) &&
      (next.where as Record<string, unknown> | undefined)?.deletedAt ===
        undefined
    ) {
      whereExtra.deletedAt = null;
    }
    next.where = mergeWhere(
      next.where as Record<string, unknown> | undefined,
      whereExtra
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

  if (operation === 'createMany') {
    const data = next.data;
    if (Array.isArray(data)) {
      next.data = data.map((row) => {
        const r = { ...(row as Record<string, unknown>) };
        if (
          typeof r.organizationId === 'string' &&
          r.organizationId !== orgId
        ) {
          throw new TenantContextError(
            `Cross-tenant createMany rejected for ${model}`
          );
        }
        r.organizationId = orgId;
        return r;
      });
    }
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
    next.where = mergeWhere(next.where as Record<string, unknown> | undefined, {
      organizationId: orgId,
    });
  }

  return next;
}

function applyScanLogGuards(
  operation: string,
  args: Record<string, unknown> | undefined
): Record<string, unknown> | undefined {
  const orgId = requireOrgId('scanLog', operation);
  const next: Record<string, unknown> = { ...(args ?? {}) };
  const where = {
    ...((next.where as Record<string, unknown>) ?? {}),
  };
  const gate = {
    ...((where.gate as Record<string, unknown>) ?? {}),
    organizationId: orgId,
  };
  where.gate = gate;
  next.where = where;
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
