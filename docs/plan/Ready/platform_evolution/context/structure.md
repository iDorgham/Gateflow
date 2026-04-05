# Structure — platform_evolution

## Primary apps & packages

| Area                      | Path                     | Notes                                     |
| ------------------------- | ------------------------ | ----------------------------------------- |
| Admin dashboard (primary) | `apps/admin-dashboard/`  | Main target. All 7 phases touch this.     |
| Marketing site (P5-P6)    | `apps/marketing/`        | Blog + Landing Page rendering via ISR     |
| Client dashboard (P4)     | `apps/client-dashboard/` | PostMessage listener for style preview    |
| Database                  | `packages/db/`           | Prisma schema + migrations                |
| Shared types              | `packages/types/`        | Enums, interfaces                         |
| UI components             | `packages/ui/`           | `@gate-access/ui` → future `@gateflow/ui` |
| Utilities                 | `packages/utils/`        | WCAG contrast checker (P4)                |

## Admin dashboard internal structure

```
apps/admin-dashboard/src/
├── app/
│   ├── api/
│   │   ├── organizations/[orgId]/       # Phase 1
│   │   ├── crm/                         # Phase 2
│   │   │   ├── leads/
│   │   │   └── deals/
│   │   ├── tasks/                       # Phase 3
│   │   │   ├── generate/
│   │   │   └── bots/
│   │   ├── branding/                    # Phase 4
│   │   │   ├── [orgId]/
│   │   │   └── upload/
│   │   ├── cms/                         # Phase 5-6
│   │   │   ├── pages/
│   │   │   ├── blog/
│   │   │   ├── generate-section/
│   │   │   └── generate-blog/
│   │   ├── support/                     # Phase 7
│   │   └── ops/                         # Phase 7
│   └── organizations/[orgId]/           # Phase 1 — nested routes
├── components/
│   ├── crm/                             # Phase 2
│   ├── tasks/                           # Phase 3
│   ├── theming/                         # Phase 4
│   ├── cms/                             # Phase 5-6
│   ├── support/                         # Phase 7
│   └── ops/                             # Phase 7
├── lib/
│   ├── task-bot-reactor.ts              # Phase 3
│   ├── branding-css-generator.ts        # Phase 4
│   ├── notifications.ts                 # Phase 3
│   └── ai-usage-tracker.ts             # Phase 7
└── middleware.ts                         # RBAC + org scoping
```

## Cross-app targets

| Module        | Source App        | Target App/Route                            |
| ------------- | ----------------- | ------------------------------------------- |
| Blog CMS      | `admin-dashboard` | `apps/marketing` → `/en/blog/[slug]`        |
| Landing Pages | `admin-dashboard` | `apps/marketing` → `/en/[slug]`             |
| Style Hub     | `admin-dashboard` | `apps/client-dashboard` → CSS var overrides |
| GateFlow CRM  | `admin-dashboard` | Internal DB only                            |
| Task Manager  | `admin-dashboard` | Internal DB only                            |
