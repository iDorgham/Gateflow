# GateFlow AI Prompt Writing Guide for UI & Component Development

**Document:** `AI_PROMPT_WRITING_GUIDE.md`  
**Initiative:** `design_system_impeccable_revamp`  
**Audience:** AI Coding Assistants (Antigravity, Cursor, Claude Code, Gemini CLI, OpenCode) and Monorepo Developers  

---

## 1. The Core AI Slop Test (Zero Tolerance)

When creating or modifying UI components, ask:
> *"Could someone look at this interface and say 'AI made that' without doubt?"*

If the answer is **YES**, the design fails.

### 🚫 The 6 Blocking Anti-Slop Violations
1. **Colored `border-left` / `border-right` on cards**: Never use a 2px–4px left colored stripe as the primary accent. Use full borders (`border-[var(--ds-border-subtle)]`) and semantic status badges.
2. **Decorative gradient text in console UI**: `background-clip: text` is banned in operational dashboards. Use solid semantic text colors (`text-[var(--ds-text-primary)]`).
3. **Default glassmorphism**: Do not put `backdrop-blur` on regular cards or table rows. Reserve glassmorphism strictly for floating navigation headers and camera HUD overlays.
4. **Identical card grids**: Avoid grids of identical size cards with [Icon + Title + Description]. Use asymmetrical bento grids or high-density tables with varying visual hierarchy.
5. **Layout property animations**: Never animate `width`, `height`, `margin`, or `padding`. Animate only GPU-accelerated `transform` and `opacity`.
6. **Pure `#000000` or `#ffffff` backgrounds**: Always use GateFlow’s tinted satin-charcoal (`layer-01` #0b0d11) and porcelain (`layer-01` #f8f9fa).

---

## 2. Standard Master UI Component Prompt Template

When requesting an AI agent to build a new component or screen, use this structured prompt format:

```markdown
# Role: GateFlow Impeccable Frontend Specialist

## Task
Build the [Component Name] component in `@gateflow/ui` (`packages/ui/src/[path]`).

## Design DNA & Invariants
- **Surface**: Use semantic tokens only (`bg-[var(--ds-layer-02)]`, `border-[var(--ds-border-subtle)]`).
- **Typography**: Inter (LTR) / Cairo (RTL) with fluid clamp scale.
- **Density**: Support both Compact (36px control height) and Comfortable (48px control height).
- **Mobile Touch**: Minimum hit area >= 44px on mobile viewports.
- **Motion**: Use `cubic-bezier(0.4, 0, 0.2, 1)` with `transform` and `opacity` only.
- **RTL**: Use logical CSS utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`).

## State Coverage Matrix Required
Implement and export all canonical states:
1. `default` (rested state)
2. `hover` (2px lift + subtle glow)
3. `active` / `pressed` (`scale(0.97)`)
4. `focus-visible` (2px offset Kimchi ring)
5. `disabled` (40% opacity, pointer-events-none)
6. `loading` (content-shaped skeleton or spinner)
7. `error` (Ruby crimson border + gentle shake)

## Anti-Slop Check
- No colored border-left callout.
- No gradient text.
- No default glassmorphism.
- No hardcoded hex/slate color classes.
```

---

## 3. Ready-to-Use Prompt Snippets for Common Patterns

### A. High-Density Dashboard Data Table
```markdown
Create a high-density Table for [Entity] using `@gateflow/ui`.
- Sticky header with subtle backdrop blur.
- Support sorting, column visibility, and row selection.
- Density toggle: Compact (36px rows) vs Comfortable (44px rows).
- Responsive: on viewports < 768px, automatically transform into a stacked Card list with zero horizontal scroll.
```

### B. Composable Form Input with Validation
```markdown
Create a form section for [Feature] using `@gateflow/ui`.
- Wrap every input in `<FormField label="..." helperText="..." errorMessage="...">`.
- Inputs must support Compact (36px) and Comfortable (48px) heights.
- On error, trigger the Ruby crimson shake animation (`animate-shake`).
- Use logical spacing (`gap-3`, `ms-2`) for RTL Arabic alignment.
```

### C. Mobile Action Sheet / Drawer
```markdown
Create a mobile BottomSheet for [Action] using `@gateflow/ui/mobile`.
- Snap points at 25%, 50%, and 90%.
- Smooth spring drag handle with iPhone safe-area-inset padding.
- Touch targets >= 44px x 44px.
```
