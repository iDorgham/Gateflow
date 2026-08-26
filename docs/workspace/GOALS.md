# GateFlow Workspace Goals & Pilot Roadmap

This document outlines the strategic pilot sequence, current development focus, hardening status, and operational invariants for the GateFlow monorepo.

---

## 1. Pilot Application Sequence

GateFlow enforces a strict, single-focus sequential pilot progression. Each stage requires immutable, dated evidence receipts before unlocking the subsequent pilot app:

```
1. Client Dashboard  ──►  2. Resident Portal  ──►  3. Scanner App  ──►  4. Integrated Pilot
   (apps/client-dashboard)   (apps/resident-portal)   (apps/scanner-app)    (Cross-app compound)
```

| Pilot Application       | Stage          | Evidence Status                  | Next Action                          |
| :---------------------- | :------------- | :------------------------------- | :----------------------------------- |
| **1. Client Dashboard** | `certified`    | 9/9 pilot outcomes certified     | Verified production baseline         |
| **2. Resident Portal**  | `certified`    | Certified EN/AR browser evidence | Verified cross-subdomain session SSO |
| **3. Scanner App**      | `certified`    | Shift-lock & nonce replay proven | Modularization complete (Phases 1–3) |
| **4. Integrated Pilot** | `between-apps` | Cross-app verification ready     | Run `/certify integrated-pilot`      |

---

## 2. Current Workspace Focus

- **Current Focused Application**: `None (between-apps)` / `scanner-app` product maintenance.
- **Active Technical Initiative**: `workspace_ai_surface_hardening_2026` (AI surface simplification, skill consolidation, fail-closed sync, canonical rule single-core).

---

## 3. Hardening & Surface Quality Metrics

- **Canonical AI Configuration**: Tracked under `.antigravity/` (mirrored to `.agents/`).
- **Multi-Tool Sync**: Fast-sync across 8 AI tools (Claude, Cursor, Antigravity, Gemini, Kiro, KiloCode, OpenCode, Qwen).
- **Skill Quality**: 69 canonical skills (target $\le 80$), 2.9% stub share (target $\le 15\%$), 100% folder-to-frontmatter alignment.
- **Rules Model**: Exactly 1 `alwaysApply: true` rule (`00-gateflow-core.mdc`), 7 specialist rules on demand.
- **Command Integrity**: 0 collisions across workspace commands and quarantined factory tools (`check-command-conflicts.js`).

---

## 4. Key Operational Invariants

1. **Pnpm Only**: Never run `npm` or `yarn`.
2. **Tenant Isolation**: Always enforce `organizationId` scoping on database queries.
3. **Soft Deletes**: Apply `deletedAt: null` only when the Prisma model explicitly defines `deletedAt`.
4. **QR Cryptography**: All QR codes must use HMAC-SHA256 signing with `scanUuid` deduplication.
5. **No Blind Claims**: Browser, visual, and device evidence must come from actual execution or device recordings, never invented from static reviews.
