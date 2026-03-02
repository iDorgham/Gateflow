---
name: vercel
description: Deploy and configure Next.js apps on Vercel. Use when setting up deployment, env vars, or Vercel-specific config.
---

# Vercel

## Deployment

- **Framework:** Next.js (auto-detected)
- **Build:** `pnpm build` or `pnpm turbo build`
- **Root:** Monorepo root or app directory (`apps/client-dashboard`)

## Environment

- Set in Vercel dashboard: Project → Settings → Environment Variables
- Required: `DATABASE_URL`, `NEXTAUTH_SECRET`, `QR_SIGNING_SECRET`, etc.
- Never commit `.env` or `.env.local`

## Monorepo

- Set **Root Directory** to app path (e.g. `apps/client-dashboard`)
- Or use Turborepo remote cache; configure in `vercel.json` if needed

## Output

- **Serverless** — API routes run as serverless functions
- **Edge** — Use `export const runtime = 'edge'` for edge routes
- **Static** — Pages without dynamic data can be static
