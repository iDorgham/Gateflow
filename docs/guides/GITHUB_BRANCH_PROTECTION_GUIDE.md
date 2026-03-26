# Guide: GateFlow GitHub Branch Protection

Since some GitHub settings are not accessible via code/git, this document serves as the mandatory checklist for the repository administrator (@iDorgham) to implement in **GitHub → Settings → Branches**.

## 1. Protected Branch: `master`

Apply these rules to the `master` (and `main`) branch:

- [ ] **Require a pull request before merging**
  - [ ] Required approvals: **1**
  - [ ] Dismiss stale pull request approvals when new commits are pushed: **YES**
  - [ ] Require review from Code Owners: **YES** (enforces `.github/CODEOWNERS`)
- [ ] **Require status checks to pass before merging**
  - [ ] Require branches to be up to date before merging: **YES**
  - [ ] Status checks that must pass:
    - `CI / lint`
    - `CI / typecheck`
    - `CI / test`
    - `CI / performance` (optional/non-blocking if preferred)
    - `Build Check` (from deploy.yml)
- [ ] **Require conversation resolution before merging**: **YES**
- [ ] **Require signed commits**: **YES** (Enforces GPG/SSH attribute)
- [ ] **Require linear history**: **YES** (Prevent merge commits)
- [ ] **Lock branch**: **NO** (Only for read-only archives)
- [ ] **Allow force pushes**: **NO**
- [ ] **Allow deletions**: **NO**

## 2. Protected Branch: `develop`

Apply the same rules as `master`, but keep approvals optional if fast iteration is needed between team members before a release candidate is finalized.

## 3. Deployment Environments: `production`

In **GitHub → Settings → Environments → production**:

- [ ] **Required reviewers**: Add `@iDorgham` to approve production deployments triggered by `deploy.yml`.
- [ ] **Deployment branch policy**: Restricted to `master`.
