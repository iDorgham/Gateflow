# GateFlow DESIGN.md

> **Official AI Design Specification for GateFlow**  
> Based on the open [Google Labs DESIGN.md](https://github.com/google-labs-code/design.md) standard and [Impeccable Design Methodology](https://impeccable.style/).  
> This file is the single source of design truth for all AI agents (Antigravity, Cursor, Claude Code, Gemini CLI, OpenCode) and human developers.

---

## 1. Product & Brand Registers

### Product Register (Console & Dashboards: `client-dashboard`, `admin-dashboard`, `scanner-app`)
- **Tone**: Precision console, high-density, calm, diagnostic, authoritative.
- **Rules**: Solid semantic colors, high data density (Compact 36px controls), zero decorative gradient text, zero default glassmorphism, zero colored `border-left` callouts.
- **Typography**: Inter (LTR) + Cairo/Tajawal (RTL). Functional weights 500–600.

### Brand Register (Websites & Portals: `marketing`, `resident-portal`, `resident-mobile`)
- **Tone**: Visionary, enterprise, empowering, reassuring, unforgettable.
- **Rules**: Asymmetrical bento grids, subtle procedural rim-light glow, fluid typography (`clamp()`), Comfortable density (48px controls, $\ge 44\text{px}$ touch targets).

---

## 2. Color Geometry & Surface Layers (Carbon 3-Tier Model)

### OKLCH Satin-Charcoal Dark Mode Surfaces
```
layer-01 (Canvas / Gutter / Sunken):  oklch(8% 0.012 250)   -> #0b0d11
layer-02 (Default Cards & Tables):    oklch(12% 0.015 250)  -> #12151c
layer-03 (Raised / Floating Cards):   oklch(16% 0.018 250)  -> #191d26
layer-04 (Overlays / Modals / Sheets):oklch(20% 0.020 250)  -> #212633
```

### Porcelain Light Mode Surfaces
```
layer-01 (Page Background / Canvas):  oklch(98% 0.005 250)  -> #f8f9fa
layer-02 (Surface / Default Cards):   oklch(100% 0 0)       -> #ffffff
layer-03 (Raised / Floating Panels):  oklch(100% 0 0)       -> #ffffff (+ subtle shadow)
layer-04 (Overlay / Dialogs):         oklch(100% 0 0)       -> #ffffff (+ deep shadow)
```

### Semantic Accent Palettes (The 60-30-10 Rule)
- **Primary / Brand Action (10% max)**: Kimchi Vermilion (`#ED4B00` / Dark hover `#FF5C0A` / Subtle `rgba(237, 75, 0, 0.10)`).
- **Secondary / Telemetry**: Electric Cobalt (`#0052CC` / `#2563EB`).
- **Success / Validated Gate**: Emerald Forest (`#10B981` / `#059669`).
- **Warning / Security Alert**: Solar Amber (`#F59E0B` / `#D97706`).
- **Danger / Unauthorized Breach**: Ruby Crimson (`#EF4444` / `#DC2626`).
- **Virtual Lab AI**: Orchid Violet (`#8B5CF6` / `#7C3AED`) reserved exclusively for AI features.

---

## 3. Typography Scale & Bidirectional RTL Stacks

### Fluid Type Scale (CSS `clamp()`)
- `text-xs`: `clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem)` (12px–13px)
- `text-sm`: `clamp(0.875rem, 0.825rem + 0.25vw, 0.9375rem)` (14px–15px)
- `text-base`: `clamp(1rem, 0.95rem + 0.25vw, 1.0625rem)` (16px–17px)
- `text-lg`: `clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem)` (18px–20px)
- `text-xl`: `clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)` (20px–24px)
- `text-2xl`: `clamp(1.5rem, 1.35rem + 0.75vw, 2rem)` (24px–32px)
- `text-3xl`: `clamp(2rem, 1.75rem + 1.25vw, 2.75rem)` (32px–44px)

### Font Stacks
- **Latin (LTR)**: `Inter`, `Outfit`, `ui-sans-serif`, `system-ui`.
- **Arabic (RTL)**: `Cairo`, `Tajawal`, `IBM Plex Arabic` (with $1.6\times$ line-height to protect diacritics).
- **Code / Monospace**: `JetBrains Mono`, `SF Mono`, `monospace`.

---

## 4. Spacing, Density & Mobile Touch Invariants

- **Spatial Grid**: 4px base grid (4, 8, 12, 16, 24, 32, 40, 48, 64px).
- **Densities**:
  - **Compact**: 36px control height (default for Dashboards).
  - **Comfortable**: 48px control height (default for Marketing, Portals, Mobile).
- **Mobile Touch Minimum**: All interactive elements must maintain $\ge 44\text{px} \times 44\text{px}$ hit area.
- **RTL Logical Properties**: Always use `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`.

---

## 5. Motion Laws

- **Easing**: Single standard easing `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out-expo).
- **Duration**: Interactions = 200–300ms, Page entry = 400–500ms.
- **Hover**: 2px lift (`translateY(-2px)`) + subtle rim-light bloom.
- **Press**: `scale(0.97)`.
- **Strict Invariant**: Never animate layout properties (`width`, `height`, `margin`, `padding`). Animate GPU-accelerated `transform` and `opacity` only. Respect `prefers-reduced-motion`.

---

## 6. Anti-AI-Slop Blocking Rules (Instant Failures)

1. **NO colored `border-left` / `border-right` on cards** (use full borders and status badges).
2. **NO decorative gradient text** (`background-clip: text`) in console/dashboard UI.
3. **NO default glassmorphism** on basic cards (reserve for floating navbars and camera HUD overlays).
4. **NO identical card grids** (use asymmetrical bento grids or high-density tables).
5. **NO bounce or elastic animations**.
6. **NO pure `#000000` or `#ffffff` backgrounds**.

---

## 7. Component Blueprints & Recipes

### Button Recipe
- Subtle top-edge inner highlight (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15)` in dark mode).
- Focus ring: 2px offset Kimchi ring (`ring-2 ring-[var(--ds-color-primary)] ring-offset-2`).
- Variants: `primary`, `secondary`, `outline`, `ghost`, `destructive`, `fab`.

### FormField Recipe
Always wrap inputs in `<FormField label="..." helperText="..." errorMessage="..." isRequired>`:
- Dynamic Ruby error border + single gentle shake animation on validation failure (`animate-shake`).

### DynamicTable Recipe
- Desktop ($\ge 768\text{px}$): Semantic table with sticky header and density toggle.
- Mobile ($< 768\text{px}$): Automatically transforms rows into stacked interactive `<Card>` items with zero horizontal scroll.

### BottomSheet Recipe
- Snap points at 25%, 50%, 90%, spring drag handle, backdrop blur, safe-area-inset padding.
