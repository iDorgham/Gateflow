---
name: release
description: Prepare a focused release and rollback handoff.
---

# /release [app] [version] [name]

Render responses with `.agents/contracts/GUIDE_RESPONSE_CONTRACT.md`; name the
version decision (including release codename, e.g. `0.5.0 Pilot`), target commit, approval state, and rollback path.
Prepare changelog/version decision (`pnpm docs:release <version> [name]`), release notes, migration checklist,
environment contract, deployment and rollback steps, monitoring, approvals, and
dated evidence. Never publish, tag, push, migrate, deploy, or promote without
explicit authorization.
