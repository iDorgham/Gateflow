# GateFlow Vibe Coder & Developer Quickstart Guide

**Document:** `VIBE_CODER_QUICKSTART.md`  
**Initiative:** `design_system_impeccable_revamp`  
**Purpose:** Empower developers and vibe coders using AI tools (Cursor, Antigravity, Claude Code, v0, OpenCode) to rapidly build breathtaking, token-compliant, accessibility-gated UI without manual overhead.

---

## ⚡ 1. The 60-Second Vibe Coder Cheat Sheet

```tsx
<<<<<<< Updated upstream
import { 
  Button, 
  Card, 
  Badge, 
  FormField, 
  Input, 
  DynamicTable, 
  BottomSheet 
=======
import {
  Button,
  Card,
  Badge,
  FormField,
  Input,
  DynamicTable,
  BottomSheet
>>>>>>> Stashed changes
} from '@gateflow/ui';

// 1. Never hardcode colors. Use semantic tokens:
//    Backgrounds: bg-[var(--ds-layer-01)] (canvas) | bg-[var(--ds-layer-02)] (cards/tables) | bg-[var(--ds-layer-03)] (raised)
//    Borders:     border-[var(--ds-border-subtle)] | border-[var(--ds-border-bold)]
//    Text:        text-[var(--ds-text-primary)] | text-[var(--ds-text-subtle)] | text-[var(--ds-text-brand)]
//    Accents:     bg-[var(--ds-color-primary)] (#ED4B00 Kimchi) | text-[var(--ds-color-success)] (#10B981)

// 2. Wrap all inputs with FormField for instant accessible labels + error shakes:
<FormField label="Gate Access Code" helperText="6-digit dynamic PIN" errorMessage={error}>
  <Input placeholder="123456" />
</FormField>

// 3. High-Density Tables that automatically morph into responsive mobile cards:
<<<<<<< Updated upstream
<DynamicTable 
  data={visitors} 
  columns={columns} 
  keyExtractor={(v) => v.id} 
=======
<DynamicTable
  data={visitors}
  columns={columns}
  keyExtractor={(v) => v.id}
>>>>>>> Stashed changes
/>
```

---

## 🤖 2. Supercharging AI Tools (Cursor, Claude Code, Antigravity)

### 2.1 The "Copy for AI" Magic Button in the Showcase
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
In `apps/design-system`, every component page features a **"Copy Prompt for Cursor / Claude"** button that copies a pre-engineered prompt:

```markdown
Use `@gateflow/ui` to build a [Feature Name].
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- Surface: `bg-[var(--ds-layer-02)]` with `border-[var(--ds-border-subtle)]`.
- Form inputs wrapped in `<FormField>`.
- Buttons using `variant="primary" | "secondary" | "ghost"`.
- Badges using `variant="solid" | "soft" | "outline" | "dot"`.
- Table using `<DynamicTable>` for automatic mobile card transformation.
- Zero raw hex colors, zero colored border-left accents.
```

### 2.2 Cursor Project Rule (`.cursor/rules/gateflow-ui.mdc`)
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
Add this rule so Cursor AI automatically writes token-correct code on every prompt:

```markdown
---
description: GateFlow UI & Design System rules
globs: apps/**/*.{tsx,jsx}, packages/ui/**/*.{tsx,jsx}
---
<<<<<<< Updated upstream
You are building with GateFlow Design System (@gateflow/ui).
Always follow these rules:
=======

You are building with GateFlow Design System (@gateflow/ui).
Always follow these rules:

>>>>>>> Stashed changes
1. NEVER use raw hex (#fff, #000, #ed4b00) or Tailwind color classes (bg-white, text-slate-900, border-gray-200).
2. ALWAYS use semantic tokens: bg-[var(--ds-layer-02)], text-[var(--ds-text-primary)], border-[var(--ds-border-subtle)].
3. Primary actions must use Kimchi Vermilion via `bg-[var(--ds-color-primary)]`.
4. Wrap form controls in `<FormField label="..." helperText="...">`.
5. Tables must use `<DynamicTable>` for responsive mobile card list transformation.
<<<<<<< Updated upstream
6. RTL Arabic must use logical CSS properties (ms-*, me-*, ps-*, pe-*, start-*, end-*).
=======
6. RTL Arabic must use logical CSS properties (ms-_, me-_, ps-_, pe-_, start-_, end-_).
>>>>>>> Stashed changes
7. Anti-slop: Never add colored border-left accents or gradient text in console UI.
```

---

## 🛠️ 3. Developer CLI Productivity Tools

We provide 3 high-speed CLI scripts in the root `package.json`:

### 1. `pnpm gf:component <ComponentName>`
<<<<<<< Updated upstream
Scaffolds a complete, enterprise-grade component inside `packages/ui/src/primitives/` or `patterns/`:
=======

Scaffolds a complete, enterprise-grade component inside `packages/ui/src/primitives/` or `patterns/`:

>>>>>>> Stashed changes
- Creates `[ComponentName].tsx` with full State Coverage Matrix props.
- Creates `[ComponentName].test.tsx` with automated `jest-axe` accessibility test.
- Creates documentation page in `apps/design-system/src/app/components/`.

### 2. `pnpm gf:check-slop`
<<<<<<< Updated upstream
Scans your workspace for Anti-AI-slop violations:
=======

Scans your workspace for Anti-AI-slop violations:

>>>>>>> Stashed changes
- Flags any colored `border-left` / `border-right` accents.
- Flags decorative gradient text in dashboard files.
- Flags unapproved glassmorphism cards.
- Flags hardcoded hex colors and raw Tailwind palettes (`bg-slate-*`).

### 3. `pnpm gf:tokens:sync`
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
Synchronizes web CSS variables with React Native / Expo `nativeTokens` in `packages/ui/src/tokens.ts` and runs the automated contrast checker.

---

## 🧪 4. Live "Vibe-Check" Sandbox (`apps/design-system/sandboxes/vibe-check`)

An interactive web sandbox inside the Design System portal where developers can:
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
1. **Paste any raw AI-generated component** from v0, Lovable, Bolt, or ChatGPT.
2. **Instant AST Analysis**: Highlights hardcoded colors, missing ARIA tags, and anti-slop issues.
3. **1-Click Auto-Sanitize**: Automatically transforms hardcoded classes into GateFlow `@gateflow/ui` components and semantic tokens!
