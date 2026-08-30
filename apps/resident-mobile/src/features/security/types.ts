export type AuditAction =
  | 'AUTH_BIOMETRIC_SUCCESS'
  | 'AUTH_BIOMETRIC_FAIL'
  | 'AUTH_PIN_SUCCESS'
  | 'AUTH_PIN_FAIL'
  | 'PASS_GENERATED'
  | 'PASS_SHARED'
  | 'GATE_UNLOCKED_REMOTE'
  | 'ENTRY_REJECTED'
  | 'SESSION_TIMEOUT_LOCKED'
  | 'SETTINGS_UPDATED';

export interface AuditLogEntry {
  id: string;
  sequenceNumber: number;
  action: AuditAction;
  timestamp: string;
  actorId?: string;
  organizationId?: string;
  unitId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  synced: boolean;
}

export interface PiiMaskingOptions {
  preservePrefixLength?: number;
  preserveSuffixLength?: number;
  maskCharacter?: string;
}
