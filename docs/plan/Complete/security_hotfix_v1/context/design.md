# Design and UX Context — security_hotfix_v1

This hotfix is security-heavy with minimal UX changes.

## Phase 3 notes

- Security header changes must not break app hydration and required analytics.
- CSP should remain strict but pragmatic:
  - default to `'self'`
  - allow only explicitly required analytics origins
  - avoid unsafe wildcard allowances
