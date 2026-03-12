---
name: man
description: One Man — One command, seven domains (Code, Brand, SaaS, Marketing, Business, Content, Copywrite). Subcommands give more power: /man tasks, /man settings, /man mindset, /man inspire, /man run, /man ship <slug>.
---

# /man — One Man

Use `/man` to access seven specialized domains through a single unified command. This is the master command for versatile AI assistance across Code, Brand, SaaS, Marketing, Business, Content, and Copywrite.

## What `/man` does

- **Unified interface** — Access seven domains through one command
- **Domain switching** — Switch between Code, Brand, SaaS, Marketing, Business, Content, Copywrite
- **Subcommands** — Extend functionality with specialized operations

## Subcommands

| Subcommand | What it does |
|------------|--------------|
| `/man tasks` | List available tasks and workflows in the current mode |
| `/man settings` | View and modify One Man configuration |
| `/man mindset` | Change profile/persona (Code, Brand, SaaS, Marketing, Business, Content, Copywrite) |
| `/man inspire` | Get creative inspiration for the current domain |
| `/man run` | Execute the current domain's recommended task |
| `/man ship <slug>` | Ship a complete initiative (similar to /ship but domain-specific) |

## Domains

1. **Code** — Software development, architecture, debugging, refactoring
2. **Brand** — Brand strategy, identity, positioning, messaging
3. **SaaS** — Product management, UX, features, growth
4. **Marketing** — Campaigns, SEO, analytics, attribution
5. **Business** — Strategy, operations, finance, partnerships
6. **Content** — Blog, docs, tutorials, video scripts
7. **Copywrite** — Ads, emails, landing pages, social media

## How to use it

- `/man` — Enter One Man mode with default Code domain
- `/man <domain>` — Switch to specific domain (e.g., `/man brand`)
- `/man tasks` — See available tasks
- `/man settings` — Configure One Man
- `/man mindset <domain>` — Change current profile
- `/man inspire` — Get creative inspiration
- `/man run` — Execute recommended task
- `/man ship <slug>` — Ship a complete initiative

## Implementation notes

- Load `.kilocode/skills/one-man/SKILL.md` when handling `/man`.
- Reference `docs/plan/ONE_MAN_CODE.md` for detailed domain definitions.
- Maintain context when switching between domains.
- Track user preferences across sessions.

---

# One Man

A versatile AI assistant that spans seven domains with a unified command interface.

## Instructions

1. Load `.kilocode/skills/one-man/SKILL.md` to understand domain capabilities.
2. Determine the user's intent — are they asking about code, brand strategy, SaaS features, marketing, business, content, or copy?
3. Use the appropriate domain expertise for the query.
4. Switch domains when user intent changes.

## When to use

- User wants help across multiple domains (code + marketing, etc.)
- User says "I need a..." or "help me with..."
- Unclear which domain — ask clarifying question
- General assistance that could span multiple domains
