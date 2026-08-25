# Release Train and Dashboard Intelligence Specification

## Release control model

1. Complete approved scope and release evidence.
2. Run trusted quality gates: environment, secrets, dependencies, imports, migration, bundle, pre-deploy, targeted tests, and `pnpm preflight`.
3. Validate in staging, including migration and rollback/restore where applicable.
4. Classify under SemVer and obtain release-manager approval.
5. Format/check the changelog, bump the approved version, and commit release metadata.
6. Deploy the approved artifact, run production smoke checks, then create the annotated tag and verify the GitHub Release.
7. Record post-release health, known risks, and rollback evidence.

```bash
pnpm version:info
pnpm docs:changelog:format
pnpm docs:changelog:check
pnpm check:env
pnpm check:secrets
pnpm check:security:fail
pnpm check:imports:fail
pnpm check:db-drift
pnpm check:bundle
pnpm check:pre-deploy:fail
pnpm preflight

# After approval and a clean working tree:
pnpm version:bump patch
git add package.json CHANGELOG.md
git commit -m "release: vX.Y.Z"

# Deploy and complete production smoke checks first, then:
pnpm version:tag "Release vX.Y.Z — security and readiness"
git push origin HEAD --follow-tags
```

Use `minor` or `major` only after compatibility review. Do not bump/tag ordinary phase commits, experimental branches, unapproved migration changes, or a red CI run.

## Dashboard intelligence model

| Page                         | Primary user        | Questions answered                                                                    | Guardrails                                                                      |
| ---------------------------- | ------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Security command center      | Guard supervisor    | What needs attention now? Which gate/shift is anomalous?                              | No tenant crossover; freshness visible; records behind permissioned drill-down. |
| Gate operations              | Facility operator   | Where are denials, overrides, delays, offline devices, or rule failures concentrated? | Gate/device filters; time range; no raw PII in aggregate cards.                 |
| Visitor and contractor trust | Tenant admin        | Are approvals, credentials, expiry policies, and watchlists reducing risk?            | Role-sensitive fields masked; audit trail immutable/read-only.                  |
| Site health                  | GateFlow operations | Which customer site needs proactive support?                                          | Cross-tenant support visibility restricted to platform roles and audited.       |

### Non-functional checklist

- Enforce tenant scope/role permission in chart APIs, exports, drill-downs, and cached results.
- Query explicit time ranges and maximum cardinality; return pre-aggregated buckets, not unbounded events.
- Display timezone, bucket boundary, freshness, and KPI definition.
- Prevent layout shift; support mobile and RTL.
- Make values/anomalies available by text/table/keyboard navigation, not only tooltip/color.
- Make filters URL-addressable, debounced, cancellable, and context-preserving.
- Cover loading, empty, permission-denied, partial-data, and error states.
- Add data-contract, tenant-isolation, visual/RTL, and performance regression tests.
