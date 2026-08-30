import * as SecureStore from 'expo-secure-store';
import { residentFetch } from '../../../../lib/api';
import { type AuditLogEntry, type AuditAction } from '../types';

const AUDIT_LEDGER_STORAGE_KEY = 'gateflow_audit_ledger';
const MAX_LOCAL_ENTRIES = 100;

class AuditService {
  private sequenceCounter: number = 0;
  private isFlushing: boolean = false;

  public async getLocalLedger(): Promise<AuditLogEntry[]> {
    try {
      const raw = await SecureStore.getItemAsync(AUDIT_LEDGER_STORAGE_KEY, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      if (!raw) return [];
      return JSON.parse(raw) as AuditLogEntry[];
    } catch {
      return [];
    }
  }

  private async saveLocalLedger(entries: AuditLogEntry[]): Promise<void> {
    try {
      const trimmed = entries.slice(-MAX_LOCAL_ENTRIES);
      await SecureStore.setItemAsync(
        AUDIT_LEDGER_STORAGE_KEY,
        JSON.stringify(trimmed),
        {
          keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        }
      );
    } catch (e) {
      console.warn('[AuditService] Failed to save ledger:', e);
    }
  }

  public async logEvent(
    action: AuditAction,
    options?: {
      actorId?: string;
      organizationId?: string;
      unitId?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<AuditLogEntry> {
    this.sequenceCounter += 1;

    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sequenceNumber: this.sequenceCounter,
      action,
      timestamp: new Date().toISOString(),
      actorId: options?.actorId,
      organizationId: options?.organizationId,
      unitId: options?.unitId,
      metadata: options?.metadata,
      synced: false,
    };

    const currentLedger = await this.getLocalLedger();
    const updated = [...currentLedger, entry];
    await this.saveLocalLedger(updated);

    // Trigger non-blocking background sync
    this.flushUnsyncedEntries().catch(() => {});

    return entry;
  }

  public async flushUnsyncedEntries(): Promise<number> {
    if (this.isFlushing) return 0;
    this.isFlushing = true;

    try {
      const ledger = await this.getLocalLedger();
      const unsynced = ledger.filter((e) => !e.synced);

      if (unsynced.length === 0) {
        this.isFlushing = false;
        return 0;
      }

      try {
        const res = await residentFetch('/resident/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entries: unsynced }),
        });

        if (res.ok) {
          const marked = ledger.map((e) => ({ ...e, synced: true }));
          await this.saveLocalLedger(marked);
          this.isFlushing = false;
          return unsynced.length;
        }
      } catch {
        // Offline or backend unavailable, will retry next event
      }

      this.isFlushing = false;
      return 0;
    } catch {
      this.isFlushing = false;
      return 0;
    }
  }
}

export const auditService = new AuditService();
