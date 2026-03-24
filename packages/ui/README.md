# @gate-access/ui

<div align="center">

**Shared React UI component library for GateFlow applications**

_Built with Radix UI primitives, Tailwind CSS, and shadcn/ui patterns_

[![Status](https://img.shields.io/badge/Status-Stable-success?style=for-the-badge)](#)
[![Components](https://img.shields.io/badge/Components-29-blue?style=for-the-badge)](#)
[![Style](https://img.shields.io/badge/Style-Tailwind-green?style=for-the-badge&logo=tailwindcss)](#)

</div>

---

## Overview

Shared React UI component library for GateFlow applications. Built with Radix UI primitives and Tailwind CSS, following shadcn/ui patterns with Atlassian Design System (ADS) tokens.

### Key Features

| Feature         | Description                                        |
| :-------------- | :------------------------------------------------- |
| **ADS Tokens**  | Atlassian Design System color, typography, spacing |
| **RTL Support** | Full Arabic/English bidirectional support          |
| **Dark Mode**   | System-preference detection with manual toggle     |
| **Accessible**  | WCAG 2.1 compliant with Radix primitives           |

---

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

---

## Components

### UI Primitives (26)

| Component        | Description                    |
| :--------------- | :----------------------------- |
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
| :------------------ | :------------------ |
| `LoginShell`        | Login page layout   |
| `SquaresBackground` | Animated background |

---

## Utilities

### cn (className utility)

```tsx
import { cn } from '@gate-access/ui';

<div className={cn('base-class', condition && 'conditional-class')} />;
```

---

## Design Tokens

Design tokens are exported from `./tokens`:

```tsx
import { tokens, breakpoints, spacing, colors } from '@gate-access/ui';
```

| Export        | Description                                       |
| :------------ | :------------------------------------------------ |
| `tokens`      | Color, typography, spacing, radius, shadow tokens |
| `breakpoints` | Responsive breakpoints                            |
| `spacing`     | Spacing scale                                     |
| `colors`      | Color palette                                     |

---

## Related Documentation

| Document                                                                  | Description        |
| :------------------------------------------------------------------------ | :----------------- |
| [UI Design Guide](../../docs/guides/UI_DESIGN_GUIDE.md)                   | ADS tokens and RTL |
| [Component Library Docs](../../docs/guides/UI_COMPONENT_LIBRARY.md)       | Component patterns |
| [Design Tokens Guide](../../docs/guides/UI_DESIGN_GUIDE.md#design-tokens) | Token reference    |
