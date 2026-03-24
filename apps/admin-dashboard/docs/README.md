# GateFlow Admin Dashboard

<div align="center">

**Global control center for the GateFlow ecosystem**

_Designed for superadmins to manage multi-tenant architecture and system health_

</div>

---

## Primary Objective

To provide an uncompromising, God-eye view of the entire GateFlow platform, allowing internal GateFlow staff to manage corporate clients, track macro-level analytics, and step in for high-level support operations.

---

## Key Features

| Feature                      | Description                                              |
| :--------------------------- | :------------------------------------------------------- |
| **Organization Management**  | Create, suspend, modify, and delete client organizations |
| **Global Usage & Analytics** | Aggregated charting of total scans and active portals    |
| **System Health Monitoring** | Live status tracking of backend services                 |
| **Audit Trails**             | Non-repudiable logs of superadmin actions                |
| **Hardware Provisioning**    | Registering new physical gate nodes                      |

---

## Tech Stack

| Layer              | Technology                       |
| :----------------- | :------------------------------- |
| **Framework**      | Next.js 14 (App Router)          |
| **Styling**        | Tailwind CSS + `@gate-access/ui` |
| **Components**     | Radix UI / Shadcn UI             |
| **Icons**          | Lucide React                     |
| **Authentication** | NextAuth.js (superadmin roles)   |

---

## Folder Structure

```
admin-dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/         # Superadmin login flows
│   │   ├── dashboard/      # Main authenticated layout
│   │   │   ├── organizations/ # Org management
│   │   │   ├── hardware/   # Gate registration
│   │   │   └── system/     # Health and audit
│   │   └── components/     # Admin-specific UI
│   ├── tailwind.config.ts
│   └── next.config.mjs
```

---

## Getting Started

```bash
# From root workspace
pnpm turbo dev --filter admin-dashboard

# Or locally
cd apps/admin-dashboard && pnpm dev
```

---

## Environment Variables

Requires privileged `NEXTAUTH_SECRET` and master Database connection string.

See [Environment Variables](../../docs/guides/ENVIRONMENT_VARIABLES.md).

---

## Related Documentation

| Document                                                   | Description     |
| :--------------------------------------------------------- | :-------------- |
| [Project Structure](../../docs/PROJECT_STRUCTURE.md)       | Monorepo layout |
| [UI Component Library](../../docs/UI_COMPONENT_LIBRARY.md) | Components      |
