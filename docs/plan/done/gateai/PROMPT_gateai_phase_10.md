# Pro Prompt — Phase 10: Hardening, Red-Teaming & Monitoring

**Primary role:** SECURITY
**Preferred tool:** Multi-CLI (Claude + Gemini + Cursor)

### Goal
Final security pass and performance hardening before production launch.

### Steps
1. Audit all `AiActionLog` entries for any PII leaks.
2. Stress test rate limits and token headers.
3. Perform "red-team" attacks (jailbreaking Gemini prompts) and harden system prompt.
4. Verify all multi-tenant invariants.
5. `/github` — feat(gateai): phase 10 — final hardening.
