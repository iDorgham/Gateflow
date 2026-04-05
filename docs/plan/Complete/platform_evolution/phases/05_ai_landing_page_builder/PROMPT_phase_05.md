# PROMPT: Phase 5 — AI Landing Page Builder (publishes to gateflow.site)

**Mission**: Build a block-based **Landing Page Builder** in the Admin Dashboard for the **GateFlow Marketing team**. Enables creating AI-assisted landing pages that publish directly to `www.gateflow.site/en/[slug]` for lead generation and campaigns.

> **Architecture**: This is a **Headless CMS** tool. The Admin Dashboard is the back-office editor. `apps/marketing` (Next.js) is the consumer — it fetches published pages from the shared DB/API and renders them at the correct routes. See `context/HEADLESS_CMS_ARCHITECTURE.md`.

> **Depends on:** Platform Evolution Phase 1 (org routing, AiActionLog). Phase 4 (design tokens) recommended but not blocking.

---

## 🏛️ Strategic Goals

1. **Block-Based Composer**: Structured drag-and-drop hierarchy (not freeform) to ensure ADS compliance and responsiveness. Section types: `Hero`, `Features`, `Social Proof`, `CTA`, `Pricing`, `FAQ`, `LeadForm`.
2. **AI Generation (Text + Image)**: Use AI to generate section copy and visual assets (via Vercel AI SDK v6).
3. **Live Preview & Multi-Language**: Real-time side-by-side preview for English and Arabic layouts.
4. **Publishing Pipeline (HiTL)**: Draft → Review → Published. On `PUBLISHED`, trigger ISR revalidation in `apps/marketing`.
5. **Target URLs**: Pages publish to `www.gateflow.site/en/[slug]` and `www.gateflow.site/ar/[slug]`.

---

## 🌐 Marketing Site Integration Requirements

Before building the builder UI, ensure `apps/marketing` is ready to consume:

```
apps/marketing
└── src/app/[locale]/[slug]/page.tsx
    └── fetches from: GET /api/cms/pages/[slug]?locale=en|ar
    └── ISR: revalidateTag('landing-page-[slug]') on publish webhook
```

- Add `GET /api/cms/pages/[slug]` route in `apps/admin-dashboard` (or shared API).
- Trigger `revalidateTag` or `revalidatePath` in `apps/marketing` when page status changes to `PUBLISHED`.
- Verify `apps/marketing` build still passes after schema changes.

---

## 🛠️ Step-by-Step Implementation

### Step 1: Landing Page Schema (BACKEND)

- Load `gateflow-database`.
- Update `prisma/schema.prisma`:
  - `LandingPage`: `id`, `slug`, `titleEn`, `titleAr`, `status` (`DRAFT` | `IN_REVIEW` | `PUBLISHED`), `publishedAt`, `createdBy`, `organizationId` (null = GateFlow global).
  - `LandingPageSection`: `id`, `pageId`, `type` (enum), `order`, `contentEn (Json)`, `contentAr (Json)`, `aiGenerated (Boolean)`.
  - Link `AiGeneratedAsset` to sections for image tracking.
- Run `npx prisma migrate dev --name add_landing_page_cms`.

### Step 2: AI Composer API (AI/FULLSTACK)

- Load `gf-api` and `gf-ai-ux-patterns`.
- Create `apps/admin-dashboard/src/app/api/cms/pages/[slug]/route.ts`:
  - `GET` — return published page JSON (consumed by `apps/marketing`).
  - `POST` — publish page; trigger ISR revalidation webhook to `apps/marketing`.
- Create `apps/admin-dashboard/src/app/api/cms/generate-section/route.ts`:
  - Use **Vercel AI SDK v6** to generate section JSON from a prompt.
  - Implement `imageGenerate` tool for section visuals.
- **Security**: All AI generations logged to `AiActionLog` as `PENDING_CONFIRMATION`.

### Step 3: Block-Based Builder UI (FRONTEND)

- Load `gf-ads-core-tokens` and `ui-ux-pro-max`.
- Build `PageBuilder.tsx` (accessible to `MARKETING_EDITOR` and `SUPER_ADMIN` only):
  - Features: Section library panel, drag-to-reorder, AI "Generate Section" button, publish controls.
  - **HiTL Panel**: "Review & Approve Assets" sidebar — AI assets must be approved before publish button activates.
  - **Live Preview**: Embedded iframe rendering the marketing site with the draft page data.
  - Style: Premium "Studio" dark-mode (left panel = structure/sections, right = live preview).
- **MENA/RTL**: Side-by-side EN/AR toggled preview. Arabic sections mirror block order. AI generates Arabic copy with MENA-market tone.

### Step 4: apps/marketing Route (FRONTEND — `apps/marketing`)

- Add dynamic `[locale]/[slug]/page.tsx` route in `apps/marketing`.
- Fetch from `GET /api/cms/pages/[slug]?locale=en` at build/request time (ISR).
- Render each `LandingPageSection` as a React component matching its `type`.
- Ensure full SEO: meta title, description, canonical, OG tags per page.
- Verify `pnpm turbo build --filter=marketing` passes.

---

## ✅ Acceptance Criteria (Definition of Done)

- [ ] **Schema**: `LandingPage` and `LandingPageSection` tables migrate cleanly.
- [ ] **AI Utility**: AI generates a valid Hero section JSON with copy + image asset reference.
- [ ] **HiTL**: Publish button is disabled until all AI assets have `CONFIRMED` status.
- [ ] **Live URL**: A published page renders correctly at `www.gateflow.site/en/[slug]`.
- [ ] **ISR**: Page updates in `apps/marketing` within 60 seconds of status → `PUBLISHED`.
- [ ] **RTL**: Arabic landing page renders correctly at `www.gateflow.site/ar/[slug]`.
- [ ] **RBAC**: Only `MARKETING_EDITOR` / `SUPER_ADMIN` can create/publish pages.
- [ ] **Pre-flight**: `pnpm turbo build --filter=admin-dashboard --filter=marketing` passes.

### Files likely touched

- `packages/db/prisma/schema.prisma`
- `apps/admin-dashboard/src/app/api/cms/pages/**`
- `apps/admin-dashboard/src/app/api/cms/generate-section/route.ts`
- `apps/admin-dashboard/src/components/cms/PageBuilder.tsx`
- `apps/marketing/src/app/[locale]/[slug]/page.tsx` (new)
- `apps/marketing/src/lib/cms.ts` (new — fetch helpers)
