---
name: workflow-v2-contract
description: Shared output and evidence contract for Workflow v2 skills.
---

# Workflow v2 skill contract

All skills state trigger, inputs, method, output, evidence, stops, anti-patterns.
Output: `{app,stage,scope,artifacts,findings,evidence,blockers,handoff}`. Evidence
includes source/command, time, commit when available, and UI locale/viewport.
Stop on wrong focus, stale/missing input, absent authorization, or security
violation. Never invent evidence, leak secrets, mutate remotes, or return more
than one handoff.
