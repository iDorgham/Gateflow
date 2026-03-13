# IDEA: advanced_seeding_v2 — Ultra-Advanced Seeding Matrix (v2)

## Goal

Transform the current static seeding logic into a multi-step, scenario-based
engine that generates high-fidelity production-grade data. This engine is
designed to stress-test UI performance (infinite scroll, complex charts),
server logic (deep joins, RBAC), and background workers (retention/cleanup).

## Background

Current seeding in `seed_dev.ts` and `seed-service.ts` is functional but lacks
the "Rush Hour" realism and extreme volume required for professional
benchmarking. We need data that doesn't just fill the database, but simulates
realistic usage patterns (clusters, peaks, marketing attribution) to ensure
analytics and monitoring features work as intended.

## Constraints

- **Performance**: Must use `createMany` and batching (chunks of 500) to
  prevent OOM errors.
- **Relational Integrity**: Every visitor sequence must follow the full path:
  Org -> Project -> Unit -> Contact -> AccessRule -> VisitorQR (+UTMs) ->
  ScanLog -> Incident.
- **Multi-tenancy**: All data must be correctly scoped to an `organizationId`.
- **Reproducibility**: Support `randomSeed` for consistent test results.
- **CLI first**: Must be executable via `pnpm prisma db seed` with advanced flags.

## Scope

- Scenario Presets: `luxury-compound`, `nightclub`, `private-school`,
  `wedding-venue`.
- Temporal Realism: "Rush Hour" algorithm with scenario-specific scan clustering.
- High-Volume CRM: 10,000+ Contacts and 5,000+ Units.
- RBAC Stress: 15+ custom roles per organization.
- Marketing attribution: UTM injection for 40% of QR codes.
- Security triggers: Incident flooding (15%) and watchlist matches.
- Chart Validation: Automated checks to ensure charts will show meaningful
  peaks/valleys.

## Success Criteria

- [ ] `seed-service.ts` implements the "Rush Hour" algorithm.
- [ ] Baseline charts (AreaChart, BarChart) show realistic volatility with
  seeded data.
- [ ] Infinite scroll and search in client-dashboard handle 10,000+ contacts
  smoothly.
- [ ] CLI supports flags for scenario, scan count, and incident rate.
- [ ] Account export works as expected.
