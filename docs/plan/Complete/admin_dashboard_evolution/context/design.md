# Design — admin_dashboard_evolution

## Design System

- **Primary:** Atlassian Design System (ADS) — `@atlaskit/tokens` v2
- **All colors, spacing, typography, radius via ADS tokens** — zero raw hex codes
- **Component lib:** `@gate-access/ui` (shared across all apps)

## Color Palette (ADS Tokens)

| Role             | Token                           |
| ---------------- | ------------------------------- |
| Page background  | `ds.background.default`         |
| Card / panel     | `ds.background.neutral`         |
| Elevated surface | `ds.background.neutral.hovered` |
| Brand primary    | `ds.background.brand.bold`      |
| Danger           | `ds.background.danger.bold`     |
| Success          | `ds.background.success.bold`    |
| Warning          | `ds.background.warning.bold`    |
| Primary text     | `ds.text`                       |
| Secondary text   | `ds.text.subtle`                |
| Disabled text    | `ds.text.disabled`              |
| Border default   | `ds.border`                     |
| Border subtle    | `ds.border.neutral`             |
| Icon             | `ds.icon`                       |
| Icon subtle      | `ds.icon.subtle`                |

## Typography Scale

- **H1:** `ds.typography.heading.xxlarge` (page titles)
- **H2:** `ds.typography.heading.xlarge` (section headers)
- **H3:** `ds.typography.heading.large` (card titles)
- **H4:** `ds.typography.heading.medium` (sub-sections)
- **Body:** `ds.typography.body.large` (default text)
- **Small:** `ds.typography.body.small` (metadata, captions)
- **Label:** `ds.typography.body.small-medium` (form labels)

## Spacing Scale

`ds.space.025` = 2px → `ds.space.050` → `ds.space.100` (8px) → `ds.space.200` (16px) → `ds.space.300` (24px) → `ds.space.400` (32px) → `ds.space.500` (40px) → `ds.space.600` (48px)

## Motion Policy

- **Micro-interactions:** CSS transitions, `transition: all 150ms ease`
- **Page transitions:** Framer Motion `AnimatePresence` — approved for this plan
- **Drag-and-drop:** Framer Motion Reorder (Front Builder)
- **Modals/drawers:** Framer Motion `motion.div` with `initial/animate/exit`
- **`prefers-reduced-motion`:** All animations must respect this media query

```tsx
// ✅ CORRECT — respect reduced motion
const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)');
<motion.div
  initial={prefersReduced ? false : { opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: prefersReduced ? 0 : 0.2 }}
/>;
```

## RTL Layout

- All layouts use logical CSS: `margin-inline-start`, `padding-inline-end`
- Sidebar: collapses on `start` side (left for EN, right for AR)
- Chevrons: `rotate-180` or `dir`-aware SVG flipping
- `dir` attribute set at `[locale]/layout.tsx` root

## Responsive Breakpoints

| Name  | Min-width | Target device    |
| ----- | --------- | ---------------- |
| `sm`  | 640px     | Tablet portrait  |
| `md`  | 768px     | Tablet landscape |
| `lg`  | 1024px    | Desktop          |
| `xl`  | 1280px    | Large desktop    |
| `2xl` | 1536px    | Wide desktop     |

## Icon Library

- **Primary:** Lucide React (`lucide-react`)
- All icons sized at 16px (sm), 20px (md), 24px (lg)
- Use `aria-hidden="true"` on decorative icons
- Use `aria-label` on standalone icon buttons

## Reference Guides

- `docs/guides/UI_DESIGN_GUIDE.md` — Comprehensive design guidelines
- `docs/guides/MOTION_AND_ANIMATION.md` — Animation policy
- `apps/admin-dashboard/src/components/admin-shell.tsx` — Layout reference
