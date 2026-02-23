# GateFlow Client Dashboard

The `client-dashboard` is the B2B portal designed for our direct customers (e.g., Property Management Companies, HOA Boards, Corporate Campuses). Here, organization administrators manage their localized GateFlow deployment.

## 🎯 Primary Objective
To empower organizations to be self-sufficient in managing their physical security. Clients use this application to map out their properties, invite residents/employees, define gate access rules, and review localized security logs.

## ✨ Key Features
- **Project & Property Hierarchy**: Group management. A company can oversee multiple housing projects or office locations from a unified switchboard.
- **Access Rule Engine**: Create granular restrictions. E.g., "Contractor gates close at 8 PM," "Visitor passes expire after 24 hours."
- **User Delegation**: Invite staff (Security Managers, Front Desk) and Residents/Employees.
- **Live Monitor**: Watch real-time scan logs hitting the specific organization's gates.
- **Billing & Quotas**: Track API usage, SMS notifications sent, and active resident count against their subscribed Stripe tier.

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + `@gate-access/ui` shared tokens
- **Components**: Radix UI primitives / Shadcn UI
- **Icons**: Lucide React
- **Data Fetching & State**: React Query / Server Actions

## 📁 Folder Structure
```text
client-dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/         # Organization login
│   │   ├── dashboard/      # Main authenticated layout
│   │   │   ├── projects/   # Property & project definitions
│   │   │   ├── users/      # Resident and staff directories
│   │   │   ├── access/     # Rule building and gate policies
│   │   │   ├── logs/       # Historical scan search
│   │   │   ├── settings/   # Billing and org profile
│   │   └── globals.css     # Injects global UI tokens
│   └── components/         # Client-specific UI workflows
├── tailwind.config.ts      # Extended from packages/config
└── next.config.mjs
```

## 🚀 Getting Started

### Local Development
Run from the root workspace:
```bash
pnpm turbo dev --filter client-dashboard
```

### Environment Variables
This application handles user invitations and notifications. It requires API keys for email routing (e.g., Resend) and Stripe customer portals. See `../../docs/ENVIRONMENT_VARIABLES.md`.

## 🔗 Related Documentation
- [Project Structure](../../docs/PROJECT_STRUCTURE.md)
- [Security Overview](../../docs/SECURITY_OVERVIEW.md)
