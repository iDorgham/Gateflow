---
name: docs
description: Automated documentation updates — changelog, version badge, PRD, feature log, README, release.
---

# /docs — Documentation Automation

Use `/docs` to update project documentation automatically after shipping a feature, cutting a release, or organizing the docs folder.

## Commands

### After finishing a feature
```bash
pnpm plan:done <slug>           # auto-triggers all doc updates
# or manually:
node scripts/ralph-docs.js on-plan-done <slug> "Feature description"
```

### Changelog
```bash
pnpm docs:changelog add <slug> "<description>" [--type feat|fix|perf|security]
pnpm docs:changelog from-commit           # parse latest git commit
pnpm docs:changelog release <version>     # close [Unreleased] → [v1.2.0]
```

### README
```bash
pnpm docs:readme                          # refresh version badge + recent activity
```

### Full release
```bash
pnpm docs:release <version>
# Does: bump package.json → close CHANGELOG → refresh README → git tag
```

### Upcoming & feature log
```bash
node scripts/ralph-docs.js upcoming add <slug> "<description>"
node scripts/ralph-docs.js upcoming shipped <slug>
node scripts/ralph-docs.js feature-log <slug> "✅ Shipped" "<notes>"
```

### PRD
```bash
node scripts/ralph-docs.js prd feature <slug> "✅ Complete"
```

## What updates automatically (zero action needed)

| Trigger | Auto-updates |
|---------|-------------|
| `git commit feat(...)` | `CHANGELOG.md [Unreleased]` entry |
| `pnpm plan:start <slug>` | PRD status, UPCOMING.md, CHANGELOG |
| `pnpm plan:done <slug>` | CHANGELOG, FEATURE_LOG.md, UPCOMING.md, PRD, README |
| `pnpm docs:release <v>` | All of the above + git tag |

## Files managed

- `CHANGELOG.md` — Keep a Changelog format, semantic versioning
- `README.md` — version badge + recent activity section
- `docs/product/PRD.md` — feature status tracking
- `docs/product/FEATURE_LOG.md` — chronological shipped features
- `docs/product/UPCOMING.md` — in-planning + in-development + recently shipped
- `docs/INDEX.md` — auto-generated docs directory index
