# PLAN: Scanner App — Onboarding & Session Management

**Slug:** `scanner_onboarding_session`
**Initiative:** Structured Onboarding + Security + Shift Logs (with ADS UI/UX).
**Goal:** Premium "First Mile" experience and Shift-Managed Home Screen.
**Status:** Planned — canonical layout: `TASKS_*.md`, `CONTEXT_*.md`, `context/`, `phase_logs/`, `assets/`, `phases/NN_*/PROMPT_phase_NN.md` (see `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`).  
**Primary app:** `apps/scanner-app`  
**Target:** Q3 2026  
**Branch:** `feat/scanner_onboarding_session`

---

## 🏗️ Architecture & ADS Invariants

- **Component Library**: Expo + React Native + `@gate-access/ui/tokens`.
- **Global Auth**: `BiometricGuard` HOC wrapping all Scanner Screens.
- **Session Layer**: `ShiftSessionContext` to track active duty status.
- **RTL/i18n**: Support Arab/English on all Wizard and Home screens.
- **Security**: Mandatory Passcode or FaceID for all scanner operations.

---

## 📈 Success Metrics

- 🛡️ **Security**: 100% of devices have a passcode or biometric identity.
- 🕒 **Operations**: Shift Start/End times logged accurately per guard.
- 🎨 **ADS Score**: 100% usage of semantic color and space tokens.
- ⚡ **UX**: Dashboard to Scanner in < 1 second.

---

## 🏁 Phased Roadmap

| Phase  | Phase Title                | Primary Role | Tool         | Goal                                                             |
| :----- | :------------------------- | :----------- | :----------- | :--------------------------------------------------------------- |
| **01** | **Security & Auth Hooks**  | BACKEND      | Claude CLI   | `expo-local-authentication` + Secure Storage + `ShiftLog` schema |
| **02** | **Wizard UI (Onboarding)** | FRONTEND     | Cursor       | Multi-step setup with ADS tokens and illustrations               |
| **03** | **Shift Logic & API**      | BACKEND-API  | Claude CLI   | `clockIn`/`clockOut` endpoints + Shift verification              |
| **04** | **Home Screen Redesign**   | FRONTEND     | Cursor       | Master Scan Button + Shift Widget (8pt grid)                     |
| **05** | **Polish & Verification**  | QA           | Opencode CLI | Transitions, Swipe gestures, RTL Audit, Fail-safe testing        |

---

## 🛠️ Phases Breakdown

### Phase 1: Security & Auth Hooks

**Goal:** Foundation for biometric/passcode security and Shift logs.

- `expo-local-authentication` setup.
- Secure passcode storage utility.
- `ShiftLog` schema patch (Prisma).
- **Status:** [ ] Planned

### Phase 2: Onboarding Wizard UI

**Goal:** High-quality setup experience for first-time guards.

- Welcome, Security (PIN/FaceID), and Permissions steps.
- ADS token integration (Space, Typography, Color).
- Educational context for Camera/Notification access.
- **Status:** [ ] Planned

### Phase 3: Shift Management System

**Goal:** Logical connection between shift logs and scan actions.

- Backend API for shift transitions.
- "Scan Permission QR" to finalize onboarding.
- Automated `ShiftId` link for all subsequent scan operations.
- **Status:** [ ] Planned

### Phase 4: Master Scan Home Screen

**Goal:** Premium Dashboard for daily guard operations.

- Central Floating Action Button for master scan.
- Shift info widget (Time, Location, Progress).
- High-density stats view using ADS density tokens.
- **Status:** [ ] Planned

### Phase 5: Polish & Security Logic

**Goal:** Premium transitions and production-ready security.

- `framer-motion` / `Reanimated` page transitions.
- Global `BiometricGuard` inactivity lock.
- Final RTL/Audit pass for the entire onboarding / session flow.
- **Status:** [ ] Planned

---

## Phase prompts (`phases/NN_<slug>/PROMPT_phase_NN.md`)

| Phase | Folder                         | Prompt               |
| ----- | ------------------------------ | -------------------- |
| 1     | `phases/01_security_auth/`     | `PROMPT_phase_01.md` |
| 2     | `phases/02_onboarding_wizard/` | `PROMPT_phase_02.md` |
| 3     | `phases/03_shift_management/`  | `PROMPT_phase_03.md` |
| 4     | `phases/04_home_redesign/`     | `PROMPT_phase_04.md` |
| 5     | `phases/05_polish_qa/`         | `PROMPT_phase_05.md` |

Supporting artifacts: `TASKS_scanner_onboarding_session.md`, `CONTEXT_scanner_onboarding_session.md`, `context/`, `phase_logs/`, `assets/` — see `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`.

---

## After each phase

- Append or update **`phase_logs/PHASE_LOG_phase_NN.md`** (template: `docs/development/plan-templates/PHASE_LOG_template.md`).
- Tick **`TASKS_scanner_onboarding_session.md`** in the same pass as the phase commit.

---

## ⚠️ Dependencies & Risks

- **Prisma Migrations**: `ShiftLog` model addition must respect existing tenant isolation.
- **Hardware Variation**: FaceID/Fingerprint compatibility across Android/iOS.
- **Offline States**: Managing shift status when network at the gate is unstable.

---

_Created: 2026-03-31 | UI/UX & Security First Mile_
