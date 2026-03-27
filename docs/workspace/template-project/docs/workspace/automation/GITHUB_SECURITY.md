# GitHub Security (Workspace)

Source files:

- `.github/workflows/codeql-analysis.yml`
- `.github/SECURITY.md`
- `.github/dependabot.yml`
- `scripts/check-security.js`
- `scripts/scan-secrets.js`

## Security Automations

### 1) CodeQL Analysis

- Workflow: `codeql-analysis.yml`
- Coverage: JavaScript/TypeScript code scanning
- Triggered on:
  - Push to `main` / `master`
  - Pull requests to `main` / `master`
  - Weekly scheduled run

### 2) Secret Scanning in CI and Local

- CI uses `pnpm check:secrets` in `ci.yml` security job.
- Local guard runs in Husky `pre-commit` through `scan-secrets.js`.

### 3) Dependency Security

- Dependabot config in `.github/dependabot.yml`.
- Keeps dependency/security update flow active in GitHub.

### 4) Security Validation Script

- `scripts/check-security.js` for project security checks.
- `scripts/security-fix.js` supports automated remediations for specific checks.
