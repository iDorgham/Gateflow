---
type: command-registry
tier: OMEGA
version: 19.0.0
compliance: Law 151/2020
traceability: ISO-8601 Certified
---

# `/library`

The `/library` command suite manages reusable components, knowledge artifacts, and factory protocols.

## 📋 Subcommands

| Subcommand | Purpose | Usage |
|------------|---------|-------|
| `create` | Guided component generation | `/library create --type=agent\|skill` |
| `scan` | Deep inspection for drift | `/library scan --deep` |
| `test` | Validate components & contracts | `/library test --type=skill` |
| `fix` | Auto-remediate failures | `/library fix --auto` |
| `improve` | Optimize component performance | `/library improve --target=id` |
| `check` | Audit naming & structural integrity | `/library check --fix` |
| `agent` | Manage agent lifecycle | `/library agent --action=list` |
| `skill` | Manage skill lifecycle | `/library skill --action=list` |
| `rule` | Manage policy enforcement | `/library rule --action=validate` |
| `profile` | Manage library profiles | `/library profile --action=list` |
| `maintain` | Background upkeep & optimization | `/library maintain --action=rebuild` |
| `report` | Generate component reports | `/library report --type=health` |
| `help` | Context-aware teaching engine | `/library help [--topic]` |

## 🛡️ Sovereign Protocol
- **Agent**: library_curator / registry_guardian
- **Gate**: Omega Gate v2
- **Traceability**: Appends Reasoning Hash to .ai/logs/factory.jsonl
- **Compliance**: Egyptian Law 151/2020 Certified
