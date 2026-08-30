# Pro Prompt Template — Impeccable UI/UX & Design System Phase

Use this template for UI, Design System, Component, Dashboard, Website, or Mobile app implementation phases.
Save as: `docs/plan/{Draft,Ready,Active,Complete}/<slug>/PROMPT_<slug>_phase_<N>.md`

---

# Phase [N]: [Phase Title]

**Initiative:** `[slug]`  
**Target Applications:** `[e.g. packages/ui, apps/design-system, apps/client-dashboard]`  
**Branch:** `feat/[slug]-phase-[N]-[short-name]`  
**Status:** ⏳ Pending Execution  

---

## 🎭 1. Primary Role & Tool Selection

- **Primary Role:** `FRONTEND` (`frontend.md`) / `IMPECCABLE-CRITIC` (`impeccable-bridge`)
- **Primary Tool:** Cursor / Claude Code CLI / Gemini CLI
- **Fallback Tool:** OpenCode CLI / Kiro CLI

---

## 🎨 2. Impeccable Commands to Execute in This Phase

Tick and run the exact `/impeccable` subcommands for this phase:

- [ ] `/impeccable colorize [target]` — Porcelain/satin-slate neutrals, WCAG 2.2 AA contrast
- [ ] `/impeccable typeset [target]` — Inter / Outfit / Cairo typography, fluid `clamp()` sizing
- [ ] `/impeccable layout [target]` — 8pt / 4pt spatial grid, consistent optical rhythm
- [ ] `/impeccable craft [feature]` — End-to-end component creation from architectural shape to markup
- [ ] `/impeccable adapt [mobile/web]` — 44px+ touch targets, bottom sheets, `nativeTokens` hex bridge
- [ ] `/impeccable animate [target]` — Purposeful cubic-bezier ease-out transitions (`transform`/`opacity` only)
- [ ] `/impeccable delight [target]` — Distinct micro-interactions, subtle glows, status pulses
- [ ] `/impeccable harden [target]` — Error states, empty states, loading skeletons, Arabic RTL
- [ ] `/impeccable audit [target]` — WCAG contrast calculation, anti-AI-slop test, Lighthouse CWV
- [ ] `/impeccable critique [target]` — 30 UX laws evaluation, cognitive load, density assessment
- [ ] `/impeccable polish [target]` — Pixel-perfection, sub-pixel rendering, focus rings

---

## 📚 3. Skills to Load

- [ ] `design-guide` — Impeccable UI/UX standards & layout rules
- [ ] `theme-auditor` — Contrast and theme consistency checker
- [ ] `ads-foundations` — Core design tokens and spatial scales
- [ ] `ads-a11y-rtl` — Arabic RTL bidi & WCAG accessibility
- [ ] `uiux-animator` — Framer Motion & CSS cubic-bezier curves
- [ ] `shadcn-ads` — Shadcn / Radix primitives with ADS token overrides
- [ ] `impeccable-bridge` — Methodology routing
- [ ] `anti-slop-validator` — Anti-AI-slop gate enforcement
- [ ] `github-pr-review` — 5-Gate PR review and merge verification

---

## 🚫 4. Anti-AI-Slop Hardlocks (Must Pass)

- [ ] **NO `border-left` colored card accents** (use full borders or background status tints).
- [ ] **NO gradient text** in console/dashboard tools (`background-clip: text`).
- [ ] **NO default glassmorphism** on basic cards (reserve for floating nav/HUDs).
- [ ] **NO identical repetitive card grids** (use bento asymmetry or high-density tables).
- [ ] **NO layout property animations** (animate `transform` and `opacity` only).
- [ ] **NO pure `#000000` or `#ffffff`** (use satin-slate `#0b0d11` and porcelain `#f8f9fa`).

---

## 🛠️ 5. Step-by-Step Implementation Instructions

### Step 1: Branch Setup
```bash
git checkout -b feat/[slug]-phase-[N]-[short-name]
```

### Step 2: Implementation
[Detailed step-by-step instructions for tokens, components, or app integration]

### Step 3: Impeccable Audit & Verification
Run the theme auditor and verify anti-slop compliance:
- Run unit/component tests: `pnpm turbo test --filter=[target]`
- Run typecheck & build: `pnpm turbo typecheck build --filter=[target]`
- Verify WCAG 2.2 AA contrast ratios in both Light and Dark modes.

---

## 🛡️ 6. 5-Gate PR Review & Completion Checklist

- [ ] **Gate 1: Architecture & Tenant Isolation**: Scoped CSS variables, clean token exports.
- [ ] **Gate 2: Type Safety**: Zero `any` escapes, strict TypeScript definitions.
- [ ] **Gate 3: UI Design & Arabic RTL**: Logical CSS (`ms-*`, `me-*`), 0 AI-slop, Cairo font rendering.
- [ ] **Gate 4: Performance & CLS**: 0 layout shifts, lightweight CSS bundles.
- [ ] **Gate 5: Verification & Proof**: Monorepo preflight passes (`pnpm preflight`).

---

## 🚀 7. Commit & PR Creation

```bash
git add .
git commit -m "feat([slug]): complete phase [N] - [description]"
git push -u origin feat/[slug]-phase-[N]-[short-name]
gh pr create --title "feat([slug]): Phase [N] - [Title]" --body-file .agents/templates/TEMPLATE_PR_description.md
```
