---
name: gateflow-mobile
description: Expo SDK 54, React Native, and mobile patterns for GateFlow scanner and resident apps. Use when working on scanner-app, resident-mobile, offline sync, or mobile features.
---

# GateFlow Mobile

## Stack

- **Framework**: React Native + Expo SDK 54
- **Navigation**: Expo Router
- **Storage**: AsyncStorage (general), SecureStore (tokens)
- **Camera**: expo-camera
- **Location**: expo-location
- **Offline**: Encrypted queue (AES-256 + PBKDF2)

## Scanner App Key Flows

1. **Offline-first** — Scans queued locally when offline
2. **HMAC verification** — Verify QR signature locally before network
3. **Sync** — Bulk sync via `/api/scans/bulk` when online
4. **Dedup** — `scanUuid` is the deduplication key (do not change)
5. **Supervisor override** — PIN + reason, audit logged

## Critical Patterns

### Token storage (SecureStore only)

```typescript
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('accessToken', token);
const token = await SecureStore.getItemAsync('accessToken');
await SecureStore.deleteItemAsync('accessToken'); // logout
```

### Offline queue (scanner-app)

- `apps/scanner-app/src/lib/offline-queue.ts` — queue logic
- `apps/scanner-app/src/lib/qr-verify.ts` — HMAC verification
- Never break `scanUuid` dedup contract

### QR scan handler

```typescript
const handleBarCodeScanned = async ({ data }: { data: string }) => {
  if (!verifyQRSignature(data)) {
    showError('Invalid QR');
    return;
  }
  await processScan(data); // Queue if offline, sync when online
};
```

### Location (non-blocking)

```typescript
const loc = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Balanced,
});
// Include in scan context; don't block on failure
```

## Commands

```bash
cd apps/scanner-app
pnpm start           # Metro bundler
pnpm ios             # iOS simulator
pnpm android         # Android emulator
pnpm start -- --clear
```

## Mobile Checklist

- [ ] Handle offline for network ops
- [ ] SecureStore for tokens (never AsyncStorage)
- [ ] Request permissions before camera/location
- [ ] Haptic feedback on scan
- [ ] Loading states for API calls
- [ ] Test iOS and Android

## Key Files

- `apps/scanner-app/src/lib/offline-queue.ts`
- `apps/scanner-app/src/lib/qr-verify.ts`
- `apps/scanner-app/src/lib/auth-client.ts`
- `apps/client-dashboard/src/app/api/scans/bulk/route.ts`

**Reference:** `CLAUDE.md` Scanner App section, `docs/APP_DESIGN_DOCS.md`
