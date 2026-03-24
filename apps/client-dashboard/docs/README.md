# GateFlow Client Dashboard

<div align="center">

**B2B portal for Property Management Companies**

_Empowering organizations to be self-sufficient in managing physical security_

</div>

---

## Primary Objective

To empower organizations to be self-sufficient in managing their physical security. Clients use this application to map out their properties, invite residents/employees, define gate access rules, and review localized security logs.

---

## Key Features

| Feature                          | Description                                    |
| :------------------------------- | :--------------------------------------------- |
| **Project & Property Hierarchy** | Group management for multiple housing projects |
| **Access Rule Engine**           | Granular restrictions and time-based gates     |
| **User Delegation**              | Invite staff, residents, and employees         |
| **Live Monitor**                 | Watch real-time scan logs                      |
| **Billing & Quotas**             | Track usage against Stripe tier                |

---

## Tech Stack

| Layer             | Technology                       |
| :---------------- | :------------------------------- |
| **Framework**     | Next.js 14 (App Router)          |
| **Styling**       | Tailwind CSS + `@gate-access/ui` |
| **Components**    | Radix UI / Shadcn UI             |
| **Icons**         | Lucide React                     |
| **Data Fetching** | React Query / Server Actions     |

---

## Folder Structure

```
client-dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/         # Organization login
│   │   ├── dashboard/      # Main authenticated layout
│   │   │   ├── projects/   # Property definitions
│   │   │   ├── users/      # Directories
│   │   │   ├── access/     # Rule building
│   │   │   ├── logs/       # Scan history
│   │   │   └── settings/   # Billing and profile
│   │   └── components/     # Client-specific UI
│   ├── tailwind.config.ts
│   └── next.config.mjs
```

---

## Getting Started

```bash
# From root workspace
pnpm turbo dev --filter client-dashboard
```

---

## Environment Variables

Requires API keys for email (Resend) and Stripe customer portals.

See [Environment Variables](../../docs/guides/ENVIRONMENT_VARIABLES.md).

---

## Related Documentation

| Document                                             | Description           |
| :--------------------------------------------------- | :-------------------- |
| [Project Structure](../../docs/PROJECT_STRUCTURE.md) | Monorepo layout       |
| [Security Overview](../../docs/SECURITY_OVERVIEW.md) | Security architecture |
