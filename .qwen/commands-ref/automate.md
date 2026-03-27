# Automate

Full phased flow. **Run `/ready` first** before `/run`. Use **`/run all`** for full automation.

## Pre-dev

`/ready` — push everything, run preflight, confirm ready before development.

## Single phase

`/run` — one phase: implement → test → github, then stop.

## Full automation

`/run all` — all phases: loop until plan complete. No confirmation between phases.

## Manual flow

1. `/plan` — create plan
2. `/prompt phase N` — load phase prompt
3. Implement (subagents: explore, shell, browser-use; MCP: Prisma-Local, Context7)
4. `pnpm preflight`
5. `/github` — git add, commit, pull, push

