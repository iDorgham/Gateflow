# IDEA: Admin Emulation Hub & Advanced Seeding

## Problem

The current emulation system (v3) is focused on single-organization traffic simulation. Platform administrators need a centralized "Command Center" or "Hub" in the Admin Dashboard to perform large-scale organizational seeding (beyond just traffic), monitor execution across the platform, and manage advanced simulation parameters across multiple projects and gates.

## Vision

Transform the simple Traffic Emulation wizard into a robust **Admin Emulation Hub**. This hub will provide:

1. **Advanced Seeding Settings**: Template-based creation of entire tenant hierarchies (Phases, Buildings, Units, Residents, Staff) with high-density datasets.
2. **Emulation Control Panel**: A real-time dashboard to monitor ongoing "Rush Hour" simulations, view execution logs (from `AiActionLog`), and manage platform-wide stress testing.
3. **Batch Operations**: Support for multi-tenant emulation runs.
4. **Data Management**: Tools to "Wipe & Re-Seed" specific test tenants to maintain a clean demo/testing environment.

## Constraints & Requirements

- **Security**: Must remain restricted to Super Admins (`ADMIN_ACCESS_KEY`).
- **ADS Compliance**: High-density UI using Atlassian Design System tokens.
- **Auditing**: Every action must be recorded in the immutable `AiActionLog`.
- **Performance**: Large-scale seeding must be optimized (batch inserts) to avoid database locks.

## Success Criteria

- [ ] Admin can seed a complete Organization hierarchy in < 5 seconds.
- [ ] Admin can monitor real-time "Traffic Generation" progress from a centralized panel.
- [ ] Support for "Global Stress Test" mode (simultaneous traffic across all active orgs).
- [ ] Full RTL/Arabic localization for all advanced settings.

## Risks

- **Data corruption**: Accidental seeding into production tenants (mitigated by `organizationId` validation and mandatory "Dry Run" first).
- **Rate limiting**: Exhausting serverless execution time (mitigated by backgrounding long runs if supported, or chunking).
