---
name: audit
description: Evidence-backed read-only audit of the focused application.
---

# /audit [app|pages|page <route>|components|usability|security|pilot|all]

Render responses with `.agents/contracts/GUIDE_RESPONSE_CONTRACT.md`.
Require focus. Inspect source, tests, routes, plans, references, and—when browser
access exists—the running app. Mark non-browser work `static-review-only`.
Produce route inventory, architecture/status, page scorecard, components,
usability, security, accessibility/RTL, pilot-flow coverage, progress, and a
prioritized P0–P3 gap backlog. Store dated evidence, then transition focused →
audited. Do not implement fixes.
