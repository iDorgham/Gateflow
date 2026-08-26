---
name: expo-offline-sync
description: Specialized workflows and patterns for expo-offline-sync.
---

# SKILL: Expo Offline Sync & Queue Management

## Purpose

Ensure the GateFlow Scanner and Resident apps remain operational without an active internet connection, synchronizing data reliably once connectivity is restored.

## Core Principles

1.  **Offline-First**: User actions must be recorded locally first (SQLite/WatermelonDB) to ensure zero latency.
2.  **Idempotent Retries**: Sync operations must be idempotent; multiple attempts at the same sync must not create duplicate records.
3.  **Conflict Resolution**: Use "Last Write Wins" or timestamp-based merging to resolve conflicts between local and remote states.

## Implementation Rules

- **Local Storage**: Use `expo-sqlite` or `react-native-mmkv` for high-frequency offline logs.
- **Sync Queue**: Store actions in a `PendingActions` table with `retryCount` and `lastError`.
- **Background Sync**: Trigger sync via `expo-task-manager` when the device comes back online.

## Anti-Patterns

- Blocking the UI waiting for a network response (always return immediately with "Local Success").
- Storing large file blobs (photos) in the sync queue; store the file path instead.
- Retrying infinitely on "Permanent" errors (400 Bad Request); move these to a "Failed" queue for manual review.

## Code Examples

### Sync Queue Entry (TypeScript)

```typescript
interface PendingAction {
  id: string; // UUID
  type: 'SCAN_LOG' | 'GUEST_INVITE';
  payload: string; // JSON stringify
  createdAt: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED';
}

export const addToQueue = async (action: Omit<PendingAction, 'status'>) => {
  await db.executeAsync(
    'INSERT INTO pending_actions (id, type, payload, createdAt, status) VALUES (?, ?, ?, ?, ?)',
    [action.id, action.type, action.payload, action.createdAt, 'PENDING']
  );
};
```

### Exponential Backoff Logic

```typescript
const getNextRetry = (count: number) => {
  return Date.now() + Math.pow(2, count) * 1000;
};
```
