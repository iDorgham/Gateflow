# PROMPT: Phase 6 — AI Blog Content Engine

**Mission**: Build an **AI-first Blog Engine** in the Admin Dashboard for the Content/Marketing team. Features: AI topic suggestions, full draft generation (EN/AR), image asset creation, and strict HiTL (Human in the Loop) publishing.

---

## 🏛️ Strategic Goals

1.  **AI Topic Generator**: Suggest 5-10 blog topics based on GateFlow's industry (Access Control, MENA Property Tech).
2.  **Full Draft Generation (Vercel AI SDK v6)**: Create a multi-section blog post from a single title (Intro, Body, Conclusion).
3.  **Cross-Language Parity (EN/AR)**: Generate high-quality English and Arabic versions of the same article.
4.  **Content Asset Pipeline**: Integrate Phase 5's image generation into the blog drafting workflow.

---

## 🛠️ Step-by-Step Implementation

### Step 1: Blog Schema & SEO (BACKEND)

- Load `gateflow-database`.
- Update `prisma/schema.prisma`:
  - Create `BlogPost`, `BlogAuthor`, and `BlogCategory` tables.
  - Support multi-language content: fields for `titleEn`, `titleAr`, `slugEn`, `slugAr`, `contentEn`, `contentAr`.
  - SEO Fields: `metaTitleEn`, `metaTitleAr`, `canonicalUrl`.
- Run `npx prisma migrate dev`.

### Step 2: Content Generation API (AI/FULLSTACK)

- Load `gf-api` and `gf-ai-ux-patterns`.
- Create `apps/admin-dashboard/src/app/api/cms/generate-blog/route.ts`:
  - Use **Vercel AI SDK v6** to draft a full article structure based on a topic.
  - Implement a `translateContent` tool to convert between EN and AR while maintaining HTML/Markdown structure.
- **Security**: Mandatory `AiActionLog` entry for every generated draft.

### Step 3: Premium Writing Dashboard (FRONTEND)

- Load `gf-ads-core-tokens` and `ui-ux-pro-max`.
- Build `BlogEditor.tsx`:
  - Features: Rich Text Editor (Tiptap or equivalent), Side-by-side translation (EN/AR), AI "Improve Paragraph" tool.
  - **Review Workflow**: A "Checklist" sidebar where the human must check: `SEO Verified`, `Arabic Tone Correct`, `Images Approved`.
  - Style: Premium "Medium-style" distraction-free interface.
- **MENA/RTL**: Full Arabic RTL support in the editor. Ensure the AI generates professional Saudi/UAE/MENA-appropriate Arabic.

---

## ✅ Acceptance Criteria (Definition of Done)

- [ ] **AI Utility**: AI can generate a full blog post summary and intro from a title in < 15 seconds.
- [ ] **Translation**: The `translateContent` tool correctly maintains Markdown structure between EN and AR.
- [ ] **Publishing Workflow**: Publishing fails unless the status is `READY_TO_PUBLISH` (HiTL).
- [ ] **Aesthetics**: Premium Distraction-free Writing UI with professional transitions.
- [ ] **RTL**: Arabic content generation and editing feel native and mirror logically.
- [ ] **Pre-flight**: `pnpm turbo build` passes for the admin app.
