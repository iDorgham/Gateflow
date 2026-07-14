# IDEA_pattern-docs — Pattern Documentation (Design System Phase 9)

**Owner:** Frontend + Design System  
**Created:** 2026-04-08  
**Status:** Draft (Idea captured)  
**Primary reference:** `docs/guides/UI_DESIGN_GUIDE.md`, `apps/design-system/src/app/(docs)/patterns/`

---

## 1. Problem & Motivation

The GateFlow Design System has a strong foundation of **tokens** and **base components** (Buttons, Cards, Inputs). We have also built **Foundations** (Color, Typography, etc.). However, the **Patterns** section—which should show how to assemble these parts into reusable business logic UI—is currently sparse.

Developers building new features (Resident Portal, Admin CRM, Security Scanner) need to know:

- "How do I build a standard Analytics Dashboard?"
- "What is the correct layout for a multi-tenant Entity detail page?"
- "How should the AI Assistant (GateAI) look and feel in different contexts?"

Without documented patterns, we risk UI drift and redundant implementation of complex compositions.

---

## 2. Goals

1. **Document High-Trust Patterms**
   - Provide interactive examples and code snippets for common assembly patterns.
   - Focus on the "GateFlow DNA": Premium, Institutional, High-Density, and RTL-first.

2. **Assembly over primitives**
   - Shift focus from _components_ to _compositions_.
   - Use specialized composition packages (e.g., `@gateflow/components`, `@gateflow/ai`) in the documentation.

3. **Production-Ready "Copy-Paste"**
   - Ensure patterns shown in the design system are exactly what's used in `@gateflow/marketing`, `@gateflow/client-dashboard`, etc.
   - Hardened `use client` implementation for all interactive pattern labs.

---

## 3. Scope

### 3.1 In scope

- **Analytics Pattern**:
  - Implementation of a data-dense `AnalyticsDashboard` lab.
  - Documenting `StatGrid` and `ChartLab` (Recharts integration).
- **AI UI Pattern**:
  - Documenting the `GateAI` chat interface.
  - Highlighting `MessageAvatar`, `ChatInputShell`, and `ToolCallCard` patterns.
- **Entity & Management Pattern**:
  - Documenting standard "CRUD" layouts: `EntityCard` lists, `FilterBar` behaviors, and `PageHeader` breadcrumbs.
- **Security & Status Pattern**:
  - Documenting QR status indicators, scanning states, and RBAC visibility patterns.

### 3.2 Out of scope

- Creating _new_ core components (this is about documented patterns, not primitive development).
- Migrating actual mobile apps (we only document the patterns in the web design system).

---

## 4. Success Criteria

- **Pattern Coverage**: All four primary patterns (Analytics, AI UI, Entity, Security) have dedicated documentation pages.
- **Interactivity**: Every pattern page includes at least one interactive "Lab" or "Preview" component.
- **Architecture**: Pages follow the Next.js 15 `use client` hardening standard established in Phase 8.
- **Developer Experience**: A developer can copy a pattern snippet and have it work immediately in a dashboard app with minimal adjustment.

---

## 5. Next Steps

1. **Initialize Phase Plan**: Use `/plan pattern-docs` to define the implementation order.
2. **Execute Phases**:
   - **Phase 1**: Analytics Documentation (StatGrid + ChartLab).
   - **Phase 2**: AI UI Documentation (Chat + ToolCards).
   - **Phase 3**: Entity & Management Documentation (CRM/Projects style).
   - **Phase 4**: Security & Status Patterns (QR + RBAC).
3. **Verify**: Ensure all new pages pass the production build check (`pnpm turbo build --filter=@gateflow/design-system`).
