# Scanner Operations Guide (Docs v2)

**Version:** 1.0  
**Aligned with:** `docs/PRD_v6.0.md` (Scanner App, Scanner Rules, Visitor Identity, Watchlists)  

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

- Scanner still verifies signatures offline.
- Each successful or failed scan is written into an **encrypted queue**:
  - Payload includes `scanUuid`, QR data, gateId (or orgId fallback), and timestamp.
- When connectivity returns:
  - Queue syncs to backend via bulk endpoint.
  - Server deduplicates using `scanUuid` and processes scans idempotently.

Operators should:

- Monitor queue status UI (e.g., pending count).
- Keep device powered and online periodically to ensure timely sync.

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

## 6. Watchlists & Blocked Identities

When a tenant maintains watchlists/blocklists:

- Scanner checks every scan (and, optionally, plate) against watchlist entries.
- On match:
  - App shows a **hard stop** with reason (“Blocked person on security list”).
  - An incident is created automatically.
- Overrides for watchlisted entries should be disabled or highly restricted.

Supervisors manage watchlists in the dashboard:

- Only authorized roles (e.g. Security Manager, Org Admin) can add/remove entries.
- Every change is tracked in audit logs.

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

This guide should be kept in sync with `PRD_v6.0.md` as scanner features evolve.

