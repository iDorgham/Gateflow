---
name: pilot
description: Orchestrate one GateFlow pilot application through certification.
---

# /pilot

Render responses with `.agents/contracts/GUIDE_RESPONSE_CONTRACT.md`.
The pilot conductor routes the focused app through audit → progress → page map
and scoring → evidence-based brainstorming → phased plan → one-phase development
→ checks → pilot readiness → certification. Load the smallest specialist set.
Do not implement multiple apps, bypass stages, or unlock `/next-app`.

## `/pilot loop`

`/pilot loop start <approved-plan-slug> --delivery=local|draft-pr` delegates to
`/dev loop` with `profile=pilot`. It retains the fixed app sequence and adds
pilot-specific scoring, flow coverage, application certification, next-app,
and integrated certification gates.

Controls:

- `/pilot loop status|resume|pause|stop`
- `/pilot loop ship-phase|review-pr|fix-pr`
- `/pilot loop approve-merge <pr> --head=<sha>`
- `/pilot loop prepare-release|approve-release`
- `/pilot loop certify-app|next-app|certify-pilot`

Use the bounded loop checkpoint as execution memory; keep plan `TASKS`,
`SESSION_MEMORY`, `EVIDENCE_INDEX`, `DECISIONS`, and phase logs synchronized.
Certification still requires fresh evidence and explicit confirmation.
