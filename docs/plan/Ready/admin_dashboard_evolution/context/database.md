# Database — admin_dashboard_evolution

## Existing Models (already in `packages/db/prisma/schema.prisma`)

### Core

- `Organization` — Multi-tenant root; has `type` (REAL_ESTATE, HOSPITALITY, etc.), `logoUrl`, `brandingSnapshot`
- `User` — Scoped to `organizationId`; has `roleId`, `assignedTickets`, `supportMessages`
- `Role` — Has `permissions: Json` (RBAC); `isBuiltIn`, `organizationId` (null = global)
- `Project` — Scoped to `organizationId`; has `units`, `gates`
- `Gate` — Scoped to `organizationId`; has QR code relations

### CMS

- `LandingPage` — Already has: `content`, `slug`, `status`, `organizationId`
- `BlogPost` — Already has: `title`, `content`, `slug`, `status`, `organizationId`

### CRM

- `Lead` / `Deal` — On Organization (via relations)

### Support

- `SupportTicket` — Has `userId`, `organizationId`, `messages`, `status`
- `SupportMessage` — Belongs to `SupportTicket`

### Tasks

- `Task` — Has `linkedType` (polymorphic: BLOG | LANDING_PAGE | CRM), `linkedId`, `assigneeId`

### Audit

- `AuditLog` — Has `action`, `userId`, `resourceType`, `resourceId`, `organizationId`, `metadata: Json`

## Required Schema Additions (by phase)

### Phase 2 — CMS Settings

```prisma
model CmsSiteSettings {
  id           String  @id @default(cuid())
  orgId        String? // null = global admin settings
  seoTitle     String?
  seoDesc      String?
  headerScripts String?
  cspPolicy    String?
  cacheMaxAge  Int     @default(3600)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Phase 5 — Menu Builder

```prisma
model MenuItem {
  id         String     @id @default(cuid())
  menuId     String
  label      String
  labelAr    String?
  href       String?
  parentId   String?
  order      Int        @default(0)
  isExternal Boolean    @default(false)
  parent     MenuItem?  @relation("MenuNested", fields: [parentId], references: [id])
  children   MenuItem[] @relation("MenuNested")
  menu       Menu       @relation(fields: [menuId], references: [id])
  createdAt  DateTime   @default(now())
}

model Menu {
  id             String     @id @default(cuid())
  name           String
  organizationId String?
  location       String     // HEADER | FOOTER | SIDEBAR
  items          MenuItem[]
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
}
```

### Phase 7 — AI Task Bots

```prisma
model AiTaskBot {
  id             String   @id @default(cuid())
  name           String
  type           String   // BLOG_WRITER | LP_WRITER | SOCIAL_POSTER
  organizationId String
  schedule       String?  // cron expression
  config         Json     // { topic, tone, length, outputType }
  isActive       Boolean  @default(true)
  lastRunAt      DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

### Phase 4 — LandingPage Enhancements

```prisma
// Add fields to existing LandingPage model:
// + publishedAt   DateTime?
// + version       Int       @default(1)
// + aiGenerated   Boolean   @default(false)
// + aiConfirmedAt DateTime?
// + aiConfirmedBy String?
```

### Phase 6 — BlogPost Enhancements

```prisma
// Add fields to existing BlogPost model:
// + publishedAt         DateTime?
// + aiTopicSuggestion   String?
// + aiDraftContent      String?
// + aiGenerated         Boolean  @default(false)
// + aiConfirmedAt       DateTime?
// + aiConfirmedBy       String?
```

## Key Relations Summary

```
Organization
  ├── User[]         (multi-tenant users)
  ├── Project[]      → Gate[]
  ├── LandingPage[]  (CMS)
  ├── BlogPost[]     (CMS)
  ├── Lead[] / Deal[] (CRM)
  ├── SupportTicket[] (Support)
  └── AuditLog[]     (Audit trail)
```
