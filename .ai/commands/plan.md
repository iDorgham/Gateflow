---
type: command-registry
tier: OMEGA
version: 19.0.0
compliance: Law 151/2020
traceability: ISO-8601 Certified
---

# `/plan`

Discovery, blueprinting, and SDD phase management

## 📋 Subcommands

| Subcommand | Purpose | Usage |
|------------|---------|-------|
| `discovery` | Interrogate requirements | `/plan discovery --type=dev\|content\|social` |
| `blueprint` | Generate high-density SDD specs (5-10/phase) | `/plan blueprint --path=.ai/plan/development/` |
| `status` | Phase progress & compliance | `/plan status --deep` |
| `adr` | Generate Architecture Decisions | `/plan adr --id=ADR-001` |
| `review` | Stakeholder consensus | `/plan review --phase=singularity` |

## 📐 SDD Methodology (Tripartite)
The planning engine now operates across three distinct industrial streams in `.ai/plan/`:
1. **`/development`**: Core technical architecture, shards, and infrastructure.
2. **`/content`**: High-fidelity content strategy, SEO, and legal copywriting.
3. **`/social`**: Social media orchestration and brand-voice distribution.

### 🛡️ Industrial Rules (OMEGA-Tier)
- **MVP Priority**: New projects **MUST** initiate with phase `00-mvp`.
- **Density Gate**: Each phase must materialize at least **5 to 10 specifications** (API, State, Security, etc.).

## 🛡️ Sovereign Protocol
- **Agent**: factory_orchestrator
- **Gate**: Omega Gate v2
- **Traceability**: Appends Reasoning Hash to .ai/logs/factory.jsonl
- **Compliance**: Egyptian Law 151/2020 Certified
