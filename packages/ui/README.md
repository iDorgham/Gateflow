# @gate-access/ui

<p align="center">
  <img src="https://img.shields.io/badge/Status-Stable-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Components-29-blue" alt="Components">
  <img src="https://img.shields.io/badge/Style-Tailwind-green" alt="Style">
</p>

Shared React UI component library for GateFlow applications. Built with Radix UI primitives and Tailwind CSS, following shadcn/ui patterns.

## Installation

```bash
# Auto-installed by pnpm workspace
# No manual installation needed
```

## Usage

```tsx
import { Button, Card, Input, Badge } from '@gate-access/ui';
import { cn } from '@gate-access/ui';

function MyComponent() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Title</Card.Title>
        <Card.Description>Description</Card.Description>
      </Card.Header>
      <Card.Content>
        <Input placeholder="Enter text" />
      </Card.Content>
      <Card.Footer>
        <Button>Submit</Button>
        <Badge variant="secondary">New</Badge>
      </Card.Footer>
    </Card>
  );
}
```

## Components

### UI Primitives (26)

| Component        | Description                    |
| ---------------- | ------------------------------ |
| `Button`         | Clickable button with variants |
| `Input`          | Text input field               |
| `Textarea`       | Multi-line text input          |
| `Label`          | Form label                     |
| `Checkbox`       | Checkbox control               |
| `Select`         | Dropdown select                |
| `RadioGroup`     | Radio button group             |
| `Switch`         | Toggle switch                  |
| `Popover`        | Popover content                |
| `Command`        | Command palette                |
| `MultiSelect`    | Multi-select dropdown          |
| `Dialog`         | Modal dialog                   |
| `Sheet`          | Slide-out panel                |
| `Drawer`         | Drawer (alias for Sheet)       |
| `DropdownMenu`   | Dropdown menu                  |
| `Tabs`           | Tabbed content                 |
| `Avatar`         | User avatar                    |
| `Badge`          | Status badge                   |
| `Card`           | Content card container         |
| `Table`          | Data table                     |
| `Separator`      | Visual separator               |
| `Skeleton`       | Loading placeholder            |
| `LoadingSpinner` | Loading indicator              |
| `EmptyState`     | Empty content state            |
| `Toast`          | Notification toast             |
| `ScrollArea`     | Scrollable area                |
| `Collapsible`    | Collapsible content            |
| `Form`           | Form wrapper                   |
| `Tooltip`        | Tooltip popup                  |
| `Icon`           | Icon component                 |

### Auth Components (2)

| Component           | Description         |
| ------------------- | ------------------- |
| `LoginShell`        | Login page layout   |
| `SquaresBackground` | Animated background |

## Utilities

### cn (className utility)

```tsx
import { cn } from '@gate-access/ui';

<div className={cn('base-class', condition && 'conditional-class')} />;
```

## Design Tokens

Design tokens are exported from `./tokens`:

```tsx
import { tokens, breakpoints, spacing, colors } from '@gate-access/ui';
```

Tokens include:

- `tokens` — Color, typography, spacing, radius, shadow tokens
- `breakpoints` — Responsive breakpoints
- `spacing` — Spacing scale
- `colors` — Color palette

## Dependencies

- `react` — React library
- `react-dom` — React DOM
- `@radix-ui/react-*` — Radix UI primitives
- `tailwind-merge` — Tailwind class merging
- `clsx` — Class name utility
- `lucide-react` — Icons
- `class-variance-authority` — Component variants

## Related Documentation

- [UI Design Guide](../../docs/guides/UI_DESIGN_GUIDE.md)
- [Design Tokens](../../docs/guides/UI_DESIGN_GUIDE.md#design-tokens)
- [Component Library Docs](../../docs/UI_COMPONENT_LIBRARY.md)
