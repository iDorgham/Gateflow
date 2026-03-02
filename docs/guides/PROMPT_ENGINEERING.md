# GateFlow — Prompt Engineering Guide

Canonical reference for writing effective prompts: phase prompts (`/plan`, `/dev`), CLI prompts, design briefs, and animation specs. Used by Cursor, CLIs, Antigravity, and the gf-prompt-writer skill.

---

## 1. Phase Prompts (`/plan`, `/dev`)

### Structure (from `TEMPLATE_PROMPT_phase.md`)

- **Primary role** — From `SUBAGENT_HIERARCHY.md`: PLANNING, ARCHITECTURE, SECURITY, BACKEND-Database, BACKEND-API, FRONTEND, MOBILE, QA, i18n, DEVOPS, EXPLORE.
- **Preferred tool** — Cursor (default), Claude CLI, Gemini CLI, OpenCode CLI, Kiro CLI, Kilo CLI, Qwen CLI, or Multi-CLI.
- **Context** — Project, apps, packages, rules (pnpm, org scope, soft deletes, QR signing).
- **Goal** — One clear sentence.
- **Scope (in/out)** — What’s included and excluded.
- **Steps** — Ordered, concrete, with file paths.
- **SuperDesign** — For UI phases: run design draft before implementation.
- **Subagents** — explore, shell, browser-use when needed.
- **Acceptance criteria** — Lint, typecheck, tests, plus domain-specific checks.

### Example snippet

```
**Primary role:** FRONTEND
**Preferred tool:** Cursor
**Goal:** Add a responsive analytics card to the dashboard overview page.
**Scope (in):** apps/client-dashboard, packages/ui
**Scope (out):** No API changes
**Steps:**
1. Add AnalyticsCard component using @gate-access/ui Card.
2. Use design tokens from packages/ui/src/tokens.ts.
3. Run superdesign create-design-draft if new layout.
4. Run pnpm turbo lint --filter=client-dashboard.
```

---

## 2. CLI Prompts (Role Prefixes)

When using Claude CLI, Gemini CLI, OpenCode CLI, Kiro CLI, Kilo CLI, or Qwen CLI, prefix with the role for consistent quality:

| Role | Prefix |
|------|--------|
| Security | `You are the GateFlow Security Specialist. Check: requireAuth, organizationId scope, deletedAt null. ` |
| API | `You are the GateFlow API Specialist. Pattern: requireAuth → org scope → Zod. ` |
| Database | `You are the GateFlow Database Specialist. Schema: packages/db/prisma/schema.prisma. Always scope by organizationId. ` |
| Frontend | `You are the GateFlow Frontend Specialist. Use @gate-access/ui, Tailwind. ` |
| Mobile | `You are the GateFlow Mobile Specialist. SecureStore, scanUuid dedup. ` |
| QA | `You are the GateFlow QA Specialist. Jest, mock Prisma/auth. ` |
| Architecture | `You are the GateFlow Architecture Lead. pnpm only, org scope, @gate-access/*. ` |

**Example:** `claude -p "You are the GateFlow Frontend Specialist. Review apps/client-dashboard/src/app/[locale]/dashboard/page.tsx for responsive layout and token usage."`

---

## 3. Design Briefs

When requesting UI/UX work or design drafts:

1. **Purpose** — What the page/component is for.
2. **Target user** — Who uses it (admin, tenant, resident, visitor).
3. **Constraints** — Branding, platform (web/mobile), responsiveness, accessibility.
4. **References** — Existing pages, components, or design systems.

**Template:**

```
Design a [page/component] for [purpose].
Target user: [role].
Constraints: [responsive, RTL, dark mode, WCAG AA].
References: [path to similar page or component].
Use @gate-access/ui and design tokens from packages/ui/src/tokens.ts.
```

**Sign-in design:** For unified admin + client sign-in layout and post-login animation, use the full prompt in `docs/plan/execution/PROMPTS_REFERENCE.md` (section “Sign-in pages design (admin + client)”). Load gf-design-guide, gf-creative-ui-animation, gf-uiux-animator.

---

## 4. Animation Specs

When requesting motion/animation:

1. **Trigger** — What starts the animation (hover, click, mount, route change).
2. **Elements** — Which parts animate.
3. **Duration & easing** — e.g. 200ms ease-out.
4. **Reduced motion** — Fallback when prefers-reduced-motion.

**Template:**

```
Animate [element] on [trigger].
Duration: [ms]. Easing: [ease-out].
Use transform/opacity only. Respect prefers-reduced-motion.
Stack: Tailwind 3.4. Optional: Framer Motion for layout morphs.
```

---

## 5. GateFlow Context Snippet

Include in prompts when the model may not have full repo context:

```
Context: GateFlow monorepo. Rules: pnpm only, organizationId scope, deletedAt null, 
QR HMAC-SHA256. Ref: CLAUDE.md.
```

---

## 6. Copy-Paste Prompts

All copy-paste prompts live in `docs/plan/execution/PROMPTS_REFERENCE.md`. When adding new ones:

- Start with **Request:** for the user to copy from.
- Keep blocks self-contained (include context and constraints).
- Reference exact file paths.

---

## 7. References

| Resource | Path |
|----------|------|
| Phase template | `.cursor/templates/TEMPLATE_PROMPT_phase.md` |
| Pro prompts | `docs/plan/execution/PROMPTS_REFERENCE.md` |
| Subagent hierarchy | `docs/archive/plan-legacy/guidelines/SUBAGENT_HIERARCHY.md` |
| Tool reference | `docs/guides/TOOL_AND_CLI_REFERENCE.md` |
| gf-planner | `.cursor/skills/gf-planner/SKILL.md` |

---

*Use this guide when writing prompts for /plan, /dev, CLIs, or design/animation tasks.*
