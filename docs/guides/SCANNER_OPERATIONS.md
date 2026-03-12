# Scanner Operations Guide (Docs v2)

**Version:** 1.0  
**Aligned with:** `docs/PRD_v7.0.md` (Scanner App, Scanner Rules, Visitor Identity, Watchlists)  

---

## 1. Purpose & Personas

This guide describes how the **scanner-app** should be operated day‑to‑day by:

- **Gate Operators** — guards scanning visitors at gates.
- **Security Managers / Supervisors** — configuring gates, reviewing incidents, managing overrides and watchlists.

It complements:

- `docs/guides/ARCHITECTURE.md` (overall system).
- `docs/guides/SECURITY_OVERVIEW.md` (invariants, identity levels, watchlists).

---

## 2. Normal Scan Flow

1. Operator selects an **assigned gate** in the scanner app.
2. Visitor presents a QR (tenant QR or resident-generated `VisitorQR`/`OPEN` QR).
3. Scanner:
   - Verifies QR signature offline.
   - Applies access rules (expiry, uses, access window, allowed gates).
4. Backend:
   - Receives scan (immediately or from offline sync).
   - Writes a `ScanLog` with status, gate, qrCode, user (if any), and context (`scanUuid`, device, location).

Operator sees clear status:

- **Success** — Green; optional details (visitor name, unit, gate).
- **Failure** — Red with reason (expired, wrong gate, blocked, etc.).

---

## 3. Offline Mode & Queue

When network is unavailable:

- Scanner still verifies QR signatures locally (HMAC-SHA256 using `EXPO_PUBLIC_QR_SECRET`).
- Each scan is written into an **encrypted offline queue**:
  - Encryption: **AES-256**, key derived via **PBKDF2** from device-specific seed.
  - Payload: `scanUuid`, QR data, `gateId` (or `orgId` fallback), timestamp, device context.
- When connectivity returns:
  - Queue syncs to backend via `POST /api/scans/bulk`.
  - Server applies **Last Write Wins (LWW)** conflict resolution.
  - `scanUuid` is the deduplication key — duplicate entries from the same scan are discarded.

Implementation reference: `apps/scanner-app/src/lib/offline-queue.ts`.

**Watchlist matching in offline mode:** Scans queued offline are checked against the watchlist on sync. If a match is found during sync, the scan log is marked with a watchlist flag and a security alert is raised — operators are notified next time the app comes online.

Operators should:

- Monitor queue status UI (pending count badge).
- Keep device powered and online periodically to ensure timely sync.
- Be aware that watchlist blocks may surface after sync for previously offline scans.

---

## 4. Gate Assignment & Location Rules

### 4.1 Gate–Account Assignment

Security Managers can restrict which gates an operator can use:

- Operators see only **assigned gates** in the gate selector.
- Backend rejects scans for unassigned gates even if the app UI is compromised.

Use cases:

- Guard permanently attached to a specific gate.
- Different gates for vehicles vs pedestrians.

### 4.2 Location Rule (Optional)

For sensitive deployments, a **location rule** can be enabled per gate/org:

- Scanner attaches device GPS coordinates to scan context.
- Backend checks distance to gate coordinates (radius configured per gate).
- If outside radius:
  - Scan is rejected with a clear message (“Scan only allowed at gate location”).

Operators should:

- Keep device location enabled where policies require it.
- Stand near the gate when scanning to avoid false rejections.

---

## 5. Visitor Identity Levels

Depending on tenant policy and gate configuration, the scanner may enforce identity levels:

- **Level 0** — Name + phone from QR/portal.
- **Level 1** — ID photo capture:
  - Operator is prompted to capture front/back of ID.
  - Photos are attached to the scan/incident and stored per retention policy.
- **Level 2** — ID OCR + match:
  - App performs OCR on ID.
  - Checks name/ID number vs invite details.
  - Flags mismatches for supervisor review or hard block (tenant-controlled).

Operators must:

- Follow prompts for ID capture accurately.
- Avoid bypassing ID checks by using wrong flows (e.g., forcing overrides without reason).

---

## 6. Watchlist Matching

### How it works

Watchlist checking is **server-side**, not on-device:

1. Scanner submits a scan to `POST /api/qrcodes/validate`.
2. Backend checks the QR payload (visitor name, phone, ID number) against the org's active `WatchlistEntry` records.
3. If a match is found, the validate response includes `watchlistMatch: true` and the scan is flagged.
4. Scanner shows a **hard stop**: “Blocked person on security list.”
5. An incident is automatically created in the system.

For offline scans, the watchlist check runs at sync time (`POST /api/scans/bulk`), with the same result.

### Supervisor responsibility

Supervisors manage watchlists in the client-dashboard (`/dashboard/team/watchlist`):

- Only authorized roles (Security Manager, Org Admin) can add/edit/remove entries.
- Entries matched on: **name**, **phone**, or **ID number** (case-insensitive, partial contains).
- Every change is audit-logged with who made the change and when.
- Stats row shows: Total entries, Added This Month, Last Added timestamp.

Overrides for watchlisted visitors should be restricted or entirely disabled depending on tenant policy.

---

## 7. Overrides & Incidents

### 7.1 Supervisor Override

For legitimate visitors whose QRs fail for valid but exceptional reasons:

- **Override flow** in scanner:
  - Guard calls Supervisor.
  - Supervisor authenticates (PIN/password or separate login).
  - Supervisor selects override reason from list and optionally adds notes.
  - Gate is opened; `ScanLog` and an override record are created.

Rules:

- Overrides must always capture **who** approved and **why**.
- Override rate per guard and per gate is monitored (analytics).

### 7.2 Incident Logging

Guards can open an **incident**:

- Attached to a scan (e.g., suspected fake QR, tailgating).
- Or standalone (e.g., barrier stuck open, suspicious behavior).

Incident details:

- Reason code.
- Free-text description.
- Optional photos.

Supervisors handle incidents via dashboard:

- See a prioritized queue.
- Filter by gate, time, severity, guard.
- Change state (Under Review → Resolved/Escalated).

---

## 8. Best Practices for Operators

- Always:
  - Select the correct gate before scanning.
  - Confirm the on-screen result before letting a visitor pass.
  - Follow ID capture and watchlist prompts exactly where configured.
  - Log incidents when anything feels off, even if the QR passes.
- Never:
  - Share scanner credentials across multiple guards/devices.
  - Attempt to scan away from the gate when a location rule is enabled.
  - Override failures without valid reasons.

This guide should be kept in sync with `PRD_v7.0.md` as scanner features evolve.

