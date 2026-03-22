import { prisma } from '@gate-access/db';

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
  metadata
}: AuditLogOptions) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        userId,
        organizationId: orgId,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
      }
    });
  } catch (error) {
    // We don't want to throw an error back to the user if logging fails
    console.error('[AuditLog] Failed to record action:', error);
  }
}
