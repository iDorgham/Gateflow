# Phase Log — 01 Security wiring & QR fail-closed

**Plan:** `scanner_onboarding_session`  
**Completed:** 2026-08-01  
**Branch:** `feat/scanner_onboarding_session`  
**App:** `scanner-app`

## What shipped

- `src/lib/security/qr-secret.ts` — fail-closed QR HMAC secret resolution outside explicit dev
- `src/lib/security/device-unlock.ts` — unlock requirement evaluation helpers
- `src/components/DeviceUnlockScreen.tsx` — post-login PIN/biometry unlock UI
- `App.tsx` — `unlock` phase between login and scanner; scan path uses `resolveRuntimeQrSecret()`

## Commands / evidence

```bash
pnpm --filter scanner-app test
# Test Suites: 6 passed | Tests: 81 passed
pnpm --filter scanner-app lint  # green
```

Pre-existing `tsc --noEmit` noise in legacy `*.test.ts` (`global` / `@jest/globals`) — no new errors in Phase 01 files.

## Decisions

- Unlock required only when PIN and/or biometry already enrolled (wizard enrolls in Phase 02).
- Explicit development allows empty secret via `__DEV__` or `EXPO_PUBLIC_ALLOW_INSECURE_QR=1|true`.
- No Expo Router migration; kept single-shell model.

## Errors / fixes

- `nativeTokensNewEra` uses `spacing['space-N']` (not `space` / `borderRadius` from base tokens) — fixed in unlock screen styles.

## Next

- `/dev` Phase 02 — onboarding wizard UI
- Do not claim device pilot evidence yet
