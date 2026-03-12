## Phase 5: Resident mobile foundation (Expo app)

### Primary role

MOBILE  
Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

Load these skills when implementing (from `.cursor/skills/`):

- [x] gf-mobile — Expo, React Native, offline patterns
- [x] react — component patterns and hooks
- [ ] gf-testing — tests for mobile logic (optional)

### MCP to use

| MCP      | When                                             |
|----------|--------------------------------------------------|
| Context7 | Expo/React Native/TypeScript patterns as needed  |

### Preferred tool

- [x] Cursor (default)

### Context

- **App**: `apps/resident-mobile` (new or expanded)
- **Packages**: `@gate-access/api-client`, `@gate-access/types`, `@gate-access/i18n`
- **Rules**:  
  - Tokens must be stored in SecureStore, not AsyncStorage.  
  - No direct DB access from mobile; use resident APIs created in previous phases.  
  - Offline-friendly QR display is important (cache recent QRs).
- **Refs**: `apps/scanner-app` for mobile auth/storage patterns, `docs/PRD_v6.0.md` section 14 (Resident Mobile Enhancement Plan)

### Goal

Deliver a minimal but functional resident mobile app that lets residents log in, view their visitor QRs, display them offline, and share QR links via native share sheets.

### Scope (in)

- Scaffold or refine `apps/resident-mobile` with:
  - Auth flow for RESIDENT users (login screen, token handling).
  - Screens for listing visitor QRs and viewing a QR detail.
  - Native share integration (WhatsApp/Email/SMS) for sending QR links.
- Implement offline-capable QR display via local caching of recent QRs.

### Scope (out)

- Push notification handling (scan/arrival notifications are future work built on the pipeline from Phase 4).
- Full resident delight features (quota widget, templates, etc.) — can be later sub-phases.

### Steps (ordered)

1. Inspect `apps/scanner-app` and any existing `apps/resident-mobile` code (if present) for:
   - Auth patterns (SecureStore, API client).
   - App structure (navigation, screens).
2. Ensure `apps/resident-mobile` has a working Expo/TypeScript setup and basic navigation (e.g. using `expo-router` if already chosen).
3. Implement auth:
   - Login screen that calls resident auth endpoints and stores tokens in SecureStore.
   - Bootstrapping logic to restore session and navigate to main app if already logged in.
4. Add screens:
   - Visitor QR List: fetch from resident APIs and display basic metadata and status.
   - Visitor QR Detail: show QR (image or link representation) and actions for sharing.
5. Implement offline QR display:
   - Cache recently fetched QR payloads (and any image/link data) using AsyncStorage or another local store.
   - Ensure QR detail can render from cache when offline.
6. Implement share:
   - Use `expo-sharing` and/or `expo-linking`/native share sheets to send QR links via WhatsApp/Email/SMS, with pre-filled message.
7. Run:
   - `pnpm turbo lint --filter=resident-mobile`
   - `pnpm turbo typecheck --filter=resident-mobile`
   - Manual smoke via `pnpm turbo dev --filter=resident-mobile` (or `expo start`) testing login, list, detail, and share.

### SuperDesign (optional — for UI phases)

- **SuperDesign:** Optionally design the core resident mobile screens (login, QR list, QR detail) before refining styling and interactions.

### Subagents (optional)

| Subagent | When | Prompt |
|----------|------|--------|
| **explore** | Reuse patterns from scanner app | "Summarize how auth and token storage are implemented in `apps/scanner-app/src/lib/auth-client.ts` and related files, focusing on SecureStore and API usage." |
| **browser-use** | Not applicable (mobile app) | — |

### Commands (when to run)

- Before phase: `/ready` if you want a clean preflight state.
- After phase: `/github` — commit resident-mobile changes with a message like `feat(resident-mobile): foundation with auth and QR list/detail`.

### Acceptance criteria

**Checklist:**

- [ ] Resident mobile app builds and runs via Expo.
- [ ] RESIDENT users can log in and reach main screens.
- [ ] Visitor QR list and detail screens are implemented and wired to resident APIs.
- [ ] QR detail screens can show cached QR data offline.
- [ ] Native share sheet can send QR links via at least one channel (e.g. WhatsApp or Email).
- [ ] `pnpm turbo lint --filter=resident-mobile` passes.
- [ ] `pnpm turbo typecheck --filter=resident-mobile` passes.

**Given/When/Then (optional):**

- **Given** a resident who has created visitor QRs in the web portal, **When** they open the resident mobile app and log in, **Then** they should see a list of those QRs and be able to open a detail view and share it.

### Files likely touched

- `apps/resident-mobile/app/*` or `apps/resident-mobile/src/*` (depending on structure)
- `apps/resident-mobile/package.json`
- Shared API client or auth helpers under `apps/resident-mobile/src/lib/*`

### Multi-CLI (optional — only for complex/high-risk phases)

Not required; standard Cursor + Expo tooling is sufficient.

