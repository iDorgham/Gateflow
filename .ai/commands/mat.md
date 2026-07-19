---
type: command-registry
tier: OMEGA
version: 1.1.0
compliance: Law 151/2020
traceability: ISO-8601 Certified
---

# `/mat`

**Mat**erialize a new workspace from an industrial template under `workspaces/templates/` into `workspaces/clients/` or `workspaces/personal/`.

## Flow (interactive terminal)

Run from the **AIWF repository root** (where `workspaces/templates/` exists):

```bash
bash .ai/scripts/factory_materialize.sh
# equivalent:
# bash .ai/scripts/bin/materialize.sh
```

The script **prints** templates with indices, then asks **in order**:

1. **Template** — type an **index** (`0`…`n-1`) **or** the **folder name** (e.g. `CORE_OS_SAAS`). Case-insensitive.  
   - **Substring** match is allowed only if it resolves to **one** template (e.g. `saas` → `CORE_OS_SAAS`).  
   - If several folders match, it stops and asks you to be more specific or use the index.

2. **Layer** — type **`0`** or **`clients`** (production / MENA-locked tier), or **`1`** or **`personal`** (R&D). Aliases: `client`, `mena-locked` → clients; `private`, `rnd`, `rd` → personal.

3. **New workspace name** — final prompt: **slug** for the new folder under that layer (e.g. `my_saas`).

`FACTORY_ROOT` is discovered by walking up from the script until `workspaces/templates` is found (no hardcoded path).

## Notes

- Same engine as **`/factory materialize`** — shorter slash for daily use.
- Use Cursor **Terminal** (or any TTY); chat stdin is not reliable for `read`.
- After success: open the new folder in Cursor and continue shard onboarding (e.g. `/git onboard` if defined there).

## Sovereign protocol

- **Agent**: factory_orchestrator  
- **Gate**: Omega Gate v2  
- **Traceability**: new shard gets `git init` + initial commit after copy  
