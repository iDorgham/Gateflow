import { useCallback } from 'react';
import { auditService } from '../services/auditService';
import { type AuditAction, type AuditLogEntry } from '../types';

export interface UseAuditLoggerResult {
  logAudit: (
    action: AuditAction,
    metadata?: Record<string, unknown>,
    unitId?: string,
    organizationId?: string
  ) => Promise<AuditLogEntry>;
  flushAuditQueue: () => Promise<number>;
  getLocalAuditLedger: () => Promise<AuditLogEntry[]>;
}

export function useAuditLogger(): UseAuditLoggerResult {
  const logAudit = useCallback(
    async (
      action: AuditAction,
      metadata?: Record<string, unknown>,
      unitId?: string,
      organizationId?: string
    ): Promise<AuditLogEntry> => {
      return auditService.logEvent(action, {
        metadata,
        unitId,
        organizationId,
      });
    },
    []
  );

  const flushAuditQueue = useCallback(async (): Promise<number> => {
    return auditService.flushUnsyncedEntries();
  }, []);

  const getLocalAuditLedger = useCallback(async (): Promise<
    AuditLogEntry[]
  > => {
    return auditService.getLocalLedger();
  }, []);

  return {
    logAudit,
    flushAuditQueue,
    getLocalAuditLedger,
  };
}
