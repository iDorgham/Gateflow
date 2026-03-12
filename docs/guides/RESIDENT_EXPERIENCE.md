# Resident Experience Guide (Docs v2)

**Version:** 1.0
**Aligned with:** `docs/PRD_v7.0.md` (Resident Portal & Mobile, Resident Mobile Enhancement Plan)

> **Status: Planned — Q3–Q4 2026**
> The Resident Portal (`apps/resident-portal`) and Resident Mobile (`apps/resident-mobile`) are **Phase 2** features. The data models (`Unit`, `VisitorQR`, `AccessRule`, `ResidentLimit`) are defined in `packages/db/prisma/schema.prisma` but the apps are not yet built. This guide describes the intended experience as a product specification.

---

## 1. Persona & Goals

**Persona:** Resident (unit owner/renter) in a gated community.

**Goals:**

- Invite guests **without** calling management or dealing with paper passes.
- Control **who** can enter, **when**, and **through which gates**.
- Know **when guests arrive** and feel confident about safety and privacy.
- Manage frequent visitors (family, maids, drivers) with minimal friction.

Resident experience spans:

- **Resident Portal (Web)** — full-featured, mobile-optimized web app.
- **Resident Mobile (Expo)** — focused mobile app for quick actions and notifications.

---

## 2. Onboarding & Unit Linking

### 2.1 Account Creation & Role

- Residents receive an invite from management or are provisioned via `client-dashboard`.
- Their `User` is linked to:
  - Role: `RESIDENT`.
  - One or more `Unit` records (usually a single primary unit).

### 2.2 No-Unit-Linked State

If a resident logs in without an assigned unit:

- They see a clear message:
  - “No unit assigned — please contact management.”
- Visitor features remain disabled until linking is complete.

Once linked, the resident’s home screen shows:

- Unit name/number and type.
- Building and project information.
- Unit status (active/inactive).

---

## 3. Visitor Pass Creation

### 3.1 Core Flow (Web & Mobile)

1. Resident selects **“Add Visitor”**.
2. Enters basic details:
   - Visitor name (optional for open QR).
   - Optional phone and email.
3. Chooses an **Access Rule**:
   - One-time (specific date).
   - Date range.
   - Recurring (days of week + time window).
   - Permanent (for `OPEN` QR / trusted guests).
4. Optionally selects gates allowed (e.g., Main Gate only).
5. Confirms; system:
   - Checks quota for the resident’s unit.
   - Creates `VisitorQR` + `QRCode` + `AccessRule`.

Resident sees:

- A QR preview.
- A short link they can copy or share.
- Clear indication of the access type (“One-time”, “Recurring”, “Permanent”).

### 3.2 Quota & Limits

Per PRD v6:

- Quotas are driven by `ResidentLimit` + `UnitType` (e.g., Studio: 3/month, Villa: 30/month).
- Resident UI shows:
  - Used vs total for the current month (e.g., 4 / 10 visitors).
  - Reset date (end of month).

If quota is exceeded:

- Pass creation is blocked with a clear message and next reset date.

---

## 4. Sharing Passes (Resident Mobile Focus)

Sharing is critical for resident delight; the mobile app optimizes for this.

### 4.1 Contact-Based Sharing

From resident mobile:

1. Resident opens a visitor pass.
2. Taps **“Share”**.
3. App opens a **native contact picker** (via `expo-contacts` or similar).
4. Resident selects a contact; app resolves phone/email.
5. Native share sheet opens with:
   - Pre-filled message: “Your GateFlow access pass: [link]”.
   - Shortcut targets: WhatsApp, Email, SMS.

The goal is to send a pass in **1–2 taps**.

### 4.2 One-Tap Share & Templates

To streamline frequent flows:

- One‑tap share from:
  - Visitor card (e.g., last used method/contact).
  - Guest templates (see §6.2).

---

## 5. Notifications & Timeline

### 5.1 Scan Notification

When a guest scans at the gate:

- Backend logs the scan, then triggers a push notification to the resident’s mobile:
  - “Ahmed just scanned in at Main Gate.”
- Tapping the notification opens:
  - Visitor detail view, or
  - A timeline card for that visit.

### 5.2 Arrival Notification

After the scan, the landing page offers:

- “Navigate to unit” (see §7).
- “I’ve arrived” button (v1 recommended).

When guest taps **“I’ve arrived”** near the unit:

- Backend records a check‑in event.
- Resident mobile receives a second notification:
  - “Ahmed has arrived at your unit.”

Future option:

- Geofence-based detection using guest location (with consent), triggering the arrival notification automatically.

### 5.3 Quiet Hours & Preferences

Residents can configure:

- Whether to receive:
  - Scan notifications.
  - Arrival notifications.
- Quiet hours (e.g., 11pm–7am) to reduce noise from non‑critical events.

---

## 6. Delight Features

### 6.1 Home Screen Widgets

Resident home shows:

- Unit card (name, type, building, project).
- Quota widget (e.g., “4 / 10 visitors used this month”).
- “Who visited today” — a short list (name + time + gate).
- Quick actions:
  - Add Visitor.
  - Create Open QR (if allowed).
  - View History.

### 6.2 Smart Guest Templates

Residents can save **guest templates** for common visitors:

- Examples:
  - “Family”: Permanent or long‑term access, any gate.
  - “Maid”: Recurring weekdays 8am–6pm, specific gates.
  - “Driver”: Recurring, vehicle gate only.

Creating a pass from a template:

- Pre-fills access rules and allowed gates.
- Resident only needs to confirm the visitor and share.

---

## 7. Guest Navigation (GPS)

For visitors unfamiliar with the compound:

- Landing page (after scan) shows:
  - QR (for re‑scan if needed).
  - Copy/share controls.
  - **“Get directions to [Unit/Building]”** button when coordinates are configured.
- Button opens:
  - Google Maps or Apple Maps via URL deep link.
  - Destination: Unit or building coordinates.

Residents and tenants control:

- Whether unit‑level navigation is enabled (privacy).
- Whether to show building‑level only (e.g., main entrance).

---

## 8. Privacy & Safety

Resident-facing controls:

- Visitor view:
  - Full name vs initials.
  - Show/hide unit number.
  - Show/hide navigation link.
- History:
  - Residents can see who visited and when.
  - Tenants define retention windows and whether residents can manage older entries.

PRD v6 also requires tenant-level settings for:

- Data retention (scan logs, visitor history, ID artifacts).
- Legal hold (future): prevent automatic deletion for specific incidents.

---

## 9. Summary

The resident experience should feel:

- **Effortless** — invite in under 30 seconds, share in 1–2 taps.
- **Reassuring** — clear quota, clear status, clear notifications.
- **Respectful** — strong privacy controls and predictable data use.

Implementation details live in the apps (`resident-portal`, `resident-mobile`) and backend APIs, but this guide should stay aligned with `PRD_v7.0.md` as the product evolves.

