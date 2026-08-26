import { prisma, createChainedAuditLog } from '@gate-access/db';

interface AuditLogOptions {
  action: string;
  entityType: string;
  entityId?: string;
  userId?: string;
  orgId: string;
  metadata?: Record<string, unknown>;
}

export async function logAuditAction({
  action,
  entityType,
  entityId,
  userId,
  orgId,
  metadata,
}: AuditLogOptions) {
  try {
    return await createChainedAuditLog(prisma, {
      action,
      entityType,
      entityId,
      userId,
      organizationId: orgId,
      metadata,
    });
  } catch (error) {
    // We don't want to throw an error back to the user if logging fails
    console.error('[AuditLog] Failed to record action:', error);
    return null;
  }
}
