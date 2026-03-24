---
description: Standard response format — clean visual output for every AI tool
globs: *
alwaysApply: true
---

# Response Format Standard

## Output Rules

- **No preamble** — never restate what was asked. Start with the action or answer.
- **No trailing summaries** — skip "In summary...", "To recap...", "I've now completed...".
- **No filler** — cut "I'll now...", "Let me...", "As you can see...".
- **Lead with decisions** — state what you chose and why in one sentence, then do it.
- **File refs as `path:line`** — always link errors and findings to exact locations.

## Visual Templates

### Phase / Task Banner
Use at the start of any multi-step execution (`/dev`, `/ship`, `/plan`, ralph loop):

```
─────────────────────────────────────────────────────
 Phase N/M · [Title] · ▶ IN PROGRESS
─────────────────────────────────────────────────────
 [████████░░] 80% — Step 4 of 5
```

**Status badges:** `▶ IN PROGRESS` · `✅ DONE` · `⚠️ BLOCKED` · `❌ FAILED` · `⏭ SKIPPED`

### Section Headers (use in this order)

| Header | When |
|--------|------|
| `### 🔍 Analysis` | Root cause, findings, what was discovered |
| `### 🛠 Changes` | Files added/modified — bulleted with path + reason |
| `### ✅ Verification` | Lint / typecheck / test results inline |
| `### ⚠️ Blockers` | With `file:line` reference |
| `### 📋 Next` | Exact next action — specific enough to resume without context |

### File Change List
```
- `apps/client-dashboard/src/app/api/gates/route.ts` — added POST handler
- `packages/db/prisma/schema.prisma` — added Gate model
```

### Verification Results
```
lint: ✅ pass  |  typecheck: ✅ pass  |  tests: 12✅ 0❌
```

Or when something fails:
```
lint: ✅  |  typecheck: ❌ apps/client-dashboard (2 errors)  |  tests: ⏭ skipped
```

### Progress Bar Scale
```
[░░░░░░░░░░]  0%    [█████░░░░░] 50%    [██████████] 100%
[██░░░░░░░░] 20%    [███████░░░] 70%
[████░░░░░░] 40%    [█████████░] 90%
```

## When to Show Progress Bar

**Show** for: `/dev`, `/ship`, `/plan`, ralph autopilot, any task with 4+ ordered steps.
**Skip** for: single-file edits, quick answers, search results, Q&A.

## Token-Efficient Response Style

- Use tables instead of prose for comparisons and lists of options.
- Use bullet points for actions, not paragraphs.
- Inline code for all file paths, commands, variable names.
- Max 3 sentences per explanation block — break longer explanations into headers.
- Omit "currently" / "existing" / "already" — just describe what is.
