# Deploying Marketing App to Vercel

The **Marketing** app is the public-facing landing page for GateFlow. It is SEO-optimized and includes a lead-capture system using **Resend**.

## 1. Vercel Configuration

1. **Root Directory**: `apps/marketing`
2. **Framework Preset**: `Next.js`
3. **Build Command**: `pnpm run build`
4. **Install Command**: `pnpm install`
5. **Include source files outside directory**: **CHECKED**

## 2. Environment Variables

Add these values to your Vercel project configuration:

| Key                    | Value                    | Description                                 |
| ---------------------- | ------------------------ | ------------------------------------------- |
| `RESEND_API_KEY`       | `re_...`                 | API Key from Resend.com.                    |
| `CONTACT_NOTIFY_EMAIL` | `team@yourdomain.com`    | Email address where leads are sent.         |
| `CONTACT_FROM_EMAIL`   | `noreply@yourdomain.com` | Verified domain in Resend for sending mail. |
| `NEXT_PUBLIC_APP_URL`  | `https://gateflow.site`  | Final public marketing domain.              |

## 3. Optional Tracking

You can also add optional Analytics IDs to your Vercel settings:

- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
