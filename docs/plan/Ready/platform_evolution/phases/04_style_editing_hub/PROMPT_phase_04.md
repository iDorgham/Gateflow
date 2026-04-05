# PROMPT: Phase 4 — Style Editing & Live Theming Hub

**Mission**: Build a real-time, token-safe **Style & Branding Hub** in the Admin Dashboard. Features: Live previewing, brand inheritance, and custom token overriding for client white-labeling.

---

## 🏛️ Strategic Goals

1.  **Live Token Previews**: Real-time visualization of branding changes (Colors, Typography, Logos) before saving.
2.  **Brand Inheritance**: Support an "Operator Default" style that Organizations can inherit and then override.
3.  **ADS Token Safety**: Ensure any user-defined style (e.g., `primaryColor`) is mapped to a standard ADS token slot to maintain UI scale/density integrity.
4.  **Logo & Asset Management**: Integrated asset library for per-organization branding.

---

## 🛠️ Step-by-Step Implementation

### Step 1: Branding Schema (BACKEND)

- Load `gateflow-database`.
- Update `prisma/schema.prisma`:
  - Create `OrganizationBranding` and `BrandToken` tables with `primaryColor`, `secondaryColor`, `logoUrl`, and `fontFamily` (Enum).
  - Link `Branding` to `Organization`.
  - Support a "Global Default" branding row for inheritance logic.
- Run `npx prisma migrate dev`.

### Step 2: Live Theming Engine (FRONTEND)

- Load `gf-ads-core-tokens` and `ui-ux-pro-max`.
- Create `apps/admin-dashboard/src/components/theming/StyleEditor.tsx`:
  - Features: Color pickers (Hue/Saturation aware), Font selector (Google Font integration), Logo uploader.
  - **Real-time Engine**: Use CSS variables (CSS-in-JS or Tailwind theme injection) to apply the branding to a live-preview iframe/component in real-time.
- Build the `IframePreview.tsx` component to show the Client Dashboard or Marketing site with the new branding instantly.

### Step 3: Brand Logic & Override Settings (FRONTEND)

- Create `BrandingSettings.tsx` in Admin:
  - Features: "Reset to Default" button, "Apply Globally" (for super-admins), and "Inherit from GateFlow" toggle.
  - Validation: Guard against "Bad Contrast" colors using AI or WCAG contrast check logic.
- **MENA/RTL**: Branding changes include RTL specific fonts (e.g., Cairo, Almarai). Real-time preview should accurately show Arabic typography.

---

## ✅ Acceptance Criteria (Definition of Done)

- [ ] **Live Preview**: Changing a color hex in the editor instantly updates the preview iframe/component.
- [ ] **Inheritance**: An organization with no branding correctly uses the "Global Default" tokens.
- [ ] **Safety**: User-selected colors are successfully injected into the `--ds-` token system without breaking layouts.
- [ ] **Aesthetics**: Premium 2026 SaaS feel for the editor (Glassmorphism, smooth transitions).
- [ ] **RTL**: Arabic typography preview works perfectly and supports culturally appropriate fallback fonts.
- [ ] **Pre-flight**: `pnpm turbo build` passes for the admin app.
