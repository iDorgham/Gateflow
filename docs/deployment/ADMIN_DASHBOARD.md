# Deploying Admin Dashboard to Vercel

The **Admin Dashboard** is a lightweight, single-user internal tool for managing the entire platform. It uses a session cookie based on a single master secret key.

## 1. Vercel Configuration

1. **Root Directory**: `apps/admin-dashboard`
2. **Framework Preset**: `Next.js`
3. **Build Command**: `pnpm run build`
4. **Install Command**: `pnpm install`
5. **Include source files outside directory**: **CHECKED**

## 2. Environment Variables

Add these values to your Vercel project configuration:

| Key                   | Value                          | Description                                     |
| --------------------- | ------------------------------ | ----------------------------------------------- |
| `DATABASE_URL`        | `postgresql://...`             | Connection string for your production database. |
| `ADMIN_ACCESS_KEY`    | 32+ char string                | The master secret phrase to log in.             |
| `NEXT_PUBLIC_APP_URL` | `https://admin.yourdomain.com` | Your live admin URL.                            |

## 3. How Login Works

Once deployed, navigating to your production URL will prompt you for an Access Key. Type the `ADMIN_ACCESS_KEY` value you configured in Vercel to authenticate. No username or email is required.

Routes live under a locale prefix (`/en/...` and `/ar-EG/...`). Middleware redirects bare paths to a negotiated locale, then `/[locale]/login` is the only unauthenticated page under that prefix.

## 4. Production smoke test (after each deploy)

1. Open `https://<admin-host>/en/login` and `https://<admin-host>/ar-EG/login`; confirm the login screen loads (no generic “Application error” / digest-only overlay).
2. Submit the access key; confirm redirect to `/<locale>/` (overview) and that navigation works for both locales.
3. If `ADMIN_ACCESS_KEY` is missing or shorter than 32 characters: expect redirect to login for HTML, and `503` JSON for `/api/admin/*` (except `/api/admin/login`).

## 5. Mapping RSC “digest” errors to server logs (Vercel)

In production, React Server Components often hide the real message in the client and show a **digest** (and a chunk id such as `2791-*.js`).

**Vercel Runtime Logs**

1. In the Vercel project → **Logs** (or **Observability → Runtime**), filter by deployment and reproduce the error.
2. Match **time** (within a few seconds of the browser request) and **path** (`/en/...` or `/ar-EG/...`). The **stack trace and original error text** are on the server log line for that request—not in the digest.
3. If logs are noisy, temporarily add a distinctive query string when reproducing (e.g. `?debug=rsc1`) and filter logs by that URL.

**Local full detail**
Run `pnpm dev` or `pnpm build && pnpm start` for `admin-dashboard` and reproduce: Next.js surfaces the full RSC error in the terminal (and often in the overlay) in non-minified dev builds.

**Note:** Edge + Node middleware for this app lives in `apps/admin-dashboard/src/middleware.ts` (admin session, locale redirect, CSRF). A duplicate `middleware.ts` at the app root is not used when `src/` is the app root.
