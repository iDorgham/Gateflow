# GateFlow Multi-App Design System Migration & Rollout Guide

**Document:** `MIGRATION_AND_ROLLOUT_GUIDE.md`  
**Initiative:** `design_system_impeccable_revamp`  
**Phase Target:** Phase 5 (Multi-App Rollout) & Phase 6 (Monorepo Certification)  

---

## 1. Migration Overview & Strategy

The migration from legacy ad-hoc styles to `@gateflow/ui` is executed across 3 decoupled sub-tracks:

```
[Track 5A: Operational Dashboards]
  Apps: client-dashboard (Port 3001), admin-dashboard (Port 3002)
  Default Density: Compact (36px controls, dense data tables)
  Key Deliverables: Replace raw tables with DynamicTable, forms with FormField, legacy slate classes with layer-01..04.

[Track 5B: Public Web & Portals]
  Apps: marketing (Port 3000), resident-portal (Port 3004)
  Default Density: Comfortable (48px controls, bento grids, glass navbars)
  Key Deliverables: Hero layouts, bento feature showcases, Arabic RTL bidi verification.

[Track 5C: Mobile Applications (Expo)]
  Apps: scanner-app (Port 8081), resident-mobile
  Default Density: Comfortable (Touch targets >= 44px)
  Key Deliverables: nativeTokens hex bridge, BottomSheet drawers, FAB speed dials, BiometricHUD overlays.
```

---

## 2. Step-by-Step Code Migration Recipes

### Recipe 1: Replacing Hardcoded Tailwind Colors with Semantic Tokens
| Legacy Code (Banned) | Upgraded Semantic Token |
| :--- | :--- |
| `bg-white dark:bg-slate-900` | `bg-[var(--ds-layer-02)]` |
| `border-slate-200 dark:border-slate-800` | `border-[var(--ds-border-subtle)]` |
| `text-slate-900 dark:text-slate-50` | `text-[var(--ds-text-primary)]` |
| `text-slate-500 dark:text-slate-400` | `text-[var(--ds-text-subtle)]` |
| `bg-orange-600 hover:bg-orange-700` | `bg-[var(--ds-color-primary)] hover:bg-[var(--ds-color-primary-hover)]` |
| `bg-red-500 text-white` | `bg-[var(--ds-color-danger)] text-white` |

### Recipe 2: Upgrading Ad-Hoc Forms to `FormField`
```diff
- <div className="mb-4">
-   <label className="block text-sm font-medium text-gray-700 mb-1">Visitor Name</label>
-   <input type="text" className="w-full border rounded px-3 py-2" />
-   {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
- </div>

+ <FormField
+   label="Visitor Full Name"
+   helperText="As shown on national ID or passport"
+   errorMessage={errors.name?.message}
+   isInvalid={!!errors.name}
+   isRequired
+ >
+   <Input placeholder="e.g. Tarek Mansour" />
+ </FormField>
```

### Recipe 3: Upgrading Mobile Expo Styles to `nativeTokens`
```diff
import { StyleSheet, View, Text } from 'react-native';
- import { colors } from './legacyColors';
+ import { nativeTokens } from '@gateflow/ui/tokens';

const styles = StyleSheet.create({
  container: {
    flex: 1,
-   backgroundColor: '#121212',
+   backgroundColor: nativeTokens.colors.background,
    padding: nativeTokens.spacing['space-200'],
  },
  card: {
-   backgroundColor: '#1e1e1e',
-   borderColor: '#333',
+   backgroundColor: nativeTokens.colors.surfaceRaised,
+   borderColor: nativeTokens.colors.borderSubtle,
    borderWidth: 1,
    borderRadius: nativeTokens.borderRadius.lg,
  },
});
```

---

## 3. Automated ESLint Token Guard Configuration

To prevent future color regressions, add this rule to `packages/config/eslint/base.js`:

```javascript
module.exports = {
  rules: {
    "no-restricted-syntax": [
      "warn",
      {
        selector: "JSXAttribute[name.name='className'] Literal[value=/bg-(white|black|slate-|gray-)/]",
        message: "Direct background colors are banned. Use semantic tokens like 'bg-[var(--ds-layer-02)]'."
      },
      {
        selector: "JSXAttribute[name.name='className'] Literal[value=/border-(slate-|gray-|zinc-)/]",
        message: "Direct border colors are banned. Use 'border-[var(--ds-border-subtle)]'."
      }
    ]
  }
};
```

---

## 4. Visual Regression Snapshot Workflow

1. In Phase 4 and Phase 6, generate baseline Playwright visual snapshots across all 6 applications:
   ```bash
   pnpm test:e2e:snapshots
   ```
2. Commit the golden snapshot files to `.playwright/snapshots/`.
3. Any pixel shift $> 0.1\%$ triggers an automated CI failure that must be approved or fixed.
