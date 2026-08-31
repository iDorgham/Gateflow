# 13. RECOMMENDED REMEDIATION BACKLOG — GATEFLOW

**Audit Date:** August 31, 2026  
**Focus:** Prioritized Action Items, Severity Classification, Effort Estimation, and Delivery Phases

---

## Prioritized Remediation Backlog Table

| Task ID    | Severity | Title                                                                    | Area               | App / Package      |  Effort  |    Recommended Phase    |
| :--------- | :------: | :----------------------------------------------------------------------- | :----------------- | :----------------- | :------: | :---------------------: |
| **P0-001** |  **P0**  | Add rate-limiting wrappers to `/api/qrcodes/validate` & bulk scan routes | Security           | `client-dashboard` | S (1-2h) | **Phase 0 (Immediate)** |
| **P0-002** |  **P0**  | Add direct `organizationId` column & index to `ScanLog` model            | DB / Multi-Tenancy | `packages/db`      | M (4-6h) | **Phase 0 (Immediate)** |
| **P1-001** |  **P1**  | Implement exponential backoff retry queue for outbound webhooks          | Reliability        | `client-dashboard` | M (4-6h) |  **Phase 1 (30 Days)**  |
| **P1-002** |  **P1**  | Add server clock offset calculation to scanner offline sync queue        | Mobile / Sync      | `scanner-app`      | S (2-3h) |  **Phase 1 (30 Days)**  |
| **P2-001** |  **P2**  | Add visual horizontal scroll indicators for mobile RTL table views       | UI/UX / RTL        | `resident-portal`  |  S (2h)  |  **Phase 2 (60 Days)**  |
| **P2-002** |  **P2**  | Deploy automated visual regression tests (Storybook / Chromatic)         | Testing            | `packages/ui`      | M (6-8h) |  **Phase 2 (60 Days)**  |
| **P2-003** |  **P2**  | Implement automated purge policy for 90+ day old scan attachment photos  | Privacy            | `packages/db`      |  S (3h)  |  **Phase 2 (60 Days)**  |
| **P3-001** |  **P3**  | Normalize documentation route index references with App Router layout    | Docs               | `docs/reference`   |  S (1h)  |  **Phase 3 (90 Days)**  |
