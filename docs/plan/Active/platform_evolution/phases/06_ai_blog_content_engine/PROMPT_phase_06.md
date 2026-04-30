# PROMPT: Phase 6 — AI Blog Content Engine (publishes to gateflow.site/blog)

**Mission**: Build an **AI-first Blog CMS** in the Admin Dashboard for the **GateFlow Content/Marketing team**. Enables creating AI-assisted blog posts that publish to `www.gateflow.site/en/blog/[slug]` and `www.gateflow.site/ar/blog/[slug]`.

> **Architecture**: Headless CMS. The Admin Dashboard is the editor back-office. `apps/marketing` fetches published posts from the DB/API and renders them at `/en/blog/[slug]`. See `context/HEADLESS_CMS_ARCHITECTURE.md`.

> **Depends on:** Platform Evolution Phase 5 (shares the CMS infrastructure — `AiGeneratedAsset`, API patterns, ISR webhook setup).

---

## 🏛️ Strategic Goals

1. **AI Topic Generator**: Suggest 5-10 blog topics based on GateFlow's industry (Access Control, MENA Property Tech, Smart Buildings).
2. **Full Draft Generation (Vercel AI SDK v6)**: Create a multi-section blog post from a title (Intro, Body H2s, Conclusion, CTA).
3. **Cross-Language Parity (EN/AR)**: Side-by-side editor for English and Arabic — both versions publish to their respective locale routes.
4. **SEO-First Publishing**: Auto-generate meta title, description, slug, and canonical URL. Structured data (`Article` schema.org) injected.
5. **Content Asset Pipeline**: AI featured image generation. Images stored via `AiGeneratedAsset`.

---

## 🌐 Marketing Site Integration Requirements

`apps/marketing` must expose:

```
apps/marketing
└── /en/blog                   → blog index (list all PUBLISHED posts)
└── /en/blog/[slug]            → single post (fetches BlogPost.slugEn)
└── /ar/blog/[slug]            → Arabic version (fetches BlogPost.slugAr)
└── sitemap.xml                → includes all published blog slugs (EN + AR)
```

- Add `GET /api/cms/blog/[slug]` and `GET /api/cms/blog` (list) routes.
- Trigger ISR `revalidateTag('blog-[slug]')` on publish.
- Ensure `apps/marketing` sitemap auto-updates with new slugs.

---

## 🛠️ Step-by-Step Implementation

### Step 1: Blog Schema & SEO (BACKEND)

- Load `gateflow-database`.
- Update `prisma/schema.prisma`:
  - `BlogPost`: `id`, `status` (`DRAFT` | `IN_REVIEW` | `READY_TO_PUBLISH` | `PUBLISHED`), `titleEn`, `titleAr`, `slugEn` (unique), `slugAr` (unique), `contentEn (String)`, `contentAr (String)`, `excerptEn`, `excerptAr`, `metaTitleEn`, `metaTitleAr`, `metaDescEn`, `metaDescAr`, `canonicalUrl`, `featuredImageId (AiGeneratedAsset?)`, `authorId`, `publishedAt`, `createdAt`, `updatedAt`.
  - `BlogCategory`: `id`, `nameEn`, `nameAr`, `slug`.
  - Relation: `BlogPost` → many `BlogCategory` (many-to-many).
- Run `npx prisma migrate dev --name add_blog_cms`.

### Step 2: Content APIs & ISR (FULLSTACK)

- Create `apps/admin-dashboard/src/app/api/cms/blog/route.ts`:
  - `GET` — list published posts (consumed by `apps/marketing` blog index).
  - `GET /[slug]` — single post by slug (consumed by `apps/marketing` post page).
  - `POST /publish` — set status to `PUBLISHED`, trigger ISR webhook to `apps/marketing`.
- Create `apps/admin-dashboard/src/app/api/cms/generate-blog/route.ts`:
  - Use **Vercel AI SDK v6** to stream a full blog post draft from a topic.
  - Implement `translateContent` tool to convert `contentEn` → `contentAr` maintaining Markdown structure.
  - Implement `generateFeaturedImage` tool for AI cover art.
- **Security**: Every draft logged in `AiActionLog` as `CMS_BLOG_DRAFT`.

### Step 3: Premium Writing Dashboard (FRONTEND)

- Load `gf-ads-core-tokens` and `ui-ux-pro-max`.
- Build `BlogEditor.tsx` (accessible to `MARKETING_EDITOR` and `SUPER_ADMIN`):
  - **Editor**: Rich Text Editor (Tiptap with Markdown support), side-by-side EN/AR columns.
  - **AI Toolbar**: "Generate Intro", "Improve Paragraph", "Translate to Arabic", "Generate Featured Image" buttons.
  - **SEO Panel**: Live SEO score, meta title/description, slug preview.
  - **Review Checklist**: Human must tick: `SEO Verified`, `Arabic Tone Correct`, `Featured Image Approved`, `Categories Set`. Publish button activates only when all checked.
  - Style: Premium distraction-free writing UI (clean white/dark, wide content area).
- `BlogIndex.tsx`: Table of all posts with status badges, filters, and quick-publish/unpublish toggle.

### Step 4: apps/marketing Blog Routes (FRONTEND — `apps/marketing`)

- Add `[locale]/blog/page.tsx` — blog index, fetches list of published posts.
- Add `[locale]/blog/[slug]/page.tsx` — single post, fetches by slug.
- Full SEO: unique `<title>`, meta description, Open Graph, Twitter Card, `Article` JSON-LD schema.
- Arabic blog route (`/ar/blog/[slug]`) uses `dir="rtl"` layout and Arabic fonts.
- Add blog slugs to `sitemap.xml` generator.

---

## ✅ Acceptance Criteria (Definition of Done)

- [ ] **Schema**: `BlogPost` and `BlogCategory` tables migrate cleanly.
- [ ] **AI Utility**: AI generates a full blog post with H2 structure from a title in < 20 seconds (streamed).
- [ ] **Translation**: `translateContent` maintains Markdown heading/list structure between EN and AR.
- [ ] **Live URL (EN)**: Published post renders at `www.gateflow.site/en/blog/[slug]`.
- [ ] **Live URL (AR)**: Arabic post renders at `www.gateflow.site/ar/blog/[slug]` with RTL layout.
- [ ] **Sitemap**: New published slugs appear in `sitemap.xml` within 1 ISR cycle.
- [ ] **HiTL**: Publish fails unless all checklist items are confirmed.
- [ ] **SEO**: Each post has unique meta title, description, OG image, and JSON-LD.
- [ ] **RBAC**: Only `MARKETING_EDITOR` / `SUPER_ADMIN` can create/publish posts.
- [ ] **Pre-flight**: `pnpm turbo build --filter=admin-dashboard --filter=marketing` passes.

### Files likely touched

- `packages/db/prisma/schema.prisma`
- `apps/admin-dashboard/src/app/api/cms/blog/**`
- `apps/admin-dashboard/src/app/api/cms/generate-blog/route.ts`
- `apps/admin-dashboard/src/components/cms/BlogEditor.tsx`
- `apps/admin-dashboard/src/components/cms/BlogIndex.tsx`
- `apps/marketing/src/app/[locale]/blog/page.tsx` (new)
- `apps/marketing/src/app/[locale]/blog/[slug]/page.tsx` (new)
- `apps/marketing/src/app/sitemap.ts` (update)
