# PROMPT: Phase 5 — AI-Powered Landing Page Builder

**Mission**: Build a block-based **Landing Page Builder** in the Admin Dashboard for the Marketing team. Features: AI text and image generation (Vercel AI SDK v6), live section-based editing, and structured publishing workflow.

---

## 🏛️ Strategic Goals

1.  **Block-Based Composer**: Structured drag-and-drop hierarchy (not freeform) to ensure ADS compliance and responsiveness.
2.  **AI Generation (Text + Image)**: Use AI to generate section copy and visual assets (using Grok Imagine or OpenAI).
3.  **Live Preview & Multi-Language**: Real-time side-by-side preview for English and Arabic layouts.
4.  **Publishing Workflow (HiTL)**: Draft → Review → Published. Every AI creation must log to `AiActionLog`.

---

## 🛠️ Step-by-Step Implementation

### Step 1: Landing Page Schema (BACKEND)

- Load `gateflow-database`.
- Update `prisma/schema.prisma`:
  - Create `LandingPage` and `LandingPageSection` tables.
  - Link `Section` to a `Page`.
  - Define common section types: `Hero`, `Features`, `Pricing`, `LeadForm`.
  - Add `AiGeneratedAsset` to link AI-created images to sections.
- Run `npx prisma migrate dev`.

### Step 2: AI Composer API (AI/FULLSTACK)

- Load `gf-api` and `gf-ai-ux-patterns`.
- Create `apps/admin-dashboard/src/app/api/cms/generate-section/route.ts`:
  - Use **Vercel AI SDK v6** to generate a JSON structure for a section based on a prompt (e.g., "Generate a high-converting hero for a luxury compound").
  - Implement an `imageGenerate` tool for Section backgrounds/visuals.
- **Security**: Log all generations into `AiActionLog` as `PENDING_CONFIRMATION`.

### Step 3: Block-Based Builder UI (FRONTEND)

- Load `gf-ads-core-tokens` and `ui-ux-pro-max`.
- Build `PageBuilder.tsx`:
  - Features: Add Section (from library), Drag-and-drop to reorder, AI "Rewrite Section" button.
  - **HiTL Panel**: A review panel for all AI-generated assets where the marketing team must click **"Approve Asset"** before it goes to the live site.
  - Style: Premium "Studio" dark-mode (Sidebar with properties, Main area for live canvas).
- **MENA/RTL**: Side-by-side EN/AR editor. Arabic version must automatically mirror but keep branding consistent. Ensure Arabic text is generated with a professional, local tone.

---

## ✅ Acceptance Criteria (Definition of Done)

- [ ] **AI Utility**: AI successfully generates a structured JSON Hero section with valid copy and a placeholder/generated image.
- [ ] **Interactivity**: Marketing team can drag to reorder existing sections on the canvas.
- [ ] **HiTL Check**: Publishing a page fails if any internal AI asset is not yet "Approved".
- [ ] **Aesthetics**: High-end "Builder" interface with professional layout transitions.
- [ ] **RTL**: Real-time Arabic preview is native and correctly mirrors the English structure.
- [ ] **Pre-flight**: `pnpm turbo build` passes for the admin app.
