# @gateflow/components

Composed UI patterns for the GateFlow design system.

Built exclusively from `@gateflow/ui` primitives and `@gateflow/tokens`.

## Philosophy

- **`@gateflow/ui`**: Atomic, primitive, stateless, headless-friendly (e.g. Button, Input, Card).
- **`@gateflow/components`**: Composed, domain-aware (UI-wise), high-level patterns (e.g. PageHeader, FilterBar, StatGrid).

## Installation

```bash
pnpm add @gateflow/components
```

## Available Compositions

### PageHeader

Standard page heading with breadcrumbs, title, subtitle, and an actions area.

```tsx
import { PageHeader } from '@gateflow/components';

<PageHeader
  title="Projects"
  subtitle="Manage your community projects and tracking."
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Projects' },
  ]}
  actions={<Button>Add Project</Button>}
/>;
```

### EntityCard

A rich card for displaying entities (Users, Projects, Organizations) with an icon and metadata grid.

```tsx
import { EntityCard } from '@gateflow/components';
import { User } from 'lucide-react';

<EntityCard
  title="John Doe"
  subtitle="Senior Product Manager"
  status="Active"
  statusVariant="success"
  icon={User}
  meta={[
    { label: 'Role', value: 'Admin' },
    { label: 'Joined', value: 'Jan 2024' },
  ]}
/>;
```

### FilterBar

A standard search and filter bar for data-heavy views.

```tsx
import { FilterBar } from '@gateflow/components';

<FilterBar
  placeholder="Search users..."
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  filters={<DropdownMenu>...</DropdownMenu>}
/>;
```

### StatGrid

Responsive grid for displaying key performance indicators (KPIs) with trend indicators.

```tsx
import { StatGrid } from '@gateflow/components';

<StatGrid
  stats={[
    {
      label: 'Total Scans',
      value: '45,231',
      trend: { value: '+12%', direction: 'up' },
    },
    { label: 'Uptime', value: '99.9%', variant: 'success' },
  ]}
/>;
```

## Motion Policy

All components use **CSS / Tailwind** motion for transitions and hovers. No external motion libraries required.
