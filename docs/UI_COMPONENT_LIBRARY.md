# UI Component Library (@gate-access/ui)

GateFlow maintains a shared UI component package to guarantee 1:1 design harmony between all web and native applications.

## Location & Structure
**Package Path:** `/packages/ui`

- `/src/components/ui/` - Foundational primitives (Buttons, Inputs, Dialogs) utilizing Radix UI.
- `/src/components/{app-name}/` - Specific complex block compositions corresponding precisely to app scopes (e.g., `DashboardCard` for `client-dashboard`).
- `/src/components/native/` - Components strictly written utilizing React Native views, wrapped seamlessly to isolate Next.js SSR build environments.

## Base Components Available
| Component | Description | Integration Node |
| --- | --- | --- |
| `Button` | Standardized variant buttons | Radix-backed |
| `Switch`, `RadioGroup` | Accessible toggle inputs | Radix-backed |
| `Popover`, `Command` | Tooltips, selectors, type-aheads | CMDK / Radix |
| `MultiSelect` | Advanced selection states | Subclass implementation |
| `LoadingSpinner`, `Icon` | Visual indicators and generic wrappers | Lucide |

## Implementation Rules
1. **Never copy-paste components**: If an app requires a component, check if it exists in `@gate-access/ui`. If it doesn't, add it there, not inside the `apps/{app-name}` directory.
2. **Abstracting Native Specifics**: Use the `/native` folder for `react-native` imports. Keep these files completely isolated from web Next.js SSR paths to prevent fatal Webpack/Turbopack "Invalid Host" breaking changes.
3. **Icons Structure**: Only strictly use `lucide-react` (Web) and `lucide-react-native` (Mobile). When passing icons via props, use standard TS interfaces (`import { type LucideIcon }`).
