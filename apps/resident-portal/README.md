# GateFlow Resident Portal

The `resident-portal` is a dedicated web application for the end-users living or working within a GateFlow-managed property. It provides residents with the autonomy to manage their expected visitors, delivery workflows, and personal access history.

## 🎯 Primary Objective
To drastically reduce front-desk administrative overhead by putting visitor management directly into the hands of the residents via a fast, responsive, and secure web interface.

## ✨ Key Features
- **Visitor Passes**: Create one-time or time-boxed QR passes. Track pass validity and usage states.
- **Open House Passes**: Generate unlimited-use passes constrained by date limits (ideal for real estate agents or large events).
- **Access Rules**: Configure strict blocklists ("Never Allow") or permanent allowlists for recurring visits (e.g., dog walkers).
- **Scan History**: Review personal history of who accessed the property bounds under the resident's generated passes.
- **Quota Tracking**: Monitor monthly or weekly allowances for visitor invitations (managed by the governing org).

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + `@gate-access/ui` shared tokens
- **Components**: Radix UI primitives / Shadcn UI
- **PWA Ready**: Built to be installable on user home screens for offline-capabilities.

## 📁 Folder Structure
```text
resident-portal/
├── src/
│   ├── app/
│   │   ├── (auth)/         # Resident login/verification
│   │   ├── dashboard/      # Main authenticated layout
│   │   │   ├── passes/     # Pass generation & tracking
│   │   │   ├── history/    # Personal scan logs
│   │   │   ├── settings/   # Quota usage and profile
│   │   └── globals.css     # Injects global UI tokens
│   └── components/         # Resident-focused, mobile-first UI blocks
├── tailwind.config.ts      # Extended from packages/config
└── next.config.mjs
```

## 🚀 Getting Started

### Local Development
Run from the root workspace:
```bash
pnpm turbo dev --filter resident-portal
```

### Design Philosophy
Unlike the desktop-first `client-dashboard` and `admin-dashboard`, the `resident-portal` is strictly **Mobile-First**. Most residents will access this UI out-and-about regarding pending visitors. Assume viewport constraints are narrow. Rely on `packages/ui` standard radii tokens to keep UI controls exceptionally large and tap-friendly.

## 🔗 Related Documentation
- [Resident Portal Specification](../../docs/RESIDENT_PORTAL_SPEC.md)
- [Project Structure](../../docs/PROJECT_STRUCTURE.md)
