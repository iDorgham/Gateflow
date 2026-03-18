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

| Key | Value | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://...` | Connection string for your production database. |
| `ADMIN_ACCESS_KEY` | 32+ char string | The master secret phrase to log in. |
| `NEXT_PUBLIC_APP_URL`| `https://admin.yourdomain.com` | Your live admin URL. |

## 3. How Login Works
Once deployed, navigating to your production URL will prompt you for an Access Key. Type the `ADMIN_ACCESS_KEY` value you configured in Vercel to authenticate. No username or email is required.
