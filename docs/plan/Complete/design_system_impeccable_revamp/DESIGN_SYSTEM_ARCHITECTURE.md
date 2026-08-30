# GateFlow Design System Architecture Specification

**Document:** `DESIGN_SYSTEM_ARCHITECTURE.md`  
**Initiative:** `design_system_impeccable_revamp`  
**Version:** 7.0 (Master Architecture Reference)  
**Package:** `@gateflow/ui` (`packages/ui`), `@gateflow/tokens` (`packages/tokens`)  

---

## 1. Three-Tier Token Architecture & Dependency Flow

GateFlow uses a strict 3-tier token hierarchy inspired by IBM Carbon and W3C Design Token Community Group (DTCG) standards:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Tier 1: Primitive Tokens (packages/tokens/foundations/)                      │
│ - Raw OKLCH color palettes (oklch(62% 0.22 35), oklch(12% 0.015 250))      │
│ - 4px base spacing grid (0, 4, 8, 12, 16, 24, 32, 40, 48, 64px)             │
│ - Base font families (Inter, Outfit, Cairo, Tajawal, JetBrains Mono)        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ (Aliased by intent)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Tier 2: Semantic Tokens (packages/tokens/semantic/)                         │
│ - Theme-dependent surface layers: layer-01, layer-02, layer-03, layer-04    │
│ - Functional text colors: text-primary, text-subtle, text-subtlest          │
│ - Functional borders: border-subtle, border-bold, border-focused            │
│ - Density profiles: compact (36px controls), comfortable (48px controls)    │
│ - Status tokens: success, warning, danger, info, ai-lab                     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ (Mapped to elements)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Tier 3: Component Tokens (packages/tokens/component/)                       │
│ - Thin, optional element bindings: button-primary-bg, table-header-bg       │
│ - Card edge glow: --ds-glow-subtle, --ds-glow-focused                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Invariant Rules
1. **Unidirectional Dependency**: `Component` → `Semantic` → `Primitive`. Components may **never** reference Primitive tokens directly.
2. **Theme Remapping**: Light and Dark modes only remap Tier 2 (Semantic). Tier 1 remains immutable.
3. **No Raw Hex Values in Applications**: All consumer apps must use CSS variables (`var(--ds-*)`) or typed `nativeTokens` for React Native / Expo.

---

## 2. Dual-Mode Surface Physics & Rim-Light Shaders

### 2.1 Dark Mode Satin-Charcoal Elevation Hierarchy
Instead of flat pure black (`#000`), Dark Mode uses perceptually uniform OKLCH satin-charcoal surfaces with progressive luminance tiers:

| Token | OKLCH Value | Hex Approx | Optical Depth & Role |
| :--- | :--- | :--- | :--- |
| **`layer-01`** | `oklch(8% 0.012 250)` | `#0b0d11` | Canvas base, gutter, sunken page backgrounds |
| **`layer-02`** | `oklch(12% 0.015 250)` | `#12151c` | Default card surfaces, data tables, list containers |
| **`layer-03`** | `oklch(16% 0.018 250)` | `#191d26` | Raised floating cards, headers, interactive toolbars |
| **`layer-04`** | `oklch(20% 0.020 250)` | `#212633` | Overlays, popovers, modal dialogs, slide-over sheets |

### 2.2 Rim-Light Border Shaders
To achieve physical edge definition in dark mode without harsh contrast, cards utilize procedural rim-light border gradients:
```css
/* Dark Mode Subtle Rim-Light */
.ds-card-glow {
  border: 1px solid var(--ds-border-subtle);
  background: var(--ds-layer-02);
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.03) inset,
    0 2px 8px -2px rgba(0, 0, 0, 0.5);
  transition: border-color 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.ds-card-glow:hover {
  border-color: var(--ds-border-bold);
  box-shadow: 
    0 0 0 1px rgba(237, 75, 0, 0.15) inset,
    0 8px 24px -4px rgba(0, 0, 0, 0.6),
    0 0 16px -2px rgba(237, 75, 0, 0.12);
}
```

---

## 3. Composable `FormField` Specification

All form inputs in GateFlow must be wrapped in the composable `<FormField>` pattern:

### 3.1 API Schema
```tsx
interface FormFieldProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  id?: string;
  children: React.ReactElement;
}
```

### 3.2 Anatomy & Rendering Logic
```tsx
export function FormField({
  label,
  helperText,
  errorMessage,
  isRequired,
  isInvalid,
  isDisabled,
  id: explicitId,
  children,
}: FormFieldProps) {
  const generatedId = React.useId();
  const id = explicitId || generatedId;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <div className={cn("flex flex-col gap-1.5", isDisabled && "opacity-50 pointer-events-none")}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--ds-text-primary)] flex items-center gap-1">
          {label}
          {isRequired && <span className="text-[var(--ds-color-danger)]" aria-hidden="true">*</span>}
        </label>
      )}

      {React.cloneElement(children, {
        id,
        "aria-invalid": isInvalid ? true : undefined,
        "aria-describedby": isInvalid ? errorId : helperText ? helperId : undefined,
        disabled: isDisabled,
      })}

      {isInvalid && errorMessage ? (
        <p id={errorId} className="text-xs text-[var(--ds-color-danger)] font-medium flex items-center gap-1 animate-shake">
          <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-[var(--ds-text-subtle)]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
```

---

## 4. DynamicTable Adaptive Responsive Algorithm

### 4.1 Viewport Breakpoint Logic
`DynamicTable` monitors container width using `ResizeObserver` (or CSS container queries) with a threshold of **768px**:
- **Desktop Mode ($\ge 768\text{px}$)**: Renders semantic HTML table (`<table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>`) with sticky headers, column sorting indicators, checkbox row selection, and density toggles.
- **Mobile Mode ($< 768\text{px}$)**: Automatically transforms dataset into an accessible vertical stacked list of `<Card>` components.

```tsx
export function DynamicTable<T>({ data, columns, keyExtractor, onRowClick }: DynamicTableProps<T>) {
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-[var(--ds-radius-lg)] border border-[var(--ds-border-subtle)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--ds-layer-01)] border-b border-[var(--ds-border-subtle)] sticky top-0 backdrop-blur-md">
            <tr>{columns.map(c => <th key={c.id} className="px-4 py-3 font-semibold">{c.header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[var(--ds-border-subtle)]">
            {data.map(item => (
              <tr key={keyExtractor(item)} className="hover:bg-[var(--ds-layer-03)] transition-colors">
                {columns.map(c => <td key={c.id} className="px-4 py-3">{c.cell(item)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List Transformation (Zero Horizontal Scroll) */}
      <div className="md:hidden flex flex-col gap-3">
        {data.map(item => (
          <Card key={keyExtractor(item)} isInteractive onClick={() => onRowClick?.(item)} className="p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between font-medium">
              <span>{columns[0]?.cell(item)}</span>
              <span>{columns[columns.length - 1]?.cell(item)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-[var(--ds-text-subtle)] pt-2 border-t border-[var(--ds-border-subtle)]">
              {columns.slice(1, -1).map(c => (
                <div key={c.id}>
                  <span className="block text-[var(--ds-text-subtlest)]">{c.header}</span>
                  <span>{c.cell(item)}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 5. React Native & Expo Bridge Architecture

The web CSS variables are mirrored 1-to-1 into typed JavaScript objects for React Native / Expo in `packages/ui/src/tokens.ts`:
- All values are resolved to exact hexadecimal strings or pixel numbers.
- Prevents runtime crashes caused by unparsed CSS variables (`var(...)` or `oklch(...)`) in React Native `StyleSheet.create`.
- Provides identical color fidelity across iPhone and Android devices.
