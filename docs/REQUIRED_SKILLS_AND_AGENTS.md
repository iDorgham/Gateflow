# GateFlow Required Skills & Agents Configuration

**Created:** February 25, 2026  
**Purpose:** Document required skills for team members and AI agents working on GateFlow

---

## Overview

This document outlines the technical skills, knowledge domains, and AI agent configurations required for successful GateFlow development.

## For Human Developers

### Required Technical Skills

#### Core Technologies (Must Have)
- **TypeScript** - Strict mode, advanced types, generics
- **React 18** - Hooks, context, performance optimization
- **Next.js 14** - App Router, Server Components, API routes
- **PostgreSQL** - Query optimization, indexing, transactions
- **Prisma 5** - Schema design, migrations, query patterns
- **Git** - Branching, merging, conflict resolution

#### Secondary Technologies (Should Have)
- **React Native** - For mobile app development
- **Expo SDK 54** - Mobile development workflow
- **Turborepo** - Monorepo build orchestration
- **Tailwind CSS** - Utility-first styling
- **Jest** - Unit and integration testing
- **pnpm** - Package management

#### Security Knowledge (Must Have)
- JWT authentication and token management
- Password hashing (Argon2id)
- CSRF protection patterns
- Rate limiting strategies
- Multi-tenant data isolation
- Encryption (AES-256, HMAC-SHA256)
- RBAC implementation

### Domain Knowledge Required

#### 1. Multi-Tenant Architecture
- Row-level security patterns
- Organization-based data scoping
- Tenant isolation testing
- Cross-tenant data leakage prevention

#### 2. Soft Delete Patterns
- Audit trail maintenance
- Query filtering strategies
- Data recovery procedures
- Compliance requirements

#### 3. Offline-First Mobile
- Queue-based sync patterns
- Conflict resolution
- Encryption at rest
- Network state handling

#### 4. Access Control Systems
- Physical security concepts
- QR code technology
- Gate management workflows
- Audit logging requirements

### Recommended Learning Path

#### Week 1: Foundation
- [ ] Review `CLAUDE.md` - Complete AI assistant guide
- [ ] Study `docs/PROJECT_STRUCTURE.md` - Architecture overview
- [ ] Read `docs/SECURITY_OVERVIEW.md` - Security patterns
- [ ] Explore `packages/db/prisma/schema.prisma` - Data model

#### Week 2: Development Setup
- [ ] Set up local environment (see `docs/DEVELOPMENT_GUIDE.md`)
- [ ] Run all apps locally
- [ ] Create test database and seed data
- [ ] Make a small feature change end-to-end

#### Week 3: Deep Dive
- [ ] Review existing API routes for patterns
- [ ] Study authentication flow
- [ ] Understand multi-tenant query patterns
- [ ] Review mobile app offline sync

#### Week 4: Contribution
- [ ] Pick a small feature from backlog
- [ ] Implement with code review
- [ ] Write tests
- [ ] Update documentation

---

## For AI Agents (Kiro Configuration)

### Skills Configuration

Kiro has been configured with 5 specialized skills located in `.kiro/skills/`:

#### 1. gateflow-architecture
**Purpose:** Monorepo structure and development patterns  
**Activates:** When working on any codebase modifications  
**Key Knowledge:**
- 6 applications and their purposes
- 6 shared packages and usage
- Development commands and workflows
- Port assignments
- Import conventions
- Common patterns and anti-patterns

#### 2. gateflow-security
**Purpose:** Security architecture and best practices  
**Activates:** When implementing auth, handling sensitive data, or adding APIs  
**Key Knowledge:**
- JWT authentication flow
- Password hashing with Argon2id
- RBAC with 5 roles
- CSRF protection implementation
- Rate limiting patterns
- Field encryption (AES-256)
- QR code signing (HMAC-SHA256)
- API key authentication
- Multi-tenant security
- Mobile security (SecureStore, offline encryption)

#### 3. gateflow-database
**Purpose:** Database schema and query patterns  
**Activates:** When working with Prisma or database  
**Key Knowledge:**
- 14 core models and relationships
- Multi-tenant query patterns
- Soft delete conventions
- Audit trail implementation
- Performance optimization
- Migration workflows
- Common query patterns

#### 4. gateflow-testing
**Purpose:** Testing patterns and quality assurance  
**Activates:** When writing tests or debugging  
**Key Knowledge:**
- Jest configuration
- Unit test templates
- API route testing
- Multi-tenant isolation tests
- Soft delete behavior tests
- Mocking patterns (Prisma, Auth, APIs)
- Coverage goals (80%+)

#### 5. gateflow-mobile
**Purpose:** React Native and Expo patterns  
**Activates:** When working on mobile apps  
**Key Knowledge:**
- Offline-first architecture
- Encrypted queue implementation
- QR scanning with expo-camera
- SecureStore for tokens
- Location context handling
- Supervisor override UI
- Mobile-specific considerations

### Steering Rules Configuration

4 context-aware steering rules in `.kiro/steering/`:

#### 1. gateflow-conventions.md (Always Active)
**Enforces:**
- pnpm usage (never npm/yarn)
- Multi-tenancy requirements
- Soft delete patterns
- Security requirements
- Code quality standards

#### 2. prisma-queries.md (Auto-loads for *.ts)
**Provides:**
- Multi-tenant scoping examples
- Soft delete filter patterns
- Project scoping patterns
- Audit trail implementation
- Performance tips

#### 3. api-development.md (Auto-loads for **/api/**/*.ts)
**Provides:**
- API route structure template
- 8-point security checklist
- Error response patterns
- CSRF protection
- Rate limiting patterns

#### 4. component-development.md (Auto-loads for components)
**Provides:**
- Component structure templates
- Shared UI component usage
- Internationalization patterns
- Form handling patterns
- Tailwind conventions

### Hooks Configuration

6 automated workflows in `.kiro/hooks/`:

#### 1. lint-on-save.json
**Trigger:** File edited (*.ts, *.tsx, *.js, *.jsx)  
**Action:** Run `pnpm turbo lint`  
**Purpose:** Immediate linting feedback

#### 2. prisma-generate.json
**Trigger:** schema.prisma edited  
**Action:** Run `npx prisma generate`  
**Purpose:** Auto-regenerate Prisma client

#### 3. multi-tenant-check.json
**Trigger:** Before write operations  
**Action:** Verify organizationId scoping  
**Purpose:** Prevent data leakage

#### 4. security-review.json
**Trigger:** API route files edited  
**Action:** Review 6 security checks  
**Purpose:** Enforce security best practices

#### 5. test-after-feature.json
**Trigger:** After task completion  
**Action:** Run `pnpm turbo test`  
**Purpose:** Ensure tests pass

#### 6. typecheck-on-build.json
**Trigger:** Build command in prompt  
**Action:** Run `pnpm turbo typecheck`  
**Purpose:** Catch type errors early

---

## Team Roles & Required Skills

### Full-Stack Developer
**Primary Focus:** Client Dashboard, Admin Dashboard, Marketing Site

**Must Have:**
- TypeScript + React + Next.js 14
- Prisma + PostgreSQL
- JWT authentication
- Multi-tenant patterns
- Tailwind CSS

**Should Have:**
- Turborepo experience
- Testing with Jest
- API design
- Security best practices

**Kiro Skills:** architecture, security, database, testing

---

### Mobile Developer
**Primary Focus:** Scanner App, Resident Mobile App

**Must Have:**
- React Native + Expo SDK 54
- TypeScript
- Offline-first patterns
- SecureStore / AsyncStorage
- Camera / Location APIs

**Should Have:**
- Encryption (crypto-js)
- Queue-based sync
- EAS Build
- Push notifications

**Kiro Skills:** mobile, security, architecture

---

### Backend Developer
**Primary Focus:** API Routes, Database, Webhooks

**Must Have:**
- TypeScript + Node.js
- Prisma + PostgreSQL
- JWT + Argon2id
- Rate limiting
- Multi-tenant architecture

**Should Have:**
- Webhook delivery
- Queue systems
- Caching strategies
- Performance optimization

**Kiro Skills:** database, security, architecture, testing

---

### DevOps Engineer
**Primary Focus:** Deployment, Infrastructure, Monitoring

**Must Have:**
- Vercel deployment
- PostgreSQL management
- Environment configuration
- CI/CD pipelines
- Monitoring setup

**Should Have:**
- Turborepo optimization
- Redis (Upstash)
- EAS Build (Expo)
- Log aggregation

**Kiro Skills:** architecture

---

### QA Engineer
**Primary Focus:** Testing, Quality Assurance, Security

**Must Have:**
- Jest testing
- Multi-tenant testing
- Security testing
- API testing
- Mobile testing

**Should Have:**
- Automated testing
- Performance testing
- Accessibility testing
- Load testing

**Kiro Skills:** testing, security, architecture

---

## Onboarding Checklist

### For New Developers

#### Day 1: Setup
- [ ] Clone repository
- [ ] Install pnpm 8.x
- [ ] Install Node.js 18+
- [ ] Install PostgreSQL 15+
- [ ] Set up environment variables
- [ ] Run `pnpm install`
- [ ] Start all apps with `pnpm turbo dev`

#### Day 2: Documentation
- [ ] Read `CLAUDE.md`
- [ ] Read `docs/PROJECT_STRUCTURE.md`
- [ ] Read `docs/SECURITY_OVERVIEW.md`
- [ ] Review `.kiro/KIRO_SETUP.md`
- [ ] Explore Prisma schema

#### Day 3: Code Review
- [ ] Review client-dashboard structure
- [ ] Study API route patterns
- [ ] Understand auth flow
- [ ] Review database queries
- [ ] Check test examples

#### Day 4: Hands-On
- [ ] Create a test organization
- [ ] Create gates and QR codes
- [ ] Test scanner app
- [ ] Review scan logs
- [ ] Test webhooks

#### Day 5: First Contribution
- [ ] Pick a small bug or feature
- [ ] Create feature branch
- [ ] Implement with tests
- [ ] Submit PR for review
- [ ] Address feedback

### For AI Agents

#### Initial Setup
- [ ] Skills loaded from `.kiro/skills/`
- [ ] Steering rules active in `.kiro/steering/`
- [ ] Hooks configured in `.kiro/hooks/`
- [ ] Access to project documentation

#### Verification
- [ ] Test multi-tenant check hook
- [ ] Test security review hook
- [ ] Verify steering rules load
- [ ] Confirm skills accessible

---

## Skill Assessment

### Junior Developer (0-2 years)
**Can work on:**
- UI components
- Simple API routes
- Documentation updates
- Bug fixes

**Requires supervision for:**
- Multi-tenant queries
- Security implementations
- Database migrations
- Mobile features

### Mid-Level Developer (2-5 years)
**Can work on:**
- Complex features
- API design
- Database schema changes
- Mobile app features
- Testing strategies

**Requires supervision for:**
- Architecture decisions
- Security audits
- Performance optimization
- Production deployments

### Senior Developer (5+ years)
**Can work on:**
- Architecture design
- Security implementation
- Performance optimization
- Production deployments
- Team mentoring
- Code reviews

**Independent on:**
- All aspects of development
- Technical decisions
- Best practices enforcement

---

## Training Resources

### Internal Documentation
- `CLAUDE.md` - Complete guide
- `docs/PROJECT_STRUCTURE.md` - Architecture
- `docs/SECURITY_OVERVIEW.md` - Security
- `docs/DEVELOPMENT_GUIDE.md` - Setup
- `.kiro/skills/` - Domain expertise
- `.kiro/steering/` - Conventions

### External Resources
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Expo: https://docs.expo.dev
- Turborepo: https://turbo.build/repo/docs
- React Native: https://reactnative.dev/docs

### Security Resources
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- JWT Best Practices: https://tools.ietf.org/html/rfc8725
- Multi-Tenant Security: Internal docs

---

## Success Criteria

### For Developers
- [ ] Can set up local environment independently
- [ ] Understands multi-tenant patterns
- [ ] Follows soft delete conventions
- [ ] Writes secure API routes
- [ ] Includes tests with features
- [ ] Updates documentation
- [ ] Passes code review

### For AI Agents
- [ ] Skills load correctly
- [ ] Steering rules apply automatically
- [ ] Hooks execute on triggers
- [ ] Multi-tenant checks pass
- [ ] Security reviews complete
- [ ] Code follows conventions
- [ ] Tests run successfully

---

## Contact & Support

### For Questions
- Architecture: Review `docs/PROJECT_STRUCTURE.md`
- Security: Review `docs/SECURITY_OVERVIEW.md`
- Database: Review `packages/db/prisma/schema.prisma`
- Kiro: Review `.kiro/KIRO_SETUP.md`

### For Issues
- Code issues: Create GitHub issue
- Security concerns: Contact security team
- Kiro configuration: Review `.kiro/` directory

---

**Last Updated:** February 25, 2026  
**Maintained By:** Engineering Team  
**Review Frequency:** Quarterly or when major changes occur
