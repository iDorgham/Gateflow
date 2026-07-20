# Phase 1 — P0 Containment: Bootstrap Route and Browser Injection

**Role:** Security with backend/web support. Read the plan, context, and tasks first.

## Goal and scope

Remove the administrator reset attack path; rotate affected credentials through the approved operational process; sanitize CMS HTML; constrain branding CSS; add regression and CI guards. Do not perform the tenant refactor or broad CMS redesign.

## Ordered work

1. Verify route exposure/legitimate use without disclosing secrets, then remove it from deployable code.
2. If bootstrap is required, create a local-only interactive mechanism with no default secret/password.
3. Trace CMS write/import/render paths; apply strict allowlist sanitization at write and defensively at render.
4. Allow only supported branding token names/value formats; reject CSS breakout constructs.
5. Test endpoint absence, script/event handlers, unsafe URLs/SVG, malformed HTML, and CSS injection.
6. Add source/CI guards against known credentials and deployable reset/setup routes.

## Acceptance and verification

- [ ] No production reset route/default credential remains; sanitization and CSS validation resist bypass tests.
- [ ] Targeted client/marketing/admin lint, typecheck, and tests pass.
- [ ] `pnpm preflight` passes.

```bash
rg -n "gateflow-setup-2026|password123|api/setup/reset-admin" apps packages scripts
pnpm turbo test --filter=client-dashboard --filter=marketing --filter=admin-dashboard
pnpm preflight
```

Update tasks, session memory, and `phase_logs/PHASE_LOG_phase_01.md`; do not edit the plan.
