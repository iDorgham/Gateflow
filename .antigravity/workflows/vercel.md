---
name: vercel
description: Inspect focused Vercel readiness without implicit deployment.
---

# /vercel [status|env-check <app>|preview <app>|logs <app>|promote <app>]

Render responses with `.agents/contracts/GUIDE_RESPONSE_CONTRACT.md`; distinguish
readiness, preview deployment, and production promotion.
Resolve the focused web app to its registry/project configuration. Status,
environment-name presence, and readiness checks are read-only and never print
values. Deploy, environment/domain changes, preview creation, and promotion
require explicit authorization. Deployment success is not certification.
