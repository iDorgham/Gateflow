---
name: clis
description: Run a predefined CLI team: seo (content), refactor (code), audit (review). Kilo is master; definitions in docs/plan/learning/CLI_TEAMS.md.
---

# /clis — CLI Teams

Use `/clis` to coordinate multiple external CLIs for specialized tasks. Kilo acts as the master orchestrator.

## What `/clis` does

- **Teams** — Run predefined CLI teams for specific purposes
- **Orchestration** — Kilo coordinates multiple CLIs in sequence or parallel
- **Results aggregation** — Collect and summarize results from all CLIs

## Available Teams

| Team | Purpose | CLIs |
|------|---------|------|
| `seo` | Content optimization | seo-cli, lighthouse, etc. |
| `refactor` | Code refactoring | eslint, prettier, etc. |
| `audit` | Code review | sonarqube, snyk, etc. |

## How to use it

- `/clis team` — List available teams
- `/clis <team>` — Run a specific team (e.g., `/clis seo`)
- `/clis <team> --files <paths>` — Run team on specific files

## Implementation notes

- Definitions live in `docs/plan/learning/CLI_TEAMS.md`
- Kilo is always the master orchestrator
- Results are aggregated and presented to user
- After any CLI team usage, append entry to `docs/plan/learning/CLI_USAGE_AND_RESULTS.md`

---

# CLI Teams

Coordinated CLI execution for specialized tasks.

## Purpose

- Execute multiple CLIs in coordinated fashion
- Automate repetitive tasks across codebases
- Aggregate results from diverse tools

## Teams

### SEO Team
Content optimization and search engine optimization.

### Refactor Team
Code cleanup, formatting, and linting.

### Audit Team
Security scanning, code quality, and compliance.

## Instructions

1. Read `docs/plan/learning/CLI_TEAMS.md` for team definitions.
2. Determine which team matches the task.
3. Execute CLIs in the defined order.
4. Aggregate results.
5. Report findings to user.
6. Log usage to `docs/plan/learning/CLI_USAGE_AND_RESULTS.md`.

## When to use

- User wants automated code cleanup ("refactor this")
- User wants SEO analysis ("optimize content")
- User wants security/compliance audit ("audit this code")
- Need multiple CLI tools coordinated together
