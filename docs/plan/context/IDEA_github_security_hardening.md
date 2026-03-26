# IDEA: Github Security Hardening

**Slug:** `github_security_hardening`
**Initiative:** Github Security Hardening & CI/CD Governance
**Status:** 🆕 Open
**Target:** Q4 2026

## Problem

GateFlow's automation stack (the Ralph Loop) is powerful but depends on the security of the GitHub repository itself. Currently:

- Branch protection rules are active but not audit-certified.
- CI/CD secrets (Vercel, Database, QR Signing) exist in GitHub but lack a formal rotation policy.
- The supply chain (dependencies) is audited via `pnpm-lock.yaml` but lacks proactive automated patching (Dependabot/Renovate).
- GitHub Actions permissions are broadly scoped, potentially allowing a compromised action to exfiltrate secrets.

## Vision

A **Hardened Engineering Pipeline** where:

- The `master` branch is inaccessible without a peer-reviewed PR and passing health gates.
- All secrets use the **Principle of Least Privilege** and are rotated every 90 days.
- GitHub Actions use OIDC where possible to eliminate long-lived "Master Keys".
- Automated dependency audits block vulnerable packages before they reach any app.
- Every commit is cryptographically attributable (Optional: GPG signing).

## Constraints & Metrics

- **100% Secret Coverage**: All `.env` variables mapped to GitHub Secrets with no raw values in YAML.
- **Zero-Trust CI**: Actions must use `permissions: contents: read` by default, with explicit overrides for deployment.
- **Supply Chain Hygiene**: Zero HIGH/CRITICAL vulnerabilities in `pnpm-lock.yaml`.
- **RTL/i18n**: Unaffected, but deployment of i18n bundles must be secure.

## Success Criteria

1. [ ] Branch protection rules for `master` require linear history and signed commits.
2. [ ] CI secrets audited and long-lived Vercel/DB tokens rotated.
3. [ ] `Dependabot` active and configured for weekly non-breaking updates.
4. [ ] GitHub Actions updated to follow minimum-privilege `permissions` block standard.
5. [ ] `scripts/scan-secrets.js` integrated as a mandatory CI gate (failing build on secrets).

## Risks

- **Build Interruption**: Strict rules might block emergency hotfixes (need bypass roles).
- **Secret Mismanagement**: Rotation could break live deployments if not coordinated.

## Stakeholders

- Engineering (GateFlow Team)
- Operations (Property Managers & Residents rely on service uptime)
