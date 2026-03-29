# PLAN: Docs Workspace Template Cursor Bootstrap

**Slug:** `docs_workspace_template_cursor_bootstrap`
**Status:** done
**Created:** 2026-03-27
**Completed:** 2026-03-27

## Overview

Bootstrap the template project's `.cursor` system with essential rules, agents, subagents, skills, and a one-command installer that runs `INSTALL_PROMPT.md` and self-removes after successful installation.

## Phases

| #   | Phase                                                        | Tool   | Status |
| --- | ------------------------------------------------------------ | ------ | ------ |
| 1   | Phase 1: Essential `.cursor` bootstrap + one-command install | cursor | [x]    |
| 2   | Phase 2: Optional short installer and polish docs            | cursor | [x]    |

## Technical Constraints

- Keep bootstrap minimal and reusable.
- Avoid `gf_` prefixes in template artifact names.
- Keep install flow deterministic and one-time by removing command post-install.
