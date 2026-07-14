# @gateflow/ui

Premium UI primitives for the GateFlow Design System. Built on top of **Radix UI**,
**Tailwind CSS**, and **Framer Motion**.

## Installation

```bash
npm install @gateflow/ui @gateflow/tokens @gateflow/theme \
  radix-ui-react-collapsible class-variance-authority clsx tailwind-merge
```

## Usage

### CSS

Import global styles:

```css
@import '@gateflow/ui/globals.css';
```

### Components

```tsx
import { Button, Badge, Card } from '@gateflow/ui';

function MyDashboard() {
  return (
    <Card className="p-8">
      <Button variant="primary">Click Me</Button>
      <Badge variant="success">Active</Badge>
    </Card>
  );
}
```

## Features

- **Radix Powered**: Accessible, unstyled primitives logic.
- **Tailwind Ready**: Utility-first styling with design system tokens.
- **RTL Built-in**: All components use logical properties for automatic mirroring.
- **Animation**: Micro-interactions powered by Framer Motion.
