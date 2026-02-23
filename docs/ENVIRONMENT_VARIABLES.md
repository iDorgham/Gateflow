# Environment Variables

This document serves as the registry for all environment variables utilized across the GateFlow applications.

> **⚠️ WARNING:** Never commit actual `.env` or `.env.local` files containing real secrets to version control. Always use `.env.example` to track variable keys.

## Global Requirements
Most servers relying on the core backend will require:
- `DATABASE_URL="postgresql://user:password@host:port/gateflow"`
- `NEXT_PUBLIC_API_URL="https://api.gateflow.com/v1"`

## Next.js Applications
Web apps (`marketing`, `admin-dashboard`, `client-dashboard`, `resident-portal`) define safe variables prefixed with `NEXT_PUBLIC_` for browser consumption.

### Authentication (NextAuth / JWT)
- `NEXTAUTH_URL="http://localhost:3000"` (or actual production domain)
- `NEXTAUTH_SECRET="super-secure-random-string"`

### Client-Side Variables
- `NEXT_PUBLIC_STRIPE_KEY="pk_test_..."` (Billing/Stripe Integrations)
- `NEXT_PUBLIC_MAPS_KEY="AIza..."` (For geolocation and resident boundary checks)

## React Native / Expo Applications
Expo leverages `.env` configurations injected during the EAS build process. Use `eas secret:create` to upload sensitive secrets securely.

### Expo Specific
- `EXPO_PUBLIC_API_URL="https://api.gateflow.com/v1"`
- `EXPO_PUBLIC_SUPABASE_KEY` (If Supabase is used for real-time auth)

Ensure the `eas.json` file properly registers env variables per profile (production vs. development).
