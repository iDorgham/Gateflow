# @gateflow/components

Composed product patterns and high-level layouts for the GateFlow Design System.
Built on top of **@gateflow/ui** primitives.

## Installation

```bash
npm install @gateflow/components @gateflow/ui @gateflow/tokens @gateflow/theme
```

## Usage

### Compositions

```tsx
import { PageHeader, EntityCard, StatGrid } from '@gateflow/components';

function MyView() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Assets"
        subtitle="Manage your compound physical infrastructure"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Assets' }]}
      />

      <StatGrid
        stats={[
          { label: 'Total Assets', value: '1,234' },
          { label: 'Active Gates', value: '42' },
        ]}
      />
    </div>
  );
}
```

## Features

- **Pattern Composition**: High-level building blocks for rapid product development.
- **RTL Parity**: Automatic layout mirroring via logical properties.
- **Responsive**: Mobile-first designs for field devices and tablets.
- **MENA support**: RTL and Arabic context built-in.
