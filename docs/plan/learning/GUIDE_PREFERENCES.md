# Guide preferences (how /guide should adapt to you)

The workspace guide (`/guide`, gf-guide skill) reads this file when it exists and **adapts its behavior** to your preferences. Edit it over time so the guide learns how you like to work.

**Location:** `docs/plan/learning/GUIDE_PREFERENCES.md`

When you say things like “I prefer short answers” or “always give me copy-paste prompts,” the agent can suggest adding them here. Future `/guide` runs will then follow these preferences.

---

## Tone & length

- **Default:** Concise bullets; 1–3 items per section unless the situation is complex.
- **Your preference:** *(edit below or leave blank to keep default)*
  - e.g. “Always concise; avoid long paragraphs.”
  - e.g. “When I ask for prompts, give full copy-paste text and say where to copy from.”

---

## What to emphasize

- **Your priority order for Must do / Recommended / Critical / Improvements:** *(edit if you want a fixed order or emphasis)*
  - e.g. “Critical (security) first, then Must do, then Recommended.”
  - e.g. “I care most about Recommended next steps; keep Must do minimal.”

---

## Recurring needs (learned from our conversations)

- **Copy-paste prompts:** When the user asks for a “professional prompt” or “prompt to copy,” point to `docs/plan/execution/PROMPTS_REFERENCE.md` and say exactly which line to start copying from (e.g. “Copy from the line **Request:**”).
- *(Add more below as you discover what you want the guide to always do.)*
  - Example: “When discussing /plan for security initiatives, remind to load gf-security and reference CONTRACTS.md in phase prompts.”

---

## Format preferences

- **Pre-flight:** Offer “1 — Proceed” / “2 — Do suggestions first” when something should be done first. *(Keep / change / add)*
- **Post-task summary:** Optional short block (Must do, Recommended, Critical, Improvements). *(e.g. “Always give post-task summary” or “Only when I ask”)*

---

## Notes (free-form)

Use this space for anything else you want the guide to remember (e.g. “I work mainly on client-dashboard,” “I prefer branch names like feat/xxx,” “Always mention PROMPTS_REFERENCE.md when talking about /plan”).
