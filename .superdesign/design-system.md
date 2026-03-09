# GateFlow Design System — Color Tokens

Real estate palette: **Anti-Flash White**, **Lace Cap**, **Kimchi** (accent), **Midnight Blue**, **Dark Royalty**, **Deep Sea**.

**Login 2026 variant:** For the 2026 dashboard login page only, use the strict palette in `.superdesign/login-2026-spec.md` and `.superdesign/login-2026-tokens.css`: Primary accent `#EB4A00`, Primary base `#020E73`, Neutral `#E6E6E6`, Surface `#FFFFFF`.

Tokens are HSL triplets consumed as `hsl(var(--name))` in CSS. Use in Tailwind via semantic classes (e.g. `bg-primary`, `text-muted-foreground`).

---

## Light theme (`:root`)

| Token | HSL | Hex / name | Usage |
|-------|-----|------------|--------|
| `--background` | `210 5% 96%` | #F2F3F4 Anti-Flash White | Page background |
| `--foreground` | `235 94% 11%` | #020035 Midnight Blue | Body text |
| `--card` | `210 5% 96%` | #F2F3F4 | Card bg |
| `--card-foreground` | `235 94% 11%` | #020035 | Card text |
| `--popover` | `210 5% 96%` | #F2F3F4 | Popover bg |
| `--popover-foreground` | `235 94% 11%` | #020035 | Popover text |
| `--primary` | `19 100% 46%` | #ED4B00 Kimchi | Buttons, links, accent |
| `--primary-foreground` | `0 0% 100%` | #FFFFFF | Text on primary |
| `--primary-rgb` | `237, 75, 0` | For `rgba(var(--primary-rgb), α)` | Glows, overlays |
| `--secondary` | `260 7% 93%` | #EBEAED Lace Cap | Secondary surfaces |
| `--secondary-foreground` | `235 94% 11%` | #020035 | Text on secondary |
| `--muted` | `260 7% 93%` | #EBEAED Lace Cap | Muted surfaces |
| `--muted-foreground` | `234 96% 23%` | #02066F Dark Royalty | Muted text |
| `--accent` | `260 7% 93%` | #EBEAED | Hover/active accent |
| `--accent-foreground` | `235 94% 11%` | #020035 | Text on accent |
| `--destructive` | `0 84.2% 60.2%` | Red | Destructive actions |
| `--destructive-foreground` | `0 0% 98%` | | Text on destructive |
| `--border` | `260 7% 88%` | | Borders |
| `--input` | `260 7% 88%` | | Input borders |
| `--ring` | `19 100% 46%` | Kimchi | Focus ring |
| `--success` | `142 76% 36%` | Green | Success state |
| `--success-foreground` | `0 0% 98%` | | Text on success |
| `--warning` | `43 96% 56%` | Amber | Warning state |
| `--warning-foreground` | `235 94% 11%` | #020035 | Text on warning |
| `--info` | `248 100% 35%` | #2000B1 Deep Sea | Info state |
| `--info-foreground` | `0 0% 98%` | | Text on info |
| `--danger` | `0 84.2% 60.2%` | | Danger state |
| `--danger-foreground` | `0 0% 98%` | | Text on danger |
| `--chart-1` | `19 100% 46%` | Kimchi | Chart series 1 |
| `--chart-2` | `235 94% 11%` | Midnight Blue | Chart series 2 |
| `--chart-3` | `234 96% 23%` | Dark Royalty | Chart series 3 |
| `--chart-4` | `248 100% 35%` | Deep Sea | Chart series 4 |
| `--chart-5` | `43 74% 66%` | Light amber | Chart series 5 |
| `--sidebar` | `210 5% 96%` | #F2F3F4 | Sidebar bg |
| `--sidebar-foreground` | `235 94% 11%` | #020035 | Sidebar text |
| `--sidebar-primary` | `19 100% 46%` | Kimchi | Sidebar accent |
| `--sidebar-primary-foreground` | `0 0% 100%` | | Text on sidebar primary |
| `--sidebar-accent` | `260 7% 93%` | Lace Cap | Sidebar hover |
| `--sidebar-accent-foreground` | `235 94% 11%` | | Text on sidebar accent |
| `--sidebar-border` | `260 7% 88%` | | Sidebar borders |
| `--sidebar-ring` | `19 100% 46%` | Kimchi | Sidebar focus |
| `--login-accent` | `19 100% 50%` | Kimchi (brighter) | Login right panel |
| `--login-accent-foreground` | `0 0% 100%` | | Text on login accent |

---

## Dark theme (`.dark`)

| Token | HSL | Hex / name | Usage |
|-------|-----|------------|--------|
| `--background` | `235 94% 11%` | #020035 Midnight Blue | Page background |
| `--foreground` | `210 5% 96%` | #F2F3F4 Anti-Flash White | Body text |
| `--card` | `235 94% 11%` | #020035 | Card bg |
| `--card-foreground` | `210 5% 96%` | #F2F3F4 | Card text |
| `--popover` | `235 94% 11%` | #020035 | Popover bg |
| `--popover-foreground` | `210 5% 96%` | #F2F3F4 | Popover text |
| `--primary` | `19 100% 46%` | #ED4B00 Kimchi | Buttons, links, accent |
| `--primary-foreground` | `0 0% 100%` | #FFFFFF | Text on primary |
| `--primary-rgb` | `237, 75, 0` | For `rgba(var(--primary-rgb), α)` | Glows, overlays |
| `--secondary` | `234 96% 23%` | Dark Royalty | Secondary surfaces |
| `--secondary-foreground` | `210 5% 96%` | #F2F3F4 | Text on secondary |
| `--muted` | `234 96% 23%` | Dark Royalty | Muted surfaces |
| `--muted-foreground` | `260 7% 93%` | #EBEAED Lace Cap | Muted text |
| `--accent` | `234 96% 23%` | Dark Royalty | Hover/active accent |
| `--accent-foreground` | `210 5% 96%` | #F2F3F4 | Text on accent |
| `--destructive` | `0 62.8% 30.6%` | Dark red | Destructive actions |
| `--destructive-foreground` | `0 0% 98%` | | Text on destructive |
| `--border` | `234 96% 28%` | | Borders |
| `--input` | `234 96% 28%` | | Input borders |
| `--ring` | `19 100% 46%` | Kimchi | Focus ring |
| `--success` | `142 71% 45%` | Green | Success state |
| `--success-foreground` | `145 80% 10%` | | Text on success |
| `--warning` | `48 96% 53%` | Amber | Warning state |
| `--warning-foreground` | `36 45% 15%` | | Text on warning |
| `--info` | `248 100% 35%` | Deep Sea | Info state |
| `--info-foreground` | `0 0% 98%` | | Text on info |
| `--danger` | `0 62.8% 30.6%` | | Danger state |
| `--danger-foreground` | `0 0% 98%` | | Text on danger |
| `--chart-1` … `--chart-5` | (same as light) | | Chart palette |
| `--sidebar` | `235 94% 11%` | #020035 | Sidebar bg |
| `--sidebar-foreground` | `210 5% 96%` | #F2F3F4 | Sidebar text |
| `--sidebar-primary` | `19 100% 46%` | Kimchi | Sidebar accent |
| `--sidebar-primary-foreground` | `0 0% 100%` | | Text on sidebar primary |
| `--sidebar-accent` | `234 96% 23%` | Dark Royalty | Sidebar hover |
| `--sidebar-accent-foreground` | `210 5% 96%` | | Text on sidebar accent |
| `--sidebar-border` | `234 96% 28%` | | Sidebar borders |
| `--sidebar-ring` | `19 100% 46%` | Kimchi | Sidebar focus |
| `--login-accent` | `19 100% 46%` | Kimchi | Login right panel |
| `--login-accent-foreground` | `0 0% 98%` | | Text on login accent |

---

## Radius

| Token | Value | Usage |
|-------|--------|--------|
| `--radius` | `0.5rem` | Base radius (buttons, cards, inputs) |

---

## Usage in code

- **Tailwind:** `bg-primary`, `text-muted-foreground`, `border-border`, `ring-ring`, etc.
- **CSS:** `background: hsl(var(--background));`, `color: hsl(var(--primary));`
- **RGBA (primary only):** `rgba(var(--primary-rgb), 0.15)` for overlays/glows.
- **Source of truth:** `apps/client-dashboard/src/app/globals.css` (and mirrored in admin-dashboard, marketing, packages/ui as needed).
