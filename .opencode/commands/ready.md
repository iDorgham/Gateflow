---
description: Pre-development checklist - verify dependencies and environment
agent: build
---

Run the pre-development checklist:

1. Check if pnpm is installed and version
2. Verify node version matches project requirements
3. Check if .env.local files exist in apps
4. Verify DATABASE_URL is set
5. Run prisma generate to ensure client is up to date
6. Check git status for any uncommitted changes

Report any issues found.
