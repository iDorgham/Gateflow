# Phase 3: Blog — MDX Infra + 4 Launch Posts

## Primary role
FRONTEND + BACKEND

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/marketing`
- **Refs**:
  - `apps/marketing/app/[locale]/blog/page.tsx` — current blog index stub
  - `apps/marketing/app/[locale]/blog/[slug]/page.tsx` — current post stub
  - `apps/marketing/lib/blog-data.ts` — existing static data (to be replaced/extended)
  - `apps/marketing/next.config.js` (or `.mjs`) — needs MDX configuration
  - `apps/marketing/locales/en/` — i18n namespace

## Goal
Replace the static `blog-data.ts` system with real MDX-based blog posts using `@next/mdx`. Build a proper blog index (card grid with tags, reading time) and post page (author, date, related posts). Write 4 launch articles.

## Scope (in)

**New dependencies** (add to `apps/marketing/package.json`):
- `@next/mdx`
- `@mdx-js/loader`
- `@mdx-js/react`
- `gray-matter`
- `reading-time`

**MDX configuration** in `next.config.js`:
```js
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: { remarkPlugins: [], rehypePlugins: [] },
});
module.exports = withMDX({ pageExtensions: ['ts', 'tsx', 'mdx'] });
```

**Content directory**: `apps/marketing/content/blog/*.mdx`

**Frontmatter schema** (parsed by `gray-matter`):
```yaml
---
title: string
slug: string
date: YYYY-MM-DD
author: string
authorTitle: string
tags: string[]
excerpt: string
---
```

**`lib/blog.ts`** — blog utility:
```ts
export interface BlogPost { title, slug, date, author, authorTitle, tags, excerpt, readingTime, content }
export async function getAllPosts(): Promise<BlogPost[]>
export async function getPostBySlug(slug: string): Promise<BlogPost | null>
```
Reading time calculated with `reading-time` package.

**Blog index page** (`app/[locale]/blog/page.tsx`) — rewrite:
- Grid of BlogCard components (3 columns on desktop)
- Each card: title, excerpt, author, date, tags badges, reading time
- Tag filter (query param `?tag=X`)
- Translation keys: `blog.index.*`

**Blog post page** (`app/[locale]/blog/[slug]/page.tsx`) — rewrite:
- `generateStaticParams` for all slugs
- `generateMetadata` from frontmatter
- Author name + title + date + reading time header
- MDX body rendered with `MDXRemote` or Next.js MDX component
- Related posts: 2 posts with matching tags (at bottom)
- Back to blog link

**`components/blog-card.tsx`** — blog card component

**4 launch MDX posts** in `content/blog/`:

1. `whatsapp-qr-security-risk.mdx`
   - Title: "Why WhatsApp QR codes are a security risk for gated communities"
   - Tags: security, access-control
   - ~600 words: HMAC-unsigned QRs, screenshot sharing, no expiry, no audit trail, GateFlow alternative

2. `cut-gate-wait-time.mdx`
   - Title: "How GateFlow cuts gate wait time by 60%"
   - Tags: operations, performance
   - ~500 words: bottleneck analysis, pre-authorized QR flow, offline resilience, before/after comparison

3. `zero-trust-real-estate.mdx`
   - Title: "Zero-trust access for real estate compounds — a technical overview"
   - Tags: security, technical, architecture
   - ~700 words: HMAC-SHA256, token rotation, RBAC, audit logs, multi-tenancy model

4. `mena-property-managers-guide.mdx`
   - Title: "MENA property managers: your guide to digital gate infrastructure"
   - Tags: mena, property-management, guide
   - ~600 words: market context, regulation, Arabic-first design, resident self-service, ROI framing

## Steps (ordered)
1. Run `pnpm add @next/mdx @mdx-js/loader @mdx-js/react gray-matter reading-time --filter=marketing`.
2. Configure MDX in `next.config.js`.
3. Create `apps/marketing/lib/blog.ts` — `getAllPosts` + `getPostBySlug`.
4. Create `apps/marketing/content/blog/` directory and write 4 MDX post files.
5. Create `apps/marketing/components/blog-card.tsx`.
6. Rewrite `app/[locale]/blog/page.tsx` — grid + tag filter.
7. Rewrite `app/[locale]/blog/[slug]/page.tsx` — post page + related posts.
8. Add `blog.*` translation keys to `locales/en/` (new `blog.json` namespace).
9. Run `pnpm turbo build --filter=marketing` — verify static generation of blog routes.
10. Run `pnpm turbo typecheck --filter=marketing`.
11. Commit: `feat(marketing): MDX blog infra + 4 launch posts (phase 3)`.

## Scope (out)
- Contact form backend (Phase 4)
- OG images for blog (Phase 5)
- AR-EG translation of blog posts (Phase 5)
- CMS integration

## Acceptance criteria
- [ ] Blog index renders 4 post cards with correct metadata
- [ ] Tag filter works (`?tag=security` shows only tagged posts)
- [ ] Individual post pages render MDX content with correct reading time
- [ ] Related posts section shows posts with matching tags
- [ ] `generateStaticParams` exports all 4 slugs (build produces static HTML)
- [ ] `pnpm turbo build --filter=marketing` passes with blog routes
- [ ] `pnpm turbo typecheck --filter=marketing` passes

## Files likely touched
- `apps/marketing/package.json`
- `apps/marketing/next.config.js`
- `apps/marketing/lib/blog.ts` (new)
- `apps/marketing/lib/blog-data.ts` (updated or deprecated)
- `apps/marketing/content/blog/*.mdx` (4 new files)
- `apps/marketing/components/blog-card.tsx` (new)
- `apps/marketing/app/[locale]/blog/page.tsx` (rewrite)
- `apps/marketing/app/[locale]/blog/[slug]/page.tsx` (rewrite)
- `apps/marketing/locales/en/blog.json` (new)

## Git commit
```
feat(marketing): MDX blog infra + 4 launch posts (phase 3)
```
