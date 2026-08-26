---
name: nextjs-performance
description: Server vs Client components, caching strategies, streaming/suspense, image/font optimization for GateFlow.
---

# Next.js Speed & Core Optimization

## Purpose

Ensure the GateFlow dashboards load instantly and respond with zero lag. This skill provides the architectural rules for leveraging Next.js 14 App Router performance features to their fullest.

## Core Principles

1. **Server First**: 90% of data fetching must happen in Server Components. Only interactive modules (Forms, Chat, Charts) should be Client Components.
2. **Streaming & Suspense**: Break heavy pages into Suspense boundaries to allow streaming of critical content while secondary data loads.
3. **Optimized Assets**: Use `next/image` for layout-stable images and `next/font` for zero layout shift.
4. **PageSpeed 100% Mandate**: Every page must maintain a 100/100 score on Google PageSpeed Insights (Mobile & Desktop). Use `/clis team perf` to resolve regressions.

## Implementation Rules

- **Caching**: Use `revalidatePath` or `revalidateTag` for fine-grained cache control.
- **Form Actions**: Use Server Actions (`'use server'`) for all mutations to avoid the need for separate API clients.
- **Bundle Analysis**: Keep client-side bundle size small. Do not import heavy libraries like `lodash` in client components (use native alternatives).
- **SEO Ready**: Every page must use the `generateMetadata` function (Skill 12).

## Anti-Patterns

- Using `'use client'` at the top of every file.
- `useEffect` for data fetching (use Server Components or React Query with pre-fetching).
- Passing large, non-serializable objects from Server to Client components.

## Code Example

```tsx
// Pattern for Streaming Dashboard Metrics
import { Suspense } from 'react';
import { MetricsSkeleton } from '@/components/skeletons';
import { RealTimeMetrics } from '@/components/metrics';

export default function DashboardPage() {
  return (
    <main className="gap-space-400">
      <h1 className="text-ds-text font-heading-large">Pulse Dashboard</h1>

      <Suspense fallback={<MetricsSkeleton />}>
        {/* Heavy data fetching happens inside this Server Component */}
        <RealTimeMetrics />
      </Suspense>
    </main>
  );
}
```
