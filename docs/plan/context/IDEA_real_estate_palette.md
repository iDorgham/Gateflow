# IDEA_real_estate_palette — Professional Real Estate Color Palette & UI Refresh

**Owner:** Product + Design  
**Created:** 2026-03-02  
**Status:** Draft (Idea captured)  
**Primary reference:** `assets/Images/bbab71814a23880255d1be321d27b24f.jpg` (color palette image)  

---

## 1. Problem & Motivation

GateFlow serves gated compounds, properties, and real estate–adjacent venues in MENA. The current UI uses a generic zinc/neutral palette. To better align with the **serious, professional** expectations of real estate and property management clients, we need a distinct design system that:

- Feels **trustworthy** and **institutional** (deep blues convey stability).
- Uses **Kimchi (#ED4B00)** as the accent (orange) for CTAs and highlights.
- Maintains **WCAG contrast ratios** from the reference palette.
- Follows **less is more** — clean, minimal, purposeful.
- Adds **subtle particles** for a modern touch without distraction.

---

## 2. Goals

1. **Apply the reference palette** from the image with its contrast ratios:
   - **Anti-Flash White** `#F2F3F4` — primary background (18.9:1)
   - **Lace Cap** `#EBEAED` — secondary/muted background (17.52:1)
   - **Kimchi** `#ED4B00` — accent/orange (3.74:1; use with white text for contrast)
   - **Midnight Blue** `#020035` — primary dark text/headers (19.92:1)
   - **Dark Royalty** `#02066F` — secondary dark (16.69:1)
   - **Deep Sea Exploration** `#2000B1` — tertiary/links (12.38:1)

2. **Refine particles** — Login and key surfaces get subtle, professional particle effects (no gimmicks).

3. **Consistency** — Client dashboard, admin dashboard, marketing, and login all use the same semantic tokens.

---

## 3. Scope

### 3.1 In scope

- CSS variables in `globals.css` (client-dashboard, admin-dashboard, marketing, packages/ui).
- Design tokens in `packages/ui/src/tokens.ts` (if extended).
- Login shell (`packages/ui/src/components/auth/login-shell.tsx`).
- Login particles (`packages/ui/src/components/auth/login-particles.tsx`).
- `docs/guides/UI_DESIGN_GUIDE.md` — add palette reference and usage notes.

### 3.2 Out of scope

- Scanner app theme (mobile uses different constraints).
- Resident portal (separate initiative).
- Major layout or component redesign.

---

## 4. Constraints

- **Tailwind 3.4** only (no v4 upgrade).
- **Semantic tokens** — no hardcoded hex in components; use `text-primary`, `bg-accent`, etc.
- **RTL** — palette must work in both LTR and RTL.
- **Dark mode** — deep blues can become dark backgrounds; ensure contrast pairs.
- **prefers-reduced-motion** — particle animations must respect this.

---

## 5. Reference Palette (HSL for CSS)

| Name | Hex | HSL (approximate) | Contrast | Usage |
|------|-----|------------------|----------|-------|
| Anti-Flash White | #F2F3F4 | 210 5% 96% | 18.9:1 | Light background |
| Lace Cap | #EBEAED | 260 7% 93% | 17.52:1 | Muted/secondary bg |
| Kimchi | #ED4B00 | 19 100% 46% | 3.74:1 | Accent (buttons, links, highlights) |
| Midnight Blue | #020035 | 235 94% 11% | 19.92:1 | Primary dark, text |
| Dark Royalty | #02066F | 234 96% 23% | 16.69:1 | Secondary dark |
| Deep Sea | #2000B1 | 248 100% 35% | 12.38:1 | Tertiary, links |

---

## 6. Mapping to Design Tokens

| Token | Light mode | Dark mode |
|-------|------------|-----------|
| `--background` | Anti-Flash White | Midnight Blue |
| `--foreground` | Midnight Blue | Anti-Flash White |
| `--primary` | Kimchi | Kimchi |
| `--primary-foreground` | White | White |
| `--muted` | Lace Cap | Dark Royalty |
| `--muted-foreground` | Dark Royalty | Lace Cap |
| `--accent` | Kimchi/10% | Dark Royalty |
| `--login-accent` | Kimchi | Kimchi |

---

## 7. Skills & Tools

- **gf-design-guide** — layout, typography, grid.
- **gf-creative-ui-animation** — particles, motion.
- **tokens-design** — semantic token architecture.
- **tailwind** — utility classes.
- **SuperDesign** — optional design draft for login/marketing polish.
