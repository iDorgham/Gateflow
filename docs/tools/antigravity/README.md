# Antigravity Command Prompts & Tooling Guide

<div align="center">

**Multi-Tool AI Orchestration for GateFlow (Antigravity, Cursor, Claude CLI, Opencode, Kilo, Kiro)**

</div>

---

## Command Files

| File                        | Purpose                                            |
| :-------------------------- | :------------------------------------------------- |
| `commands/guide.md`         | Workspace guide — Must do / Recommended / Critical |
| `commands/design-mode.md`   | UI/UX design brief + layout + token + motion       |
| `commands/prompt-writer.md` | Generate phase or CLI prompts                      |

---

## Multi-Tool Ecosystem & Synchronization

GateFlow AI configurations are canonically maintained under `.agents/` (or symlinked `.antigravity/`). Running `pnpm sync` (`scripts/ai-sync/sync-ai-tools.sh`) automatically synchronizes workflows, skills, agents, and rules across:

- **Cursor IDE** (`.cursor/`)
- **Antigravity IDE** (`.antigravity/` / `.agents/`)
- **Claude CLI** (`.claude/`)
- **Opencode CLI** (`.opencode/`)
- **Kiro CLI** (`.kiro/`)
- **Kilo CLI** (`.kilo/`)

---

## GateFlow Core Invariants

All prompts and tool operations strictly adhere to GateFlow architecture invariants:

1. **Package Management**: Strictly `pnpm` (`v9.x`).
2. **Multi-Tenancy**: Unconditional `organizationId` scoping on all queries and mutations.
3. **Cryptographic Integrity**: HMAC-SHA256 signing for all physical and visitor QR passes.
4. **Design Tokens**: 100% adherence to `@gateflow/ui/tokens` (`nativeTokens` for React Native, CSS variables for web).
5. **Quality Gate**: `pnpm preflight` must pass 100% green before commits and releases.
