---
name: version
description: Semantic versioning — bump package.json, create annotated git tags, generate versioned branch names.
---

# /version — Version Management

Use `/version` to manage GateFlow's semantic versioning across package.json, git tags, and branch names.

## Commands

```bash
pnpm version:info                     # show version + branch + last tag + commit count
pnpm version:bump [major|minor|patch] # bump version in package.json (default: patch)
pnpm version:tag [name|"Release msg"] # create annotated git tag v{version}
pnpm docs:release <version> [name]    # full release: changelog + version + tag + readme
node scripts/ralph-version.js branch <slug>   # print versioned branch name
```

## Standard release flow

```bash
# 1. Finish your feature
pnpm plan:done my_feature

# 2. Bump version
pnpm version:bump minor              # 0.4.3 → 0.5.0

# 3. Full release with release name (closes changelog + tags)
pnpm docs:release 0.5.0 Pilot        # or pnpm docs:release 0.5.0 "Red Sea"

# 4. Push tag
git push origin HEAD && git push origin v0.5.0
```

## Branch naming convention

```
feat/v{major.minor}-{slug}    e.g.  feat/v0.2-resident_mobile_one_tap
fix/v{major.minor}-{slug}     e.g.  fix/v0.2-login_bug
```

Generate automatically:

```bash
node scripts/ralph-version.js branch resident_mobile_one_tap
# → feat/v0.1-resident-mobile-one-tap
```

## Versioning rules

| Change type                  | Bump    | Examples                           |
| ---------------------------- | ------- | ---------------------------------- |
| New app-level feature        | `minor` | New CRM module, new dashboard page |
| Bug fix, small improvement   | `patch` | RTL fix, test fix                  |
| Breaking API / schema change | `major` | Auth overhaul, DB migration        |

## Current version

Run `pnpm version:info` to see:

- Version from `package.json`
- Current git branch
- Last annotated tag
- Total commit count
