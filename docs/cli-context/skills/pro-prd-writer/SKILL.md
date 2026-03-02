---
name: pro-prd-writer
description: Use when creating, updating, or refactoring Product Requirements Documents (PRDs) for GateFlow or any of its apps.
---

## When to use this skill

Invoke this skill whenever:

- You are asked to **write a new PRD** for a feature, phase, or product.
- You need to **upgrade an existing PRD version** (v5 → v6, etc.).
- You are asked to **add or clarify requirements** (features, security, resident mobile, scanner rules, etc.) in the PRD.
- You must align code or roadmap changes with the **canonical product spec**.

If the work touches:

- `docs/PRD_*.md`
- `docs/plan/phase-*/specs/*.md`
- Or any document explicitly called a “PRD”

…you MUST adopt this skill before editing.

---

## Core principles

1. **Product-first, not implementation-first**
   - PRDs describe **what** and **why**, not code-level **how**.
   - Keep language business- and user-focused; leave API shapes and schemas to tech specs unless they are critical contracts.

2. **Single source of truth**
   - Ensure there is **one canonical PRD per scope** (e.g. `PRD_v6.0.md` for GateFlow core).
   - Older versions become explicit references (e.g. “Previous PRD v5.0; baseline for MVP features”).

3. **Tight alignment with reality**
   - Before editing, skim:
     - `CLAUDE.md`
     - `docs/plan/phase-1-mvp/specs/PRD_v5.0.md` and current `PRD_v6.0.md`
     - `docs/plan/context/GATEFLOW_CONFIG.md`
   - Make sure the PRD doesn’t contradict current architecture, security rules, or known roadmap.

4. **Security & multi-tenancy are non‑negotiable**
   - PRD changes must preserve:
     - Explicit `organizationId` and soft-delete invariants.
     - QR signing, scanner dedup (`scanUuid`), and auth patterns from `.cursor/rules/*` and `CONTRACTS.md`.
   - When adding new flows (resident mobile, scanner rules, ID capture), call out security implications and how they are controlled.

5. **Must-have for gated communities**
   - Always ask: “Does this feature move GateFlow closer to a **must-have security tool** for gated communities?”
   - Emphasize:
     - Visitor identity & trust (ID levels, watchlists).
     - Guard accountability (shifts, incidents).
     - Perimeter control (gate/device rules, gate hours, location rules).
     - Resident safety and privacy (controls, retention, masking).

---

## Structure to follow

When editing or creating a PRD, bias to this structure (adapt as needed):

1. **Executive Summary**
   - Vision, problem, core value.
   - For version bumps: what vN adds on top of vN‑1.

2. **Personas & Use Cases**
   - Keep table of personas → jobs-to-be-done → pain points → must-haves.
   - Add new personas or refine existing ones when new features primarily serve them (e.g. Guard Supervisor, Resident).

3. **App Scope**
   - Per app (client-dashboard, scanner-app, resident-portal, resident-mobile, admin-dashboard, marketing):
     - Features, priority, and status overview.

4. **Detailed Requirements Sections**
   - Group by major capability:
     - Resident Portal & Resident Mobile
     - Team Roles & Custom Roles
     - Scanner Rules & Gate–Account Assignment
     - Visitor Identity & Watchlists
     - Marketing Intelligence Suite
   - For each capability:
     - **Goal**
     - **Behavior / flows** (1–2 pages max; no low-level API details)
     - **Edge cases** that matter for security and UX.

5. **Technical & Non‑functional Requirements**
   - Tech stack, security/compliance, performance, observability.
   - Update these only when features change constraints (e.g. adding ID capture, geolocation, push).

6. **MVP / Phase Scope & Roadmap**
   - Two tables:
     - “Completed” vs “Remaining MVP / Phase N”.
     - Phase roadmap with feature → target month → effort.
   - Keep this consistent with `docs/PHASE_2_ROADMAP.md` if it exists.

7. **References & Versioning**
   - Always end with:
     - Previous PRD references.
     - Archived drafts (e.g. marketing-only v6 draft).
     - Canonical PRD path and last-updated metadata.

---

## Writing process

When this skill is active, follow this checklist:

1. **Pre‑read (lightweight)**
   - Skim:
     - Current canonical PRD.
     - CLAUDE.md.
     - Any linked spec (e.g. `RESIDENT_PORTAL_SPEC.md`) for the feature.

2. **Clarify scope**
   - Identify what is being changed:
     - Version bump?
     - New capability section?
     - Roadmap re‑prioritization?

3. **Draft in “bullet then table” style**
   - Start with bullets (goal, key behaviors, constraints).
   - Convert into structured sections and tables for final text.

4. **Check security, privacy, and multi‑tenant impact**
   - For each new feature, explicitly ask:
     - Does this need org-level config?
     - Does it touch personal data (visitor/resident identity, location, ID images)?
     - What are retention and access rules?

5. **Align roadmap**
   - When adding substantial new capabilities:
     - Update “Remaining MVP / Phase 2” table.
     - Insert or adjust roadmap rows with realistic target windows and effort.

6. **Keep it concise and scannable**
   - Prefer:
     - Tables over long paragraphs.
     - Short acceptance criteria bullets.
     - Explicit priorities (P0/P1/P2).

7. **Final consistency check**
   - Ensure:
     - Version number at top matches file name.
     - References to older PRDs or drafts are accurate.
     - New sections are linked from “References & Versioning”.

---

## Output expectations

When asked to “update PRD” or “add to PRD”:

- Propose **clean, ready-to-paste markdown** sections that match the existing style of `PRD_v6.0.md`.
- When editing directly, make focused, coherent changes (no half-updated tables).
- Where appropriate, suggest associated roadmap changes so product and engineering see the impact immediately.

If the ask is vague (“make security stronger”), first:

- Suggest 2–3 concrete capability clusters (e.g., ID + watchlists, guard accountability, resident privacy).
- Then choose a recommended set and write PRD updates for those.

