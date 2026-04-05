# Prompt

Generate pro prompts for phases. Load phase prompt or create from template.

## Instructions

1. If phase exists: load `docs/plan/Complete/PROMPT_<plan>_phase_<N>.md`.
2. If creating new: use `.antigravity/templates/TEMPLATE_PROMPT_phase.md`.

## Usage

- `/prompt phase 2` — load Phase 2 for default plan (mvp_resident)
- `/prompt create phase 3 for mvp_resident` — create PROMPT_mvp_resident_phase_3.md from template

## Template

`.antigravity/templates/TEMPLATE_PROMPT_phase.md` → save to `docs/plan/Complete/PROMPT_<plan>_phase_<N>.md`
