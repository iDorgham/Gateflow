# PROMPT: Phase 4 — Style Editing & Live Theming Hub (White-Labeling Engine)

**Mission**: Build a real-time, token-safe **Style & Branding Hub** in the Admin Dashboard. Enables GateFlow Dev/Design team to white-label each client organization's dashboard with custom branding while maintaining ADS token safety and WCAG contrast compliance.

> **Depends on:** `gateflow_design_system` Phase 1-2 (`@gateflow/tokens` and `@gateflow/theme` must be published locally). Platform Evolution Phase 1 (org routing).

> **Architecture**: This tool is used by GateFlow's internal Dev/Design team to configure per-org branding. Changes propagate to `apps/client-dashboard` as CSS variable overrides served at runtime.

---

## 🔑 RBAC for Style Hub

| Role          | View Branding | Edit Branding | Apply Globally | Rollback |
| :------------ | :------------ | :------------ | :------------- | :------- |
| `SUPER_ADMIN` | All orgs      | All orgs      | Yes            | Yes      |
| `DEV_ADMIN`   | All orgs      | All orgs      | Yes            | Yes      |
| Others        | None          | None          | None           | None     |

Only `SUPER_ADMIN` and `DEV_ADMIN` can access the Style Hub. This is a power-user tool.

---

## 🏛️ Strategic Goals

1. **Token-Safe Overrides**: User-defined styles (colors, fonts) map to `@gateflow/tokens` semantic slots. No arbitrary CSS injection — only whitelisted token overrides.
2. **Live Preview via PostMessage**: Real-time iframe preview of `apps/client-dashboard` receiving CSS variable overrides via `window.postMessage`. No page reload.
3. **Brand Inheritance**: "GateFlow Default" branding (from `@gateflow/tokens`) is the base. Per-org overrides layer on top. Missing values inherit from default.
4. **WCAG Contrast Validation**: Every color override is checked against WCAG 2.1 AA (4.5:1 for text, 3:1 for UI). Warn on violation; block save on critical failure.
5. **Asset Storage (Vercel Blob)**: Org logos and custom assets stored in Vercel Blob Storage. Served via CDN.
6. **Rollback**: Every branding change creates a versioned snapshot. Admin can revert to any previous version with one click.

---

## 🔗 Integration with `@gateflow/tokens`

The Style Hub operates on a **whitelist of overridable tokens** from `@gateflow/tokens`:

```ts
// Overridable tokens (subset of @gateflow/tokens semantic keys)
const OVERRIDABLE_TOKENS = [
  '--gf-color-primary', // Brand primary
  '--gf-color-primary-foreground',
  '--gf-color-secondary', // Brand secondary
  '--gf-color-background', // App background
  '--gf-color-surface', // Card/panel surfaces
  '--gf-color-border', // Border color
  '--gf-color-accent', // Accent/highlight
  '--gf-color-muted', // Muted backgrounds
] as const;

// Font overrides
const OVERRIDABLE_FONTS = [
  '--gf-font-family-sans', // Primary font
  '--gf-font-family-arabic', // Arabic font (Cairo, Almarai, etc.)
] as const;
```

The engine generates a CSS override block per org:

```css
/* Generated for org: al-rimal-compound */
[data-org-id='clxyz...'] {
  --gf-color-primary: oklch(0.65 0.18 250);
  --gf-color-primary-foreground: oklch(0.98 0 0);
  --gf-font-family-sans: 'Outfit', sans-serif;
  --gf-font-family-arabic: 'Cairo', sans-serif;
}
```

---

## 🛠️ Step-by-Step Implementation

### Step 1: Branding Schema & Versioning (BACKEND)

- Load `gateflow-database` and `gateflow-security`.
- Update `prisma/schema.prisma`:

```prisma
model OrganizationBranding {
  id               String   @id @default(cuid())
  organizationId   String   @unique
  organization     Organization @relation(fields: [organizationId], references: [id])
  // Token overrides stored as JSON
  tokenOverrides   Json     // { '--gf-color-primary': 'oklch(...)' }
  fontFamily       String?  // Google Font name (EN)
  fontFamilyArabic String?  // Google Font name (AR)
  logoUrl          String?  // Vercel Blob URL
  faviconUrl       String?  // Vercel Blob URL
  isActive         Boolean  @default(true)
  version          Int      @default(1)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model BrandingSnapshot {
  id               String   @id @default(cuid())
  organizationId   String
  version          Int
  tokenOverrides   Json
  fontFamily       String?
  fontFamilyArabic String?
  logoUrl          String?
  createdById      String
  createdAt        DateTime @default(now())
}
```

- Run `npx prisma migrate dev --name add_org_branding_and_snapshots`.

### Step 2: Branding API & Asset Storage (FULLSTACK)

- Create `apps/admin-dashboard/src/app/api/branding/[orgId]/route.ts`:
  - `GET` — return current branding + all snapshots for rollback list.
  - `PATCH` — update branding. Auto-increment `version`. Create `BrandingSnapshot` before overwriting. Log to `AiActionLog` as `BRANDING_UPDATED`.
  - `POST /rollback` — restore from a specific `BrandingSnapshot.id`.
- Create `apps/admin-dashboard/src/app/api/branding/upload/route.ts`:
  - Upload logo/favicon to Vercel Blob Storage (or S3 if Blob unavailable).
  - Validate: max 2MB, image/\* only, dimensions 512×512 min for logo.
  - Return CDN URL for storage in `OrganizationBranding.logoUrl`.
- Create `apps/admin-dashboard/src/lib/branding-css-generator.ts`:
  - Takes `tokenOverrides` JSON → generates CSS override block per org.
  - This CSS is served to `apps/client-dashboard` via API or embedded at runtime.

### Step 3: WCAG Contrast Validator (UTILITY)

- Create `packages/utils/src/contrast.ts`:
  - Implement WCAG 2.1 AA contrast ratio calculation.
  - Input: two OKLCH or hex colors → Output: `{ ratio: number, passesAA: boolean, passesAAA: boolean }`.
  - For every primary/background override: validate against foreground text color.
- Integrate into the Style Editor UI: real-time contrast badge (✅ AA / ⚠️ Fail) next to every color picker.
- **Block save** if `primary` vs `primary-foreground` contrast < 4.5:1.

### Step 4: Live Preview & Style Editor UI (FRONTEND)

- Load `gf-ads-core-tokens`, `gf-design-guide`, and `ui-ux-pro-max`.
- Build `StyleEditor.tsx` (accessible to `DEV_ADMIN` / `SUPER_ADMIN` only):
  - **Left Panel**: Token override controls:
    - Color pickers (OKLCH-aware, hue/saturation/lightness sliders) for each overridable token.
    - Font selector: dropdown of Google Fonts with live preview text.
    - Logo uploader with drag-and-drop, preview thumbnail.
    - WCAG contrast badges next to every color pair.
  - **Right Panel**: Live iframe preview of `apps/client-dashboard`:
    - Iframe loads client dashboard.
    - Style Editor sends CSS overrides via `window.postMessage({ type: 'BRANDING_OVERRIDE', tokens: {...} })`.
    - Client dashboard listens and applies overrides to `:root` in real time.
    - Toggle between light/dark mode preview.
    - Toggle between EN/AR preview.
  - **Bottom Bar**: "Save Draft", "Preview", "Apply to Production" (requires confirmation), "Rollback to Version N".
  - **Version History**: Collapsible panel showing all `BrandingSnapshot` entries with timestamps and "Restore" buttons.
- Build the **PostMessage listener** in `apps/client-dashboard/src/lib/branding-listener.ts`:
  - Only active when `window.parent !== window` (iframe context).
  - Validates message origin matches admin dashboard domain.
  - Applies received token overrides to `:root` CSS variables.
- **MENA/RTL**: Font preview includes Arabic text sample. Arabic fonts (Cairo, Almarai, Tajawal) in the font selector. Preview iframe can switch to Arabic layout.

---

## ✅ Acceptance Criteria (Definition of Done)

- [ ] **Token Safety**: Only whitelisted token overrides are accepted. Arbitrary CSS is rejected by the API.
- [ ] **Live Preview**: Changing primary color in the editor updates the iframe within 200ms (no reload).
- [ ] **PostMessage Security**: Iframe listener validates `event.origin` — rejects messages from non-admin domains.
- [ ] **Inheritance**: An org with no branding correctly uses the GateFlow Default tokens from `@gateflow/tokens`.
- [ ] **WCAG Contrast**: The editor blocks saving if primary/foreground contrast ratio < 4.5:1.
- [ ] **Rollback**: Admin can restore branding to version N-1 with one click. Previous version is instantly applied.
- [ ] **Asset Storage**: Logo uploads to Vercel Blob and displays correctly at the CDN URL.
- [ ] **RBAC**: Only `DEV_ADMIN` / `SUPER_ADMIN` can access `/api/branding/**`. Others get 403.
- [ ] **ADS Compliance**: Style Editor UI itself uses only ADS tokens. No hardcoded colors.
- [ ] **RTL**: Arabic font preview and live iframe Arabic layout work correctly.
- [ ] **Pre-flight**: `pnpm turbo build --filter=admin-dashboard --filter=client-dashboard` passes.

### Files likely touched

- `packages/db/prisma/schema.prisma`
- `packages/utils/src/contrast.ts` (new — WCAG validator)
- `apps/admin-dashboard/src/app/api/branding/[orgId]/route.ts`
- `apps/admin-dashboard/src/app/api/branding/upload/route.ts`
- `apps/admin-dashboard/src/lib/branding-css-generator.ts`
- `apps/admin-dashboard/src/components/theming/StyleEditor.tsx`
- `apps/client-dashboard/src/lib/branding-listener.ts` (new — PostMessage receiver)
