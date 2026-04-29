# Contracts — platform_evolution

## Multi-Tenancy (MANDATORY)

- `organizationId` on every tenant query.
- `deletedAt: null` for soft-deleted models.
- GateFlow CRM leads are **global** (no `organizationId`) — they track companies wanting to buy GateFlow.

## Auth & RBAC

- No data without server-side session check.
- All `/api/**` routes check user role against the RBAC matrix (see `CONTEXT_platform_evolution.md` §2).
- Return `403` for unauthorized access. Never expose data via error messages.

## PII & Data Privacy

- `Lead.email` and `Lead.phone` encrypted at rest (AES-256-GCM).
- Never send raw PII (email, phone, name) to LLM APIs. Use metadata tiers only.
- `Lead.consentGiven` must be `true` before AI can generate outreach.
- Comply with Saudi PDPL, UAE PDPPL, and GDPR for MENA market data.

## AI Safety (Human-in-the-Loop)

- All AI-driven actions logged in `AiActionLog` with `PENDING_CONFIRMATION`.
- AI actions require human confirmation before external impact (emails, publishing, scoring).
- Bot-created tasks require approval unless `autoExecute` is explicitly enabled.
- Rate limit: max 10 bot tasks per rule per hour.

## CMS Publishing

- Content status flow: `DRAFT` → `IN_REVIEW` → `READY_TO_PUBLISH` → `PUBLISHED`.
- Publish triggers ISR revalidation webhook to `apps/marketing`.
- Webhook uses shared `REVALIDATE_SECRET` for auth.

## Style Hub Security

- PostMessage iframe listener validates `event.origin` matches admin dashboard domain.
- Only whitelisted `@gateflow/tokens` CSS variables are overridable.
- WCAG 2.1 AA (4.5:1 contrast) enforced — block save on violation.

## Reference files

- `.antigravity/contracts/CONTRACTS.md`
- `docs/guides/SECURITY_OVERVIEW.md`
- `.agents/skills/security/SKILL.md`
