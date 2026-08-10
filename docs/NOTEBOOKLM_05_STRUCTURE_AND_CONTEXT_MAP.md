# NOTEBOOKLM SOURCE 5: GateFlow Project Structure, File Layout & AI Context Reference Map

## 1. Top-Level Repository Directory Layout

```text
Gate-Access/
├── apps/                        # Application sub-projects
│   ├── admin-dashboard/         # Super-admin control plane (Next.js 15)
│   ├── client-dashboard/        # Tenant/property management console (Next.js 15)
│   ├── design-system/           # Storybook / component catalog
│   ├── marketing/               # Public landing pages & marketing site (Next.js 15)
│   ├── resident-mobile/         # Native resident app (React Native / Expo SDK 57)
│   ├── resident-portal/         # Resident web/PWA app (Next.js 15)
│   └── scanner-app/             # Gate guard scanner app (React Native / Expo SDK 57)
├── packages/                    # Shared workspace libraries & code
│   ├── api-client/              # Typed API HTTP wrappers
│   ├── config/                  # Shared tsconfig, tailwind, eslint configs
│   ├── db/                      # Prisma ORM schema, migrations, connection pools
│   ├── i18n/                    # English & Arabic translation dictionaries
│   ├── types/                   # Shared TypeScript models and contracts
│   ├── ui/                      # GateFlow design system React components
│   └── utils/                   # Shared HMAC signatures & utility functions
├── docs/                        # Complete project documentation hub
│   ├── INDEX.md                 # Master documentation index
│   ├── NOTEBOOKLM_*.md          # Dedicated NotebookLM AI context sources
│   ├── audits/                  # Security audits and certification evidence
│   ├── development/             # Guidelines, workflow rules, initiative ideas
│   ├── guides/                  # Technical & operational reference guides
│   ├── plan/                    # Phased plans (Draft, Ready, Active, Complete)
│   └── reference/               # Full system, PRD, and app reference specifications
└── scripts/                     # Automation, sync, and preflight scripts
```

---

## 2. Key AI & Context Reference Map

For detailed context retrieval across AI tooling, the following reference documents provide deep technical mapping:

- `docs/reference/product/PRD.md`: Canonical Master Product Requirements Document.
- `docs/reference/architecture/ARCHITECTURE.md`: Technical architecture and system invariants.
- `docs/reference/apps/GATEFLOW_COMPLETE_CONTEXT_REFERENCE.md`: Complete monolithic context pack summarizing all surfaces.
- `docs/reference/apps/DATABASE_BACKEND_AND_TECH_REFERENCE.md`: Deep database model and backend service specifications.
- `docs/reference/apps/API_GATEWAY_AND_CONTRACTS_REFERENCE.md`: Complete API route index and payload contracts.
