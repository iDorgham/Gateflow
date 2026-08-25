# Tasks: `resident_mobile_one_tap`

- **Initiative:** `resident_mobile_one_tap`
- **Application:** Cross-Platform (`apps/resident-mobile`, `apps/marketing`, `packages/db`)
- **Status:** ✅ Complete — all phases 1–5 complete (verified)

---

## Phase 1: Cryptographic Short-Link & Silent Token Foundation

- [x] Build HMAC-SHA256 token generator for silent express guest passes
- [x] Implement short-link signing, payload structure, and tamper-proof verification
- [x] Write unit tests for token generation, expiration limits, and signature verification
- [x] Write `phase_logs/PHASE_LOG_phase_01.md`

## Phase 2: Express Link Core Engine & Anonymous-to-Identified Resolver

- [x] Implement express pass creation API and low-latency state generator
- [x] Build anonymous-to-identified redemption handler capturing visitor name on first access
- [x] Write unit tests for state transitions, anonymous redemption, and QR token binding
- [x] Write `phase_logs/PHASE_LOG_phase_02.md`

## Phase 3: Resident Mobile Home Tab Express Share Widget

- [x] Build animated QuickShare card on mobile Home tab with Recent Guests pills
- [x] Implement native contact selection and platform native Share Sheet dispatch
- [x] Write unit tests for express widget state and recent guest filtering
- [x] Write `phase_logs/PHASE_LOG_phase_03.md`

## Phase 4: Luxury Invitee Landing Page & Wallet Pass Export

- [x] Build responsive guest invitation landing page with organization logo and compound GPS navigation
- [x] Implement 1-tap Apple Wallet / Google Pay pass export payload generator
- [x] Write unit tests for landing page state and wallet export generation
- [x] Write `phase_logs/PHASE_LOG_phase_04.md`

## Phase 5: GateAI Arrival Pre-Clearance, Arabic RTL Audit & Full Certification

- [x] Implement GateAI arrival pre-clearance delegator and scanner VIP notification banners
- [x] Conduct comprehensive Arabic RTL localization audit for SMS, WhatsApp, and UI strings
- [x] Run full automated test suite across all affected applications
- [x] Verify zero TypeScript errors and zero lint warnings
- [x] Write `phase_logs/PHASE_LOG_phase_05.md`
