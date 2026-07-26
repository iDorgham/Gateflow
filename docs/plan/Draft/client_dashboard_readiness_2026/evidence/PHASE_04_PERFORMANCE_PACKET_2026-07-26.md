# Phase 04 performance packet — 2026-07-26

## Status

Blocked. The local packet is valid for before/after direction on one machine,
but it is not a preview comparison or pilot certification.

## Method

- Base commit: `c68b17b64b443e68c1841c833db87e966beb554c`
- Runtime: Node 26.5.0, pnpm 8.15.0, macOS 15.7.1, x86_64
- Hardware class: Intel Core i7, four cores, 16 GB
- App mode: `next build` followed by `next start`
- Page: unauthenticated `/en/login`
- Lighthouse: desktop simulated, three warm runs before and after
- Health: ten warm requests after one payload/header probe
- Bundle: uncompressed aggregate of unique `.next/static/chunks/**/*.js`
- Dataset: unauthenticated login only; no tenant records were queried

Node 26 is not comparable to Vercel's Node 24 runtime. Authenticated P0 pages,
API latency, and Prisma query count/time require a fixed seeded dataset and
role. No preview deployment or preview probe was authorized.

## Measured bottlenecks and changes

| Priority | Evidence                                                       | Smallest change                                                  | Result                                                   |
| -------- | -------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------- |
| P0       | `/health` returned 404                                         | Add minimal `/api/health`, framework rewrite, exact Proxy bypass | 200, `no-store`, two allowlisted fields                  |
| P1       | Next 16 middleware deprecation                                 | Rename middleware/export/tests to Proxy convention               | Warning removed; CSRF tests preserved                    |
| P1       | Login median unused JS ~164 KB; UI barrel pulled Framer Motion | Add six explicit UI subpath exports and use them on login        | Median unused JS ~26 KB                                  |
| P2       | TypeScript errors could be ignored during build                | Remove `ignoreBuildErrors`                                       | Build type validation passes                             |
| P2       | Prisma CJS wildcard warning                                    | Accept and time-box                                              | Broad shared export migration deferred                   |
| P2       | Google Fonts fetched during build                              | Record blocker                                                   | Requires vetted local Poppins/Cairo assets and visual QA |

## Before and after

| Metric                          |  Before |   After |    Change |
| ------------------------------- | ------: | ------: | --------: |
| Lighthouse performance median   |      66 |      85 |       +19 |
| LCP median                      | 4719 ms | 3584 ms |  -1135 ms |
| TBT median                      |  777 ms |  272 ms |   -505 ms |
| CLS median                      |       0 |       0 | unchanged |
| Unused JS median                | ~164 KB |  ~26 KB |  -~138 KB |
| Whole-build client JS aggregate | 5502 KB | 5491 KB |    -11 KB |

The timed warm build was 71.54 seconds before the login optimization and 82.21
seconds after it. The variance is not attributed to the page-only import
change; additional same-environment samples are required.

Health latency across ten warm samples was approximately p50 4.45 ms and p95
9.13 ms. The payload was exactly:

```json
{ "status": "ok", "service": "client-dashboard" }
```

## Budgets and gates

- Whole-build client JS aggregate: fail above 5600 KB. This is the stored
  5503 KB baseline with less than two percent growth headroom.
- Warm health p95 target: 100 ms on local/preview Node 24 samples.
- Product Lighthouse targets remain performance 65+, LCP ≤2500 ms, TBT ≤200
  ms, and CLS ≤0.15. The after run passes score/CLS but still misses LCP/TBT.
- API and database budgets are deliberately not invented. Establish them from
  at least ten warm samples against the fixed pilot dataset, recording Prisma
  query count and duration.

Regression command:

```bash
pnpm --filter client-dashboard perf:bundle
```

## Accepted warning

The remaining Prisma warning originates in the shared
`packages/db/src/index.ts` wildcard export from the CommonJS Prisma client.
The dependency remains server-externalized and builds successfully. Removing
the warning safely requires a broad explicit-export and consumer migration, so
it is accepted as low-risk shared-package debt for this phase.

## Blockers and prepared preview commands

Phase 04 cannot close until a same-commit preview and fixed authenticated pilot
dataset are explicitly authorized. Run Vercel CLI only from the repository
root after authorization:

```bash
vercel deploy
vercel inspect <deployment-url> --logs
pnpm exec lhci collect --url=<deployment-url>/en/login --numberOfRuns=3 --settings.emulatedFormFactor=desktop --config=.lighthouserc.js
curl -fsS <deployment-url>/health
```

Do not include credentials in Lighthouse configuration or artifacts. Use an
approved non-sensitive authentication fixture for P0 dashboard pages.
