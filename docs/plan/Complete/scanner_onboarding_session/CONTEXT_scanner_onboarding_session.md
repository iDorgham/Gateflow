# CONTEXT: Scanner App — Onboarding & Session Management

**Slug:** `scanner_onboarding_session`  
**Plan:** `PLAN_scanner_onboarding_session.md`

---

## Architectural Context

- **App**: `apps/scanner-app` (Expo SDK 57 / React Native 0.86 / React 19)
- **Token System**: `@gateflow/ui/tokens` (`nativeTokens` for React Native `StyleSheet`)
- **Key Modules**:
  - `expo-local-authentication`: Biometric hardware detection and verification.
  - `expo-secure-store`: Encrypted key-value vault for PIN salts and session tokens.
  - `expo-camera`: QR barcode scanning.
  - `expo-haptics`: Tactile feedback on scan decisions.
- **Backend Services**:
  - Next.js API routes under `apps/client-dashboard/src/app/api/scanner/shift/`
  - Prisma `ShiftLog` model in `packages/db`
