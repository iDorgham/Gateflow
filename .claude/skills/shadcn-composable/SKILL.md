---
name: gf-shadcn-composable-patterns
description: Patterns for building complex, composite UI widgets (Drawers, Comboboxes, Multi-step Forms) in GateFlow.
---

# Shadcn Composable Patterns

## Purpose
Guide the creation of complex UI patterns that involve multiple Shadcn primitives (e.g., a "Resident Multi-Select" that is a Popover + Command + Checkbox). Ensures these remain readable and maintainable.

## Core Principles
1. **Atomic Composition**: Build large widgets from smaller, tested Shadcn primitives.
2. **Prop Drilling Prevention**: Use Context where appropriate for deeply nested UI states (e.g., complex forms).
3. **Behavior Consistency**: All complex widgets must follow ADS interactions (e.g., Esc to close, Enter to select).

## Implementation Rules
- **The "Combobox" Pattern**: Use for all searchable dropdowns (Organization Selector, Gate Selector).
- **The "Drawer" Pattern**: Use for mobile-first forms (Skill 14) and high-density details (Skill 2).
- **The "Stateful Feedback" Pattern**: Ensure every transaction (QR creation) uses a `Toast` or `InlineRecord` feedback.
- **Responsive Handling**: Complex widgets must switch from `Dialog` (Desktop) to `Drawer` (Mobile) automatically.

## Anti-Patterns
- Giant single files (over 300 lines) for a single UI widget. Break into sub-components.
- Ad-hoc state management (e.g., passing 10 props instead of using a `useFormContext`).
- Breaking screen reader accessibility by nesting `aria-hidden` elements incorrectly.

## Code Example
```tsx
// Composable Searchable Selector
export const ResourceSelector = ({ items, onSelect }: { items: any[], onSelect: (id: string) => void }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="subtle" className="w-[200px] justify-between">
          <span>Select...</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No result found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem key={item.id} onSelect={() => onSelect(item.id)}>
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
```
