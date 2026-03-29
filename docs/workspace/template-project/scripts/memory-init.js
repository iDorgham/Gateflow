#!/usr/bin/env node
/**
 * memory-init.js — AI Memory Initializer
 *
 * Creates the docs/system/memory/ structure with starter files if they don't exist.
 * Safe to re-run — existing files are never overwritten.
 *
 * Usage:
 *   node scripts/memory-init.js
 *   pnpm memory:init
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const MEMORY_DIR = path.join(PROJECT_ROOT, 'docs/system/memory');

function writeIfAbsent(filePath, content) {
  if (fs.existsSync(filePath)) {
    console.log(
      `  ~ Skipped (exists): ${path.relative(PROJECT_ROOT, filePath)}`
    );
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✓ Created: ${path.relative(PROJECT_ROOT, filePath)}`);
}

function main() {
  console.log(
    '\n── Memory Init ──────────────────────────────────────────────\n'
  );

  // MEMORY.md index
  writeIfAbsent(
    path.join(MEMORY_DIR, 'MEMORY.md'),
    `# Project Memory

> Persistent AI context — loaded at the start of every session.

## Index

| File | Type | Contents | Load when |
|------|------|----------|-----------|
| \`architecture.md\` | project | Monorepo structure, tech stack, ports | Any task |
| \`api_patterns.md\` | project | Auth, org scoping, route conventions | API work |
| \`common_errors.md\` | feedback | Known gotchas, recurring mistakes | Debugging |
| \`decisions.md\` | project | Architectural decisions with rationale | Design work |

## Quick Facts

- **Package manager:** pnpm
- **Soft deletes:** always filter \`deletedAt: null\`
- *(add more as you learn them)*
`
  );

  // Starter memory files
  writeIfAbsent(
    path.join(MEMORY_DIR, 'architecture.md'),
    `---
name: Project Architecture
description: Monorepo structure, tech stack, apps, packages, commands
type: project
---

# Project Architecture

## Stack

- Frontend: *(fill in)*
- Backend: *(fill in)*
- Database: *(fill in)*
- Package manager: pnpm (monorepo via Turborepo)

## Apps

| App | Port | Purpose |
|-----|------|---------|
| *(fill in)* | | |

## Packages

| Package | Alias | Purpose |
|---------|-------|---------|
| *(fill in)* | | |
`
  );

  writeIfAbsent(
    path.join(MEMORY_DIR, 'api_patterns.md'),
    `---
name: API Patterns
description: Auth patterns, org scoping, route conventions
type: project
---

# API Patterns

## Auth

\`\`\`typescript
const session = await requireAuth() // throws on failure
const orgId = session.user.organizationId // always use this
\`\`\`

## Org Scoping

\`\`\`typescript
where: { organizationId: session.user.organizationId, deletedAt: null }
\`\`\`

## Response Pattern

\`\`\`typescript
return Response.json({ data: result })        // success
return Response.json({ error: 'msg' }, { status: 400 }) // error
\`\`\`
`
  );

  writeIfAbsent(
    path.join(MEMORY_DIR, 'common_errors.md'),
    `---
name: Common Errors & Gotchas
description: Known mistakes, recurring bugs, non-obvious behaviours
type: feedback
---

# Common Errors & Gotchas

## Database

- Always filter \`deletedAt: null\` (soft deletes everywhere)
- Import enums from \`@project/db\`, not \`@prisma/client\`

## TypeScript

- Test files need \`export {}\` at top to avoid TS2451 errors

## Auth

- Never use client-supplied org ID — always use session value

*(Add more as you discover them)*
`
  );

  writeIfAbsent(
    path.join(MEMORY_DIR, 'decisions.md'),
    `---
name: Architectural Decisions
description: Key technical decisions made during development
type: project
---

# Architectural Decisions

| # | Decision | Why | Still valid? |
|---|----------|-----|-------------|
| *(add rows as decisions are made)* | | | |
`
  );

  console.log(`\n  Memory files ready in docs/system/memory/\n`);
}

main();
