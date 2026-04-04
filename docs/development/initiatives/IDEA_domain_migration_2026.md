# IDEA: Domain Migration to .site (2026)

Initiative: `domain_migration_2026`
Status: **REFINE**

## Problem

The project is moving from the `.io` TLD to the `.site` TLD for all public and internal applications to align with new branding and regional strategy.

## Vision

Achieve 100% consistency across codebase, documentation, and metadata for the new domain structure.

## Domains Mapping

| App           | Old Domain              | New Domain              |
| :------------ | :---------------------- | :---------------------- |
| Marketing     | `gateflow.site`         | `gateflow.site`         |
| Client App    | `app.gateflow.site`     | `app.gateflow.site`     |
| Admin App     | `admin.gateflow.site`   | `admin.gateflow.site`   |
| Portal App    | `portal.gateflow.site`  | `portal.gateflow.site`  |
| Support Email | `support@gateflow.site` | `support@gateflow.site` |
| System Email  | `noreply@gateflow.site` | `noreply@gateflow.site` |

## Constraints

- Must not break HMAC verification (QR signature) if the domain is part of the payload.
- Must update all 6 apps and shared packages.
- Must update all 150+ markdown files in `docs/`.

## Success Criteria

- [ ] `grep -r "gateflow.site" .` returns 0 results (excluding `node_modules`).
- [ ] All functional links in dashboards point to `.site`.
- [ ] All documentation (PRD, Guides, Plans) reflects the new domain.
- [ ] AI Memory is updated and persistent.

## Risks

- Hardcoded URLs in existing data (e.g. QR records in DB) might need a migration script.
- SSL/TLS configuration on Vercel needs manual adjustment (out of scope for AI).
