# GateFlow — Kiro Development Guide

The complete reference for working on GateFlow with Kiro. Covers commands, workflows, templates, and subagent usage.

---

## Slash Commands

| Command | What it does |
|---------|-------------|
| `/guide` | This file — full workflow reference |
| `/idea` | Capture a new feature idea → creates `IDEA_<slug>.md` in backlog |
| `/plan` | Create or refine a `PLAN_<slug>.md` + phase prompts |
| `/dev` | Execute a single phase prompt from `docs/plan/execution/` |
| `/ship` | Run all remaining phases for a plan end-to-end |
| `/github` | Stage, commit (conventional), rebase, push |

---

## Workflow Overview

```
/idea → /plan → /dev (phase 1) → /dev (phase 2) → ... → /ship → /github
```

1. **Capture** the idea with `/idea`
2. **Plan** phases with `/plan` using `TEMPLATE_PROMPT_phase.md`
3. **Execute** each phase with `/dev` (implement → test → lint → commit)
4. **Ship** remaining phases with `/ship`
5. **Push** with `/github`

---

## Phase Prompt Template

Save each phase as `docs/plan/execution/PROMPT_<initiative>_phase_<N>.md`.

```markdown
## Phase N: [Title]

### Context
- Project: GateFlow (Turborepo, pnpm)
- Apps: client-dashboard (3001), admin-dashboard (3002), scanner-app (8081), marketing (3000)
- Rules: pnpm only · organizationId on all queries · deletedAt: null · QR HMAC-SHA256

### Goal
[One sentence: what this phase achieves]

### Scope (in)
- [File or feature 1]
- [File or feature 2]

### Scope (out)
- Do NOT touch [X]

### Steps
1. [Concrete step with file path]
2. [Concrete step]
3. Add/update tests
4. Run: pnpm turbo lint --filter=<app> && pnpm turbo typecheck --filter=<app> && pnpm turbo test --filter=<app>
5. /github — commit, rebase, push

### Acceptance criteria
- [ ] [Criterion 1]
- [ ] lint + typecheck + test pass
```

---

## API Route Template

Every new route must follow this pattern. See full template in `TEMPLATE_API_route.md`.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// GET — list
export async function GET(): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const items = await prisma.<Model>.findMany({
    where: { organizationId: claims.orgId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, data: items });
}

// POST — create
const CreateSchema = z.object({ name: z.string().min(1).max(100) });

export async function POST(request: NextRequest): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.<Model>.create({
    data: { ...parsed.data, organizationId: claims.orgId },
  });

  return NextResponse.json({ success: true, data: item }, { status: 201 });
}
```

### Route checklist
- [ ] `getSessionClaims()` → 401 if missing
- [ ] `organizationId: claims.orgId` in create/where
- [ ] `deletedAt: null` in where
- [ ] Zod validation on POST/PATCH body
- [ ] `*.test.ts` added next to route

---

## API Test Template

See full template in `TEMPLATE_API_test.md`.

```typescript
jest.mock('@/lib/auth-cookies', () => ({ getSessionClaims: jest.fn() }));
jest.mock('@gate-access/db', () => ({ prisma: { <model>: { findMany: jest.fn() } } }));

describe('GET /api/<resource>', () => {
  it('returns data for authenticated org', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue({ orgId: 'org1' });
    (prisma.<model>.findMany as jest.Mock).mockResolvedValue([{ id: '1', organizationId: 'org1' }]);

    const res = await GET();
    expect(res.status).toBe(200);
    expect(prisma.<model>.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { organizationId: 'org1', deletedAt: null } })
    );
  });

  it('returns 401 when unauthenticated', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });
});
```

---

## Commit Message Format

```
<type>(<scope>): <subject>
```

| Type | Use for |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change, no feature/fix |
| `test` | Adding/updating tests |
| `chore` | Build, deps, config |
| `perf` | Performance improvement |

**Scopes:** `auth`, `api`, `db`, `ui`, `scanner`, `resident`, `i18n`, `deps`

**Examples:**
```
feat(gates): add project-scoped gate filtering
fix(auth): handle expired refresh token on scanner
test(projects): add multi-tenant isolation tests
chore(deps): install recharts
```

---

## Definition of Done

Before every merge/commit, verify:

### Correctness
- [ ] Works for intended role(s) (TENANT_ADMIN, TENANT_USER, RESIDENT, VISITOR)
- [ ] `organizationId` on all org-scoped queries
- [ ] Edge cases handled (empty state, 404, validation errors)

### Security
- [ ] No secrets in git
- [ ] Auth checked before any tenant operation
- [ ] QR payloads HMAC-SHA256 signed (if touching QR flow)
- [ ] No unsafe defaults or fallback secrets

### Quality
- [ ] `pnpm turbo lint` passes
- [ ] `pnpm turbo typecheck` passes
- [ ] `pnpm turbo test` passes
- [ ] No `console.log` or debug code left

### Data
- [ ] Soft delete used (`deletedAt`, not hard delete)
- [ ] `deletedAt: null` in all queries for tenant models
- [ ] Migration created if schema changed + `prisma generate` run

### Docs
- [ ] `docs/` updated if behavior or setup changed
- [ ] Backlog task marked ✅ in `ALL_TASKS_BACKLOG.md`

---

## Subagent Prompts

### Explore — Codebase Discovery

**Trace a flow:**
```
Trace the end-to-end flow for [feature]: from UI through API route to DB write.
Return key files and a short call graph.
```

**Multi-tenant audit:**
```
Find all Prisma queries that touch [Model] and verify each has organizationId
in the where clause. Flag any missing org scope.
```

**Soft delete audit:**
```
Find all Prisma queries for [Model] and verify deletedAt: null is in the
where clause. Flag any missing filter.
```

**API route inventory:**
```
List all API routes under apps/client-dashboard/src/app/api/ and summarize:
method, path, auth check, org scope, inputs.
```

**RBAC audit:**
```
Where is role checked (TENANT_ADMIN, TENANT_USER, RESIDENT) for dashboard
access? List all role guards and their file locations.
```

---

### Shell — Terminal Commands

**Preflight (run before every commit):**
```
Run pnpm turbo lint && pnpm turbo typecheck && pnpm turbo test.
Report any failure with file:line.
```

**Single app preflight:**
```
Run pnpm turbo lint --filter=client-dashboard &&
pnpm turbo typecheck --filter=client-dashboard &&
pnpm turbo test --filter=client-dashboard.
Report failures.
```

**Database migration:**
```
cd packages/db && npx prisma migrate dev --name [migration_name].
Then run pnpm turbo build from root. Report any errors.
```

**Prisma generate:**
```
cd packages/db && npx prisma generate.
Then pnpm turbo build. Report if any workspace fails.
```

---

### Browser — UI Verification

**Smoke pass:**
```
Login as TENANT_ADMIN at localhost:3001.
Navigate: Dashboard → Projects → Gates → QR Codes → Scans → Analytics → Settings.
Verify each page loads without errors. Screenshot any broken state.
```

**Project flow:**
```
Login at localhost:3001, go to Projects, create "Test Project", switch to it.
Verify project cookie set and sidebar reflects active project.
```

**QR creation:**
```
Login, go to QR Codes, create a single QR.
Verify QR displays, can be downloaded, appears in list.
```

**i18n toggle:**
```
On login page, toggle locale AR/EN.
Verify RTL layout for Arabic, LTR for English. Check labels switch correctly.
```

---

## E2E Flow Spec (for browser-use or Playwright)

```markdown
## Flow: [Name]
**App:** client-dashboard @ localhost:3001
**Prerequisites:** Logged in as TENANT_ADMIN

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to /path | Page loads |
| 2 | Click "Create" | Modal opens |
| 3 | Fill form, submit | Success toast |
| 4 | Verify in list | Item visible |

### Assertions
- [ ] No console errors
- [ ] No 4xx/5xx in network tab
- [ ] Data persists after refresh
```

---

## PR Description Template

```markdown
## Summary
[One sentence: what this PR does]

## Type
- [ ] feat  - [ ] fix  - [ ] refactor  - [ ] docs  - [ ] chore

## Changes
- [Change 1]
- [Change 2]

## Testing
- [ ] pnpm preflight passes
- [ ] Manual smoke test: [describe]
- [ ] Multi-tenant scope verified

## Checklist
- [ ] No secrets in diff
- [ ] organizationId scope on new queries
- [ ] deletedAt: null where applicable
- [ ] Docs updated if behavior changed

## Related
- Backlog: [task ID]
- Resolves: #[issue]
```

---

## Core Invariants (Never Break)

```typescript
// 1. Multi-tenancy — every query scoped by org
where: { organizationId: claims.orgId, deletedAt: null }

// 2. Soft delete — never hard delete
update({ data: { deletedAt: new Date() } })  // ✅
delete({ where: { id } })                    // ❌

// 3. QR signing — always HMAC-SHA256
const sig = crypto.createHmac('sha256', process.env.QR_SIGNING_SECRET!).update(payload).digest('hex');

// 4. Auth — always check before tenant operations
const claims = await getSessionClaims();
if (!claims?.orgId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

// 5. Validation — always Zod before DB write
const parsed = Schema.safeParse(body);
if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
```

---

## Quick Commands

```bash
# Dev
pnpm turbo dev                                    # All apps
pnpm turbo dev --filter=client-dashboard          # Single app

# Quality
pnpm turbo lint
pnpm turbo typecheck
pnpm turbo test

# Database
cd packages/db
npx prisma migrate dev --name <name>
npx prisma generate
npx prisma studio

# Build
pnpm turbo build
```

## Port Reference

| App | Port |
|-----|------|
| Marketing | 3000 |
| Client Dashboard | 3001 |
| Admin Dashboard | 3002 |
| Resident Portal | 3004 |
| Scanner App | 8081 |
| Resident Mobile | 8082 |

---

## Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Full AI assistant guide |
| `packages/db/prisma/schema.prisma` | Database schema |
| `docs/plan/backlog/ALL_TASKS_BACKLOG.md` | All tasks |
| `docs/plan/overview/PROJECT_PROGRESS_DASHBOARD.md` | Current status |
| `docs/plan/phase-2-resident-portal/specs/RESIDENT_PORTAL_SPEC.md` | Phase 2 spec |
| `docs/plan/guidelines/TEMPLATE_API_route.md` | API route template |
| `docs/plan/guidelines/TEMPLATE_API_test.md` | Test template |
| `docs/plan/guidelines/subagents/` | Subagent prompt library |
