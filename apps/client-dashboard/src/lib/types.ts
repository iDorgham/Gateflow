/**
 * Type utilities for bridging role types with application types
 */

/** Known role names (Role.name from Prisma) */
export type AppUserRole = 'ADMIN' | 'TENANT_ADMIN' | 'TENANT_USER' | 'VISITOR' | 'RESIDENT';

/**
 * Validate that a string is a valid AppUserRole
 */
export function isUserRole(value: unknown): value is AppUserRole {
  return (
    typeof value === 'string' &&
    (value === 'ADMIN' ||
      value === 'TENANT_ADMIN' ||
      value === 'TENANT_USER' ||
      value === 'VISITOR' ||
      value === 'RESIDENT')
  );
}

/**
 * Safe cast from role string to AppUserRole
 */
export function castUserRole(role: string): AppUserRole {
  if (!isUserRole(role)) {
    throw new Error(`Invalid user role: ${role}`);
  }
  return role;
}

/**
 * Type for audit trail entries
 */
export interface AuditTrailEntry {
  timestamp: string;
  action: string;
  resolvedBy: 'lww' | 'server' | 'client';
  details: Record<string, unknown>;
}

/**
 * Type for Prisma JSON field access
 */
export interface PrismaJsonField<T> {
  [key: string]: T;
}

/**
 * Get auditTrail from a Prisma ScanLog result
 */
export function getAuditTrail(scanLog: {
  auditTrail?: unknown[];
}): AuditTrailEntry[] {
  return (scanLog.auditTrail ?? []) as AuditTrailEntry[];
}
