# Workspace Template Installation Guide

Use this guide to install the workspace template into a new project repository.

## 1) Copy Template Root

Copy `docs/workspace/template-project/` contents to the new repo root:

- `docs/`
- `plan/`
- `assets/`
- `.cursor/`
- `scripts/`

## 2) Install Workspace Operating System

1. Add workspace docs from `docs/workspace/` (hub + indexes + systems docs).
2. Install rules/agents/subagents/skills/commands into `.cursor/`.
3. Install contracts and templates packs.
4. Install automation scripts and wire package scripts.
5. Add GitHub workflows (CI, deploy, release, labels, security, sync).

## 3) Initialize Planning

1. Create first idea in `plan/context/IDEA_<slug>.md`.
2. Create `PLAN_<slug>.md` and phased prompts.
3. Move through plan lifecycle folders as work progresses.

## 4) Validate Installation

- Changelog format/check scripts pass.
- CI includes security + changelog checks.
- MCP config and required servers are documented.
- Workspace docs link all major sections.
