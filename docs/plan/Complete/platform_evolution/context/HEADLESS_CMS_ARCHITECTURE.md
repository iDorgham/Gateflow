# Headless CMS Architecture — Platform Evolution

**Context:** How content created in the Admin Dashboard reaches `www.gateflow.site`.

---

## Overview

The GateFlow CMS follows a **headless architecture**. The Admin Dashboard is the **authoring back-office**. The marketing site (`apps/marketing`) is the **rendering front-end**. They share data via the Prisma DB and a lightweight API layer.

```
[GateFlow Team]
     │
     ▼
Admin Dashboard (apps/admin-dashboard)
  ├── Blog Editor         ─► writes to ─►  BlogPost (DB)
  └── Landing Page Builder ─► writes to ─►  LandingPage + LandingPageSection (DB)
                                                │
                              ┌─────────────────┘
                              ▼
                        Shared Prisma DB
                              │
                    ┌─────────┘
                    ▼
        apps/marketing (Next.js — ISR)
          ├── /en/blog                    ← list of PUBLISHED BlogPosts
          ├── /en/blog/[slugEn]           ← single BlogPost (EN)
          ├── /ar/blog/[slugAr]           ← single BlogPost (AR, RTL)
          ├── /en/[landingSlug]           ← LandingPage (EN)
          └── /ar/[landingSlug]           ← LandingPage (AR, RTL)
```

---

## Publish Flow

```
1. GateFlow team creates content in Admin Dashboard
2. Saves as DRAFT → auto-saves (no public effect)
3. Runs through REVIEW checklist (HiTL):
   - Blog: SEO, Arabic tone, featured image approved
   - Landing page: all AI assets approved
4. Clicks "Publish" → status: DRAFT → PUBLISHED
5. API triggers ISR revalidation webhook → apps/marketing
6. Next.js revalidates the affected route within 60 seconds
7. Content is live at gateflow.site
```

---

## API Contracts

### Blog API

| Method  | Path                   | Auth          | Consumer                          |
| :------ | :--------------------- | :------------ | :-------------------------------- |
| `GET`   | `/api/cms/blog`        | Public (ISR)  | `apps/marketing` — blog index     |
| `GET`   | `/api/cms/blog/[slug]` | Public (ISR)  | `apps/marketing` — single post    |
| `POST`  | `/api/cms/blog`        | Admin session | Admin Dashboard — create new post |
| `PATCH` | `/api/cms/blog/[id]`   | Admin session | Admin Dashboard — update/publish  |

### Landing Page API

| Method  | Path                    | Auth                             | Consumer                       |
| :------ | :---------------------- | :------------------------------- | :----------------------------- |
| `GET`   | `/api/cms/pages`        | Public (ISR)                     | `apps/marketing` — page list   |
| `GET`   | `/api/cms/pages/[slug]` | Public (ISR)                     | `apps/marketing` — render page |
| `POST`  | `/api/cms/pages`        | Admin session + MARKETING_EDITOR | Admin Dashboard — create page  |
| `PATCH` | `/api/cms/pages/[id]`   | Admin session + MARKETING_EDITOR | Admin Dashboard — publish      |

---

## ISR Revalidation Strategy

On status change to `PUBLISHED`:

```ts
// In the PATCH /api/cms/blog/[id] route (admin-dashboard)
await fetch(`${process.env.MARKETING_SITE_URL}/api/revalidate`, {
  method: 'POST',
  headers: { 'x-revalidate-token': process.env.REVALIDATE_SECRET },
  body: JSON.stringify({ tag: `blog-${slugEn}` }),
});
```

In `apps/marketing/src/app/api/revalidate/route.ts`:

```ts
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const token = req.headers.get('x-revalidate-token');
  if (token !== process.env.REVALIDATE_SECRET)
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  const { tag } = await req.json();
  revalidateTag(tag);
  return Response.json({ revalidated: true });
}
```

---

## Environment Variables Required

| Variable             | Where             | Purpose                             |
| :------------------- | :---------------- | :---------------------------------- |
| `MARKETING_SITE_URL` | `admin-dashboard` | Target URL for ISR webhook          |
| `REVALIDATE_SECRET`  | Both apps         | Shared secret for ISR endpoint auth |
| `DATABASE_URL`       | Both apps         | Shared Prisma DB access             |

---

## DB Models Summary

```prisma
model BlogPost {
  id            String    @id @default(cuid())
  status        CmsStatus @default(DRAFT)
  titleEn       String
  titleAr       String
  slugEn        String    @unique
  slugAr        String    @unique
  contentEn     String    @db.Text
  contentAr     String    @db.Text
  excerptEn     String?
  excerptAr     String?
  metaTitleEn   String?
  metaTitleAr   String?
  metaDescEn    String?
  metaDescAr    String?
  canonicalUrl  String?
  publishedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?
}

model LandingPage {
  id         String            @id @default(cuid())
  slug       String            @unique
  titleEn    String
  titleAr    String
  status     CmsStatus         @default(DRAFT)
  sections   LandingPageSection[]
  publishedAt DateTime?
  createdAt  DateTime          @default(now())
  updatedAt  DateTime          @updatedAt
  deletedAt  DateTime?
}

enum CmsStatus {
  DRAFT
  IN_REVIEW
  READY_TO_PUBLISH
  PUBLISHED
  ARCHIVED
}
```
