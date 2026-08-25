# Phase 04 — Performance and runtime readiness

Act as the single primary writer. Use the performance-audit workflow:
baseline → measure → identify bottleneck → smallest fix → remeasure.

Capture comparable local and preview measurements for P0 pages, client bundles,
Core Web Vitals/Lighthouse, API latency, database query count/time, and build
duration. Record hardware, environment, dataset, cache state, and sampling; do
not compare unlike runs. Set budgets from product needs and baseline evidence,
not invented scores.

Profile and rank bottlenecks by user impact. Implement only measured,
high-impact changes, with before/after evidence and regression checks. Add the
real unauthenticated health endpoint and verify it reveals no sensitive data.
Resolve or document the Next proxy/middleware and Prisma module warnings.
Reduce avoidable build-time network dependency where practical. Keep Node.js
Fluid Compute defaults; do not introduce Edge runtime by habit.

Run focused lint/typecheck/test/build and health probes. If a Vercel preview is
explicitly authorized, run Vercel CLI from the repository root and capture the
deployment URL/log evidence; otherwise prepare the commands without executing
them.

Mutation boundary: no production deployment, migration, domain, or environment
mutation.

Exit: Phase 05 prompt.
