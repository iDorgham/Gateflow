# Workspace Installation

Use this folder as the installation entry point for the workspace operating system.

## Template Root

- Reusable project scaffold: `../template-project/`
- Full installation playbook: `./TEMPLATE_INSTALLATION.md`

## Install Order

1. Read `../README.md` (hub)
2. Apply contracts from `../contracts/`
3. Apply templates from `../templates/`
4. Configure planning via `../systems/PLAN_SYSTEM.md`
5. Wire automation via `../automation/AUTOMATIONS.md` and `../automation/GITHUB_AUTOMATION.md`
6. Configure security via `../automation/GITHUB_SECURITY.md`
7. Validate cache/memory setup using `../systems/CACHE_LAYER.md` and `../systems/MEMORY_LAYER.md`
8. Use bootstrap prompt from `../bootstrap/NEXT_PROJECT_PROMPT.md`

## Validation Checklist

- Workspace docs exist and are linked.
- Changelog format/check scripts are installed.
- CI includes changelog/security gates.
- MCP setup is documented.
- MVP roadmap has phased prompts.
