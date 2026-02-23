# GateFlow Admin Dashboard

The `admin-dashboard` is the global control center for the GateFlow ecosystem. It is designed exclusively for superadmins to manage the overarching multi-tenant architecture, oversee all subscribed organizations, monitor system health, and enforce global compliance.

## 🎯 Primary Objective
To provide an uncompromising, God-eye view of the entire GateFlow platform, allowing internal GateFlow staff to manage corporate clients, track macro-level analytics, and step in for high-level support operations.

## ✨ Key Features
- **Organization Management**: Create, suspend, modify, and delete client organizations. Assign organization admins.
- **Global Usage & Analytics**: Aggregated charting of total scans, total active portals, and hardware states across all organizations.
- **System Health Monitoring**: Live status tracking of core backend services (Database, API, CDN latency, Webhooks).
- **Audit Trails**: Non-repudiable logs of superadmin actions and critical structural changes to the database.
- **Hardware Provisioning**: Registering new physical gate nodes to the system before they are assigned to specific client organizations.

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + `@gate-access/ui` shared tokens
- **Components**: Radix UI primitives / Shadcn UI
- **Icons**: Lucide React
- **Authentication**: NextAuth.js (Strictly bound to superadmin roles)

## 📁 Folder Structure
```text
admin-dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/         # Superadmin login flows
│   │   ├── dashboard/      # Main authenticated layout
│   │   │   ├── organizations/ # Org management routes
│   │   │   ├── hardware/   # Gate registration tracking
│   │   │   ├── system/     # Health and audit logs
│   │   └── globals.css     # Injects global UI tokens
│   └── components/         # Admin-specific UI blocks not in @gate-access/ui
├── tailwind.config.ts      # Extended from packages/config
└── next.config.mjs
```

## 🚀 Getting Started

### Local Development
Since this is part of a Turborepo, it is recommended to run from the root:
```bash
pnpm turbo dev --filter admin-dashboard
```
Or locally within the `apps/admin-dashboard` directory:
```bash
pnpm dev
```

### Environment Variables
Requires a highly privileged `NEXTAUTH_SECRET` and access to the master Database connection string. Refer to `../../docs/ENVIRONMENT_VARIABLES.md` for specific keys.

## 🔗 Related Documentation
- [Project Structure](../../docs/PROJECT_STRUCTURE.md)
- [UI Component Library](../../docs/UI_COMPONENT_LIBRARY.md)
