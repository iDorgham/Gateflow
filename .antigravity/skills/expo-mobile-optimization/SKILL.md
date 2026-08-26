---
name: expo-mobile-optimization
description: Specialized workflows and patterns for expo-mobile-optimization.
---

# SKILL: Expo Mobile Performance & Optimization

## Purpose

Ensure that GateFlow mobile apps are lightweight, fast-loading, and efficient on various hardware, ranging from high-end iPhones to budget andorid scanners.

## Core Principles

1.  **Asset Management**: Use highly compressed SVGs and WebP images.
2.  **Bundle Efficiency**: Utilize code-splitting and lazy-loading for heavy modules (Charts, PDF Generators).
3.  **Render Optimization**: Prevent unnecessary re-renders in high-frequency list views (e.g., live scan feeds) using `React.memo` and `useCallback`.

## Implementation Rules

- **Image Optimization**: Use `expo-image` for pre-fetching and caching.
- **Fonts**: Load only necessary weights and subsets.
- **Lists**: Use `FlashList` from Shopify for buttery-smooth scrolling on low-end devices.

## Anti-Patterns

- Loading large datasets into state (use pagination/virtualization).
- Not cleaning up listeners/timers on component unmount.
- Using `FlatList` for lists with >50 items without optimization.

## Code Examples

### Optimized List (FlashList)

```tsx
import { FlashList } from '@shopify/flash-list';

const ScanList = ({ scans }) => (
  <FlashList
    data={scans}
    renderItem={({ item }) => <ScanRow data={item} />}
    estimatedItemSize={80}
    onEndReached={loadMore}
  />
);
```

### Lazy Loading a Module

```tsx
const AnalyticsChart = React.lazy(() => import('./components/AnalyticsChart'));

// Use Suspense to wrap
<Suspense fallback={<ActivityIndicator />}>
  <AnalyticsChart />
</Suspense>;
```
