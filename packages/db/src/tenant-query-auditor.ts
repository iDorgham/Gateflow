/**
 * tenant-query-auditor.ts — Automated Tenant Query Scoping & Soft-Delete Auditor
 *
 * Validates Prisma query arguments at runtime or static check time to ensure:
 * 1. Tenant models include mandatory `organizationId` filtering.
 * 2. Soft-deletable models include `deletedAt: null` on read operations.
 * 3. Prevents cross-tenant leaks caused by unconstrained query arguments.
 */

export class TenantScopingViolationError extends Error {
  constructor(
    public readonly modelName: string,
    public readonly operation: string,
    public readonly violations: string[],
    public readonly queryArgs?: any
  ) {
    super(
      `[TenantQueryAuditor] Tenant scoping violation on ${modelName}.${operation}: ${violations.join(', ')}`
    );
    this.name = 'TenantScopingViolationError';
  }
}

export interface QueryAuditResult {
  scoped: boolean;
  isTenantModel: boolean;
  isSoftDeleteModel: boolean;
  hasOrganizationId: boolean;
  hasSoftDeleteFilter: boolean;
  violations: string[];
}

export interface QueryAuditOptions {
  allowPrivileged?: boolean;
  enforceSoftDelete?: boolean;
  expectedOrgId?: string;
}

/** Prisma models that strictly belong to an organization. */
export const TENANT_SCOPED_MODELS = new Set([
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

/** Prisma models that define a deletedAt column for soft deletes. */
export const SOFT_DELETE_MODELS = new Set([
  'organization',
  'project',
  'vendor',
  'user',
  'task',
  'gateAssignment',
  'gate',
  'watchlistEntry',
  'incident',
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

const READ_OPERATIONS = new Set([
  'findUnique',
  'findUniqueOrThrow',
  'findFirst',
  'findFirstOrThrow',
  'findMany',
  'count',
  'aggregate',
  'groupBy',
]);

const MUTATION_WHERE_OPERATIONS = new Set([
  'update',
  'updateMany',
  'delete',
  'deleteMany',
  'upsert',
]);

/**
 * Normalizes model name to lowerCamelCase for consistent matching.
 */
function normalizeModelName(model: string): string {
  if (!model) return '';
  return model.charAt(0).toLowerCase() + model.slice(1);
}

/**
 * Checks if a where clause contains organizationId.
 */
function hasOrgIdInWhere(where: any, expectedOrgId?: string): boolean {
  if (!where || typeof where !== 'object') return false;

  if (where.organizationId !== undefined && where.organizationId !== null) {
    if (expectedOrgId) {
      return where.organizationId === expectedOrgId;
    }
    return true;
  }

  // Check nested logical operators: AND, OR
  if (Array.isArray(where.AND)) {
    return where.AND.some((w: any) => hasOrgIdInWhere(w, expectedOrgId));
  }

  return false;
}

/**
 * Checks if a where clause contains deletedAt: null filter.
 */
function hasSoftDeleteInWhere(where: any): boolean {
  if (!where || typeof where !== 'object') return false;

  if (where.deletedAt === null) {
    return true;
  }

  if (Array.isArray(where.AND)) {
    return where.AND.some((w: any) => hasSoftDeleteInWhere(w));
  }

  return false;
}

/**
 * Checks if create/upsert data contains organizationId.
 */
function hasOrgIdInData(data: any, expectedOrgId?: string): boolean {
  if (!data || typeof data !== 'object') return false;

  if (data.organizationId !== undefined && data.organizationId !== null) {
    if (expectedOrgId) {
      return data.organizationId === expectedOrgId;
    }
    return true;
  }

  if (data.organization && typeof data.organization === 'object') {
    if (data.organization.connect && data.organization.connect.id) {
      if (expectedOrgId) {
        return data.organization.connect.id === expectedOrgId;
      }
      return true;
    }
  }

  return false;
}

/**
 * Audits a Prisma query invocation for tenant isolation and soft-delete compliance.
 */
export function auditPrismaQuery(
  model: string,
  operation: string,
  queryArgs: any = {},
  options: QueryAuditOptions = {}
): QueryAuditResult {
  if (options.allowPrivileged) {
    return {
      scoped: true,
      isTenantModel: false,
      isSoftDeleteModel: false,
      hasOrganizationId: true,
      hasSoftDeleteFilter: true,
      violations: [],
    };
  }

  const normalizedModel = normalizeModelName(model);
  const isTenantModel = TENANT_SCOPED_MODELS.has(normalizedModel);
  const isSoftDeleteModel = SOFT_DELETE_MODELS.has(normalizedModel);
  const violations: string[] = [];

  let hasOrganizationId = false;

  if (isTenantModel) {
    if (
      READ_OPERATIONS.has(operation) ||
      MUTATION_WHERE_OPERATIONS.has(operation)
    ) {
      hasOrganizationId = hasOrgIdInWhere(
        queryArgs?.where,
        options.expectedOrgId
      );
      if (!hasOrganizationId) {
        violations.push(
          `Missing or invalid "organizationId" in where clause for tenant model "${model}"`
        );
      }
    } else if (operation === 'create' || operation === 'createMany') {
      if (Array.isArray(queryArgs?.data)) {
        const allHaveOrg = queryArgs.data.every((d: any) =>
          hasOrgIdInData(d, options.expectedOrgId)
        );
        hasOrganizationId = allHaveOrg;
        if (!allHaveOrg) {
          violations.push(
            `One or more items in createMany "data" missing "organizationId" for tenant model "${model}"`
          );
        }
      } else {
        hasOrganizationId = hasOrgIdInData(
          queryArgs?.data,
          options.expectedOrgId
        );
        if (!hasOrganizationId) {
          violations.push(
            `Missing "organizationId" in create "data" for tenant model "${model}"`
          );
        }
      }
    }
  } else {
    hasOrganizationId = true; // Not a tenant model
  }

  let hasSoftDeleteFilter = true;
  if (isSoftDeleteModel && READ_OPERATIONS.has(operation)) {
    hasSoftDeleteFilter = hasSoftDeleteInWhere(queryArgs?.where);
    if (options.enforceSoftDelete && !hasSoftDeleteFilter) {
      violations.push(
        `Missing "deletedAt: null" filter in where clause for soft-deletable model "${model}"`
      );
    }
  }

  const scoped = violations.length === 0;

  return {
    scoped,
    isTenantModel,
    isSoftDeleteModel,
    hasOrganizationId,
    hasSoftDeleteFilter,
    violations,
  };
}

/**
 * Asserts that a Prisma query is properly tenant-scoped, throwing if unconstrained.
 */
export function assertTenantScoped(
  model: string,
  operation: string,
  queryArgs: any = {},
  options: QueryAuditOptions = {}
): QueryAuditResult {
  const result = auditPrismaQuery(model, operation, queryArgs, options);
  if (!result.scoped) {
    throw new TenantScopingViolationError(
      model,
      operation,
      result.violations,
      queryArgs
    );
  }
  return result;
}
