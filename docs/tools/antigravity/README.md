# Antigravity Command Prompts

<div align="center">

**Copy-paste prompts for Antigravity IDE (Gemini) or other CLIs**

_Wire into IDE macros if your tool supports it_

</div>

---

## Command Files

| File                        | Purpose                                            |
| :-------------------------- | :------------------------------------------------- |
| `commands/guide.md`         | Workspace guide — Must do / Recommended / Critical |
| `commands/design-mode.md`   | UI/UX design brief + layout + token + motion       |
| `commands/prompt-writer.md` | Generate phase or CLI prompts                      |

---

## Usage

1. Open the `.md` file and copy the prompt block
2. Paste into Antigravity chat (or Gemini CLI, Claude CLI, etc.)
3. Replace placeholders (e.g., `[Describe...]`, `[E.g....]`) with your input
4. The model reads referenced files and produces output

---

## Copy-Paste Reference

All prompts are also listed in `docs/guides/PROMPTS_REFERENCE.md` with "Where to copy from" guidance.

---

## GateFlow Rules

All prompts assume GateFlow context:

- pnpm only
- Multi-tenant (organizationId)
- Soft deletes (deletedAt null)
- QR HMAC-SHA256

See `CLAUDE.md` for full details.

---

<div align="center">

[Return to Docs Root](../../docs/README.md)

</div>
