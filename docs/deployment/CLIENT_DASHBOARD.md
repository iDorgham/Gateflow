# Deploying Client Dashboard to Vercel

The **Client Dashboard** is the main control panel for residents and staff. It requires several environment
secrets to handle authentication, QR signing, and Stripe billing.

## 1. Vercel Configuration

1.  **Root Directory**: `apps/client-dashboard`
2.  **Framework Preset**: `Next.js`
3.  **Build Command**: `pnpm run build`
4.  **Install Command**: `pnpm install`
5.  **Include source files outside directory**: **CHECKED** (Mandatory)

## 2. Environment Variables

Add these to your project settings in Vercel:

| Key | Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...` | Connection string for production. |
| `NEXTAUTH_SECRET` | 32+ char string | Generate: `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | `https://app.yourdomain.com` | Your live application URL. |
| `QR_SIGNING_SECRET` | 32+ char string | Secure secret for signing QR codes. |
| `ENCRYPTION_MASTER_KEY` | 64 hex chars | Key for AES-256GCM encryption. |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Your Stripe Production Secret Key. |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | For processing subscription events. |
| `GEMINI_API_KEY` | `AI...` | Key for Google AI (AI Assistant). |

## 3. Database Execution

After the first successful build, run migrations from your local machine:

```bash
DATABASE_URL="PROD_URL" pnpm --filter @gate-access/db prisma migrate deploy
```
