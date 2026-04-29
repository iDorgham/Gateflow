# PROMPT_admin_dashboard_evolution_phase_1.md

**Phase:** 1  
**Plan:** Admin Dashboard Evolution  
**Focus:** Side Menu Reorganization & Organizations Rebuild (Nested Users, Projects, Gates)  
**Type:** Frontend / Backend

---

## Overview

Phase 1 establishes the foundational routing and navigation structure for the Admin Dashboard. This phase reorganizes the sidebar into a logical grouping and implements clean nested routing for Organizations with Users, Projects, and Gates fully contained inside each organization.

**Critical Dependency:** This phase must be completed before all subsequent phases (2-9) can begin, as it establishes the routing architecture that every other feature depends on.

---

## Objectives

1. **Redesign Sidebar Navigation** — Restructure into Platform, CMS, Intelligence, Operations, Governance groups
2. **Implement Nested Organization Routing** — `/organizations/[orgId]/users`, `/organizations/[orgId]/projects`, `/organizations/[orgId]/gates`
3. **Create Organization Context Provider** — Persist orgId across all nested routes
4. **Build Smart Org Switcher** — Dropdown in header to switch between organizations with persistence

---

## Current State Analysis

### Existing Sidebar Structure (Sidebar.tsx)

```tsx
// Current nav groups
Management: Overview, Organizations, Users, Task Hub, Projects, Gates, Style Hub
Intelligence: Analytics, Lead Intel (CRM), Scans, Audit Logs
Infrastructure: Ops Hub, Emulation, Seeding
Governance: Monitoring, Auth Keys, Settings, Admins
```

### Target Sidebar Structure

```
Platform:
  ├── Dashboard (/)
  └── Organizations (/organizations → redirects to context org)

CMS:
  ├── Pages (/cms/pages)
  ├── Landing Pages (/cms/landing-pages)
  ├── Blog (/cms/blog)
  ├── Menus (/cms/menus)
  └── Settings (/cms/settings)

Intelligence:
  ├── Analytics (/analytics/dashboard)
  ├── CRM (/crm/contacts)
  └── Scans (/organizations/[orgId]/scans)

Operations:
  ├── Task Hub (/organizations/[orgId]/tasks)
  ├── Projects (/organizations/[orgId]/projects)
  └── Gates (/organizations/[orgId]/gates)

Governance:
  ├── Monitoring (/organizations/[orgId]/monitoring)
  ├── Auth Keys (/organizations/[orgId]/authorization-keys)
  ├── Team Roles (/team-roles)
  └── Settings (/organizations/[orgId]/settings)
```

### Existing Route Structure

```
/organizations → global list
/organizations/[orgId] → org home
/organizations/[orgId]/users → org users (currently nested)
/organizations/[orgId]/projects → org projects (currently nested)
/organizations/[orgId]/gates → org gates (currently nested)
```

---

## Implementation Steps

### Step 1: Create New Sidebar Component

**File:** `apps/admin-dashboard/src/components/admin-sidebar.tsx`

**Requirements:**

- Use existing `@gate-access/ui` components: `SideNavigationShell`, `SideNavItem`, `NavGroup`
- Support RTL via `i18n.language === 'ar-EG'`
- Collapsible sidebar with chevron toggle
- Org context displayed in header area

**Navigation Groups:**

```tsx
const navGroups = [
  {
    label: 'Platform',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/organizations', label: 'Organizations', icon: Building2 },
    ],
  },
  {
    label: 'CMS',
    items: [
      { href: '/cms/pages', label: 'Pages', icon: FileText },
      { href: '/cms/landing-pages', label: 'Landing Pages', icon: Rocket },
      { href: '/cms/blog', label: 'Blog', icon: BookOpen },
      { href: '/cms/menus', label: 'Menus', icon: Menu },
      { href: '/cms/settings', label: 'Settings', icon: Settings },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { href: '/analytics/dashboard', label: 'Analytics', icon: BarChart3 },
      { href: '/crm/contacts', label: 'CRM', icon: Users },
      { href: '/scans', label: 'Scans', icon: ScanLine },
    ],
  },
  {
    label: 'Operations',
    items: [
      {
        href: '/organizations/{orgId}/tasks',
        label: 'Task Hub',
        icon: Columns3,
      },
      {
        href: '/organizations/{orgId}/projects',
        label: 'Projects',
        icon: FolderOpen,
      },
      { href: '/organizations/{orgId}/gates', label: 'Gates', icon: DoorOpen },
    ],
  },
  {
    label: 'Governance',
    items: [
      {
        href: '/organizations/{orgId}/monitoring',
        label: 'Monitoring',
        icon: Activity,
      },
      {
        href: '/organizations/{orgId}/authorization-keys',
        label: 'Auth Keys',
        icon: KeyRound,
      },
      { href: '/team-roles', label: 'Team Roles', icon: Shield },
      {
        href: '/organizations/{orgId}/settings',
        label: 'Settings',
        icon: Settings,
      },
    ],
  },
];
```

**Notes:**

- Operations and Governance sections require `orgId` context — use `{orgId}` placeholder that gets resolved at runtime
- CMS, Analytics, and CRM are global (no org context needed)
- Use ADS tokens for all styling

### Step 2: Update Layout to Use New Sidebar

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/layout.tsx`

**Requirements:**

- Replace `Sidebar` import with `AdminSidebar`
- Ensure RTL support via `dir={i18n.language === 'ar-EG' ? 'rtl' : 'ltr'}`
- Maintain authentication check

### Step 3: Update Organization Context Provider

**File:** `apps/admin-dashboard/src/providers/organization-provider.tsx`

**Requirements:**

- Add `setOrgId` function to switch organizations
- Persist selected orgId to localStorage with key `gateflow_selected_org`
- On mount, check localStorage for previous selection
- If no org selected, redirect to `/organizations` to pick one

```tsx
// Expanded provider
interface OrganizationContextType {
  orgId: string | null;
  org: Organization | null;
  setOrgId: (id: string) => void;
  isLoading: boolean;
}

export function useOrganization() {
  // ... existing implementation
  // Add:
  // const setOrgId = useCallback((id: string) => {
  //   localStorage.setItem('gateflow_selected_org', id);
  //   setOrg(id);
  // }, []);
}
```

### Step 4: Create Org Switcher Component

**File:** `apps/admin-dashboard/src/components/organizations/org-switcher.tsx`

**Requirements:**

- Dropdown showing all accessible organizations
- Search/filter functionality
- Current org highlighted
- Quick link to `/organizations` for full management

**UI Pattern:**

- Avatar: Org initial or logo
- Label: Org name
- Sublabel: Org type (REAL_ESTATE, HOSPITALITY, etc.)
- Checkmark for selected

### Step 5: Create Organization Layout with Nested Routes

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/organizations/[orgId]/layout.tsx`

```tsx
export default function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgId: string };
}) {
  // Set org context on mount
  // Render nested nav for Users, Projects, Gates, Tasks, Settings
  return (
    <OrganizationProvider orgId={params.orgId}>
      <div className="flex gap-6">
        <OrgNestedNav orgId={params.orgId} />
        <div className="flex-1">{children}</div>
      </div>
    </OrganizationProvider>
  );
}
```

### Step 6: Create Org Nested Navigation Component

**File:** `apps/admin-dashboard/src/components/organizations/org-nested-nav.tsx`

**Requirements:**

- Vertical nav showing: Dashboard, Users, Projects, Gates, Tasks, Monitoring, Settings, Branding
- Active state highlighting
- Collapsible for more compact view

### Step 7: Update Existing Nested Pages to Use Context

**Files to update:**

- `apps/admin-dashboard/src/app/[locale]/(dashboard)/organizations/[orgId]/users/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/organizations/[orgId]/projects/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/organizations/[orgId]/gates/page.tsx`

**Pattern:**

```tsx
export default function OrgUsersPage() {
  const { orgId } = useOrganization(); // Get from context instead of params
  // Fetch users scoped to orgId
}
```

### Step 8: Create Global CMS Routes (Skeleton)

**Files to create:**

- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/layout.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/pages/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/landing-pages/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/blog/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/menus/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/settings/page.tsx`

**Requirements:**

- Simple placeholder pages with "Coming Soon" or basic shell
- Phase 1 only creates route structure, content comes in later phases

### Step 9: Create Global CRM Routes (Skeleton)

**Files to create:**

- `apps/admin-dashboard/src/app/[locale]/(dashboard)/crm/layout.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/crm/contacts/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/crm/companies/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/crm/deals/page.tsx`

### Step 10: Create Analytics Dashboard Route (Skeleton)

**Files to create:**

- `apps/admin-dashboard/src/app/[locale]/(dashboard)/analytics/layout.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/analytics/dashboard/page.tsx`

### Step 11: Create Team Roles Route (Skeleton)

**Files to create:**

- `apps/admin-dashboard/src/app/[locale]/(dashboard)/team-roles/page.tsx`

---

## API Requirements

### Organization List API

**Endpoint:** `GET /api/admin/organizations`

**Response:**

```json
{
  "organizations": [
    {
      "id": "org_xxx",
      "name": "Al Rimal Compound",
      "type": "REAL_ESTATE",
      "plan": "ENTERPRISE"
    }
  ]
}
```

### Organization Context API

**Endpoint:** `GET /api/admin/organizations/[orgId]`

**Response:**

```json
{
  "organization": {
    "id": "org_xxx",
    "name": "Al Rimal Compound",
    "type": "REAL_ESTATE",
    "plan": "ENTERPRISE",
    "logoUrl": "..."
  }
}
```

---

## Design System Enforcement (ADS)

All new components MUST use ADS tokens:

```tsx
// ✅ CORRECT
import { token } from '@atlaskit/tokens';
<div style={{
  backgroundColor: token('ds.background.neutral'),
  color: token('ds.text'),
  padding: token('ds.space.300')
}}>

// ❌ WRONG
<div className="bg-gray-100 p-4">
```

**Required Token Usage:**

- Backgrounds: `ds.background.default`, `ds.background.neutral`, `ds.background.brand.bold`
- Text: `ds.text`, `ds.text.subtle`, `ds.text.subtler`
- Borders: `ds.border`, `ds.border.neutral`
- Spacing: `ds.space.100` through `ds.space.500`
- Icons: `ds.icon`, `ds.icon.subtle`

---

## Security Requirements

1. **Authentication:** All routes require valid session cookie
2. **Authorization:** Check user has access to selected organization
3. **Audit Logging:** Log org context switches
4. **Input Validation:** Validate `orgId` is valid CUID format

---

## Multi-Language (EN + AR RTL)

All labels must use translation keys:

```tsx
const { t } = useTranslation();
// In nav groups
label: t('admin:nav.platform', 'Platform'),
label: t('admin:nav.cms', 'CMS'),
label: t('admin:nav.cms_pages', 'Pages'),
```

**RTL Requirements:**

- Sidebar collapse chevron direction based on locale
- Nav item alignment (margin-inline-start vs margin-inline-end)
- Icon positioning respects RTL

---

## Acceptance Criteria

### Sidebar Navigation

- [ ] New sidebar renders with Platform, CMS, Intelligence, Operations, Governance groups
- [ ] CMS, Analytics, CRM links work without org context
- [ ] Operations/Gov links resolve `{orgId}` correctly when org selected
- [ ] Collapsible with smooth animation
- [ ] RTL-aware chevron direction

### Organization Context

- [ ] `useOrganization()` provides `orgId`, `setOrgId`
- [ ] Selecting org persists to localStorage
- [ ] On page refresh, previous org is restored
- [ ] If no org selected, user redirected to /organizations

### Nested Routing

- [ ] `/organizations/[orgId]` shows org dashboard
- [ ] `/organizations/[orgId]/users` shows org users
- [ ] `/organizations/[orgId]/projects` shows org projects
- [ ] `/organizations/[orgId]/gates` shows org gates
- [ ] Org nested nav visible on all `/organizations/[orgId]/*` routes

### Route Shells

- [ ] `/cms/*` routes exist with placeholder content
- [ ] `/crm/*` routes exist with placeholder content
- [ ] `/analytics/dashboard` exists with placeholder content
- [ ] `/team-roles` exists with placeholder content

### Preflight

- [ ] `pnpm preflight` passes on `admin-dashboard`
- [ ] No TypeScript errors
- [ ] No linting errors

---

## File Inventory

### New Files to Create

- `apps/admin-dashboard/src/components/admin-sidebar.tsx`
- `apps/admin-dashboard/src/components/organizations/org-nested-nav.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/organizations/[orgId]/layout.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/layout.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/pages/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/landing-pages/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/blog/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/menus/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/settings/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/crm/layout.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/crm/contacts/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/crm/companies/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/crm/deals/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/analytics/layout.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/analytics/dashboard/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/team-roles/page.tsx`

### Files to Modify

- `apps/admin-dashboard/src/components/Sidebar.tsx` → rename to `legacy-sidebar.tsx` or remove
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/layout.tsx` → import new sidebar
- `apps/admin-dashboard/src/providers/organization-provider.tsx` → add setOrgId
- `apps/admin-dashboard/src/components/organizations/org-switcher.tsx` → enhance
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/organizations/[orgId]/users/page.tsx` → use context
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/organizations/[orgId]/projects/page.tsx` → use context
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/organizations/[orgId]/gates/page.tsx` → use context

---

## Estimated Effort

**Complexity:** Medium  
**Files:** ~20  
**Key Challenge:** Maintaining backward compatibility while restructuring routing

---

## Next Phase

**Phase 2: CMS Section Shell + Settings for www.gateflow.site**

This phase creates the CMS route shell with placeholder pages and implements Settings for www.gateflow.site (SEO, Header Tags, Security, Performance, Cache).
