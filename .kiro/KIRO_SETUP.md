# GateFlow Kiro Configuration

This document explains the Kiro AI assistant configuration for the GateFlow project.

## Overview

Kiro is configured with specialized skills, steering rules, and automated hooks to ensure consistent, high-quality development that follows GateFlow's architecture and security patterns.

## Directory Structure

```
.kiro/
├── skills/                    # Specialized knowledge domains
│   ├── gateflow-architecture/ # Monorepo structure & tech stack
│   ├── gateflow-security/     # Auth, encryption, RBAC patterns
│   ├── gateflow-database/     # Prisma schema & query patterns
│   ├── gateflow-testing/      # Jest testing patterns
│   └── gateflow-mobile/       # React Native & Expo patterns
├── steering/                  # Context-aware guidelines
│   ├── gateflow-conventions.md    # Always-active core rules
│   ├── prisma-queries.md          # Auto-loads for .ts files
│   ├── api-development.md         # Auto-loads for API routes
│   └── component-development.md   # Auto-loads for components
├── hooks/                     # Automated workflows
│   ├── lint-on-save.json
│   ├── prisma-generate.json
│   ├── multi-tenant-check.json
│   ├── security-review.json
│   ├── test-after-feature.json
│   └── typecheck-on-build.json
└── KIRO_SETUP.md             # This file
```

## Skills

Skills provide deep domain expertise that Kiro can reference when working on specific areas.

### Available Skills

1. **gateflow-architecture** - Monorepo structure, tech stack, development patterns
2. **gateflow-security** - Authentication, encryption, RBAC, security best practices
3. **gateflow-database** - Prisma schema, query patterns, multi-tenancy
4. **gateflow-testing** - Jest configuration, testing patterns, mocking
5. **gateflow-mobile** - React Native, Expo, offline functionality

### Using Skills

Skills are automatically activated when relevant, but you can explicitly reference them:
- "Using the gateflow-security skill, implement JWT authentication"
- "Following gateflow-database patterns, create a new model"

## Steering Rules

Steering rules provide context-aware guidance that automatically loads based on file patterns.

### Always Active
- **gateflow-conventions.md** - Core development rules (multi-tenancy, soft deletes, pnpm usage)

### Context-Aware (Auto-loads)
- **prisma-queries.md** - Loads for `*.ts` files (multi-tenant scoping, soft delete patterns)
- **api-development.md** - Loads for `**/api/**/*.ts` files (auth, rate limiting, validation)
- **component-development.md** - Loads for component files (React patterns, UI library usage)

## Hooks

Hooks automate common workflows and enforce quality checks.

### Active Hooks

1. **lint-on-save** - Runs ESLint when TS/JS files are saved
2. **prisma-generate** - Regenerates Prisma client when schema changes
3. **multi-tenant-check** - Verifies organizationId scoping in Prisma queries
4. **security-review** - Reviews API routes for security issues
5. **test-after-feature** - Runs tests after completing tasks
6. **typecheck-on-build** - Type checks before builds

### Managing Hooks

View hooks in the Kiro sidebar or use Command Palette:
- `Kiro: Open Hook UI` - Visual hook management
- Hooks are stored as JSON files in `.kiro/hooks/`

## Core Conventions

### Multi-Tenancy
Every database query MUST scope by `organizationId`:
```typescript
const data = await prisma.model.findMany({
  where: {
    organizationId: user.orgId,
    deletedAt: null
  }
});
```

### Soft Deletes
Never use hard deletes:
```typescript
// ✅ CORRECT
await prisma.model.update({
  where: { id },
  data: { deletedAt: new Date() }
});

// ❌ WRONG
await prisma.model.delete({ where: { id } });
```

### Package Manager
Always use `pnpm`:
```bash
pnpm install
pnpm turbo dev
pnpm turbo build
```

### Security
- Validate JWT tokens on all API routes
- Apply rate limiting to public endpoints
- Use Zod for input validation
- Include CSRF protection on state-changing requests

## Quick Reference

### Common Commands
```bash
# Development
pnpm turbo dev                    # Start all apps
pnpm turbo dev --filter=client-dashboard  # Start single app

# Database
cd packages/db
npx prisma generate               # Regenerate client
npx prisma migrate dev            # Create migration
npx prisma studio                 # Open GUI

# Quality
pnpm turbo lint                   # Lint all
pnpm turbo test                   # Test all
pnpm turbo typecheck              # Type check all
```

### Key Files
- `CLAUDE.md` - Full AI assistant guide
- `docs/PROJECT_STRUCTURE.md` - Architecture details
- `docs/SECURITY_OVERVIEW.md` - Security patterns
- `packages/db/prisma/schema.prisma` - Database schema

## Customization

### Adding New Skills
1. Create directory: `.kiro/skills/my-skill/`
2. Add `SKILL.md` with expertise content
3. Document when to use and key patterns

### Adding Steering Rules
1. Create file: `.kiro/steering/my-rule.md`
2. Add frontmatter for inclusion rules:
```markdown
---
inclusion: fileMatch
fileMatchPattern: '**/*.tsx'
---
```

### Adding Hooks
1. Create JSON file: `.kiro/hooks/my-hook.json`
2. Define trigger and action:
```json
{
  "name": "My Hook",
  "version": "1.0.0",
  "when": { "type": "fileEdited", "patterns": ["*.ts"] },
  "then": { "type": "runCommand", "command": "echo 'File changed'" }
}
```

## Best Practices

1. **Trust the hooks** - They enforce critical patterns automatically
2. **Reference skills** - Explicitly mention skills for complex tasks
3. **Update documentation** - Keep skills and steering current
4. **Test hooks locally** - Verify commands work before committing
5. **Review security checks** - Don't bypass security review hooks

## Troubleshooting

### Hook Not Triggering
- Check file pattern matches your file
- Verify JSON syntax is valid
- Check Kiro output panel for errors

### Steering Not Loading
- Verify frontmatter syntax
- Check fileMatchPattern regex
- Ensure file is in `.kiro/steering/`

### Skill Not Available
- Verify `SKILL.md` exists in skill directory
- Check file is properly formatted
- Restart Kiro if needed

## Support

For issues or questions:
1. Check `CLAUDE.md` for detailed guidance
2. Review relevant skill documentation
3. Check hook execution logs in Kiro panel
4. Consult project documentation in `docs/`

---

**Last Updated:** February 25, 2026  
**Kiro Version:** Latest  
**Project:** GateFlow v5.0
