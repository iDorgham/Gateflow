# GateFlow Kiro Configuration

Welcome to the Kiro AI assistant configuration for GateFlow!

## Quick Start

### For AI Assistants
You have automatic access to:
- **5 Skills** in `skills/` - Deep domain expertise
- **4 Steering Rules** in `steering/` - Context-aware guidance
- **6 Hooks** in `hooks/` - Automated workflows

Skills and steering rules load automatically. Just start working!

### For Developers
1. Read `QUICK_REFERENCE.md` for essential patterns
2. Review `KIRO_SETUP.md` for complete guide
3. Check `../docs/KIRO_SETUP_COMPLETE.md` for overview

## Directory Structure

```
.kiro/
├── skills/                    # Expert knowledge domains
│   ├── gateflow-architecture/ # Monorepo & tech stack
│   ├── gateflow-security/     # Auth & encryption
│   ├── gateflow-database/     # Prisma & queries
│   ├── gateflow-testing/      # Jest & testing
│   └── gateflow-mobile/       # React Native & Expo
├── steering/                  # Context-aware rules
│   ├── gateflow-conventions.md    # Always active
│   ├── prisma-queries.md          # For *.ts files
│   ├── api-development.md         # For API routes
│   └── component-development.md   # For components
├── hooks/                     # Automated workflows
│   ├── lint-on-save.json
│   ├── prisma-generate.json
│   ├── multi-tenant-check.json
│   ├── security-review.json
│   ├── test-after-feature.json
│   └── typecheck-on-build.json
├── KIRO_SETUP.md             # Complete setup guide
├── QUICK_REFERENCE.md        # Quick lookup
└── README.md                 # This file
```

## Critical Rules

### Multi-Tenancy
```typescript
// ✅ ALWAYS
where: { organizationId: user.orgId, deletedAt: null }
```

### Soft Deletes
```typescript
// ✅ ALWAYS
update({ data: { deletedAt: new Date() } })
```

### Package Manager
```bash
# ✅ ALWAYS use pnpm
pnpm install
pnpm turbo dev
```

## Available Skills

| Skill | Purpose | Lines |
|-------|---------|-------|
| gateflow-architecture | Monorepo structure & patterns | 150 |
| gateflow-security | Auth, encryption, RBAC | 280 |
| gateflow-database | Prisma schema & queries | 320 |
| gateflow-testing | Jest patterns & mocking | 180 |
| gateflow-mobile | React Native & Expo | 240 |

## Active Hooks

| Hook | Trigger | Action |
|------|---------|--------|
| lint-on-save | File edited | Run linter |
| prisma-generate | Schema changed | Regenerate client |
| multi-tenant-check | Before write | Verify org scoping |
| security-review | API edited | Review security |
| test-after-feature | Task complete | Run tests |
| typecheck-on-build | Build command | Type check |

## Documentation

- `QUICK_REFERENCE.md` - Essential patterns and commands
- `KIRO_SETUP.md` - Complete setup and usage guide
- `../docs/KIRO_CONFIGURATION_SUMMARY.md` - Full overview
- `../docs/REQUIRED_SKILLS_AND_AGENTS.md` - Skills required
- `../docs/KIRO_SETUP_COMPLETE.md` - Completion summary

## Support

For questions or issues:
1. Check `QUICK_REFERENCE.md` for quick answers
2. Review relevant skill in `skills/`
3. Consult `KIRO_SETUP.md` for detailed guidance
4. Check project docs in `../docs/`

## Status

✅ Configuration Complete  
✅ 5 Skills Active  
✅ 4 Steering Rules Active  
✅ 6 Hooks Active  
✅ Ready for Use

---

**Last Updated:** February 25, 2026  
**Version:** 1.0.0  
**Project:** GateFlow
