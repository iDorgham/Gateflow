# Tasks — design-system-redesign

## 🚀 Status: 🔵 In-Progress

---

### [Phase 1: Foundation Token Overhaul]

- [x] Implement primitive OKLCH ramps (Neutrals, Kimchi, Cobalt, Emerald)
- [x] Establish the full `--ds-*` semantic level in `packages/tokens`
- [x] Map Tailwind v4 styles and CSS logical properties to the system
- [x] Update documentation package structure for Tailwind v4

### [Phase 2: Core Foundation Pages (1-6)]

- [x] Create `apps/design-system/src/app/colors/page.tsx` (Profiles Toggle)
- [x] Create `apps/design-system/src/app/typography/page.tsx` (Fluid scale)
- [x] Create `apps/design-system/src/app/iconography/page.tsx` (Sentinel Glow)
- [x] Create `apps/design-system/src/app/spacing/page.tsx` (Grid Lab)
- [x] Create `apps/design-system/src/app/layering/page.tsx` (Z-Index Map)
- [x] Create `apps/design-system/src/app/motion/page.tsx` (Easing visualizer)

### [Phase 3: Pattern Documentation (7-12)]

- [ ] Create AI Elements page (Sidebars, Messengers)
- [ ] Create Analytics & Charts page (Recharts tokens)
- [ ] Create Forms page (Multi-step, validation, subtle glows)
- [ ] Create Complex UI page (Tables, Overlays, Sticky headers)
- [ ] Create Auth & Login page (Tenant branding)
- [ ] Create Date Picker & Calendar page (Custom designs)

### [Phase 4: Monorepo Enforcement & Migration]

- [ ] Update `scripts/enforce-ads-design.js` to block primitives
- [ ] Standardize `packages/ui` on semantic tokens
- [ ] Standardize `packages/components` on semantic tokens
- [ ] Update `pnpm preflight` to include design system metrics

### [Phase 5: Marketing & Auth Redesign]

- [ ] Apply high-flair premium redesign to `apps/www`
- [ ] Apply high-flair premium redesign to `apps/auth`
- [ ] Implement "Cine-Entrance" staggered animations globally

### [Phase 6: Dashboards & Portal Redesign]

- [ ] Redesign Admin Dashboard with high-density focus
- [ ] Redesign Client Dashboard with high-density focus
- [ ] Redesign Resident Portal with self-service/access focus

### [Phase 7: Mobile Optimization]

- [ ] Redesign Scanner mobile app (tactile, performant)
- [ ] Redesign Resident mobile app (compact, premium)
- [ ] Audit RTL/Arabic parity for mobile layouts

### [Phase 8: Final Polish & Certification]

- [ ] WCAG 2.1 AA Accessibility Audit
- [ ] Performance Profiling (GPU/LCP/CLS)
- [ ] Organization Context (Accent/Theme Switch) Final Verification
- [ ] sync with `docs/PRD.md` and lock versioning
