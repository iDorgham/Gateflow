# Antigravity Command Prompts

Copy-paste prompts and command files for use in **Antigravity IDE** (Gemini) or other CLIs. Wire these into IDE macros if your tool supports it.

## Command files

| File | Purpose |
|------|---------|
| `commands/guide.md` | Workspace guide — Must do / Recommended / Critical / Improvements |
| `commands/design-mode.md` | UI/UX design brief + layout + token + motion + responsive plan |
| `commands/prompt-writer.md` | Generate phase or CLI prompts from a short description |

## Usage

1. Open the `.md` file and copy the prompt block.
2. Paste into Antigravity chat (or Gemini CLI, Claude CLI, etc.).
3. Replace any placeholders (e.g. `[Describe...]`, `[E.g....]`) with your actual input.
4. The model will read the referenced files and produce the output.

## Copy-paste reference

All prompts are also listed in `docs/plan/execution/PROMPTS_REFERENCE.md` with "Where to copy from" guidance.

## GateFlow rules

All prompts assume GateFlow context: pnpm only; multi-tenant (organizationId); soft deletes (deletedAt null); QR HMAC-SHA256. See `CLAUDE.md`.
