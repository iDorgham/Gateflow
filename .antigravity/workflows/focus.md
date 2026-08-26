---
name: focus
description: Select or report the single Workflow v2 pilot application.
---

# /focus [app|status]

Render responses with `.agents/contracts/GUIDE_RESPONSE_CONTRACT.md`.
Run `node scripts/workflow-v2/cli.js focus status --json` first. With no focus,
select `client-dashboard`; otherwise accept only the registered pilot apps.
Never switch away from an uncertified app. Mutations must use
`node scripts/workflow-v2/cli.js focus <app>`. Return state, evidence, risks, and
exactly one handoff.
