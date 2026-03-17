# Pro Prompt — Phase 4: One-Shot Report Generation (PDF/CSV download)

**Primary role:** BACKEND-API
**Preferred tool:** Cursor

### Goal
Allow users to request and download PDF or CSV reports through natural language.

### Steps
1. Implement report generation utility (using `jspdf` or server-side rendering to PDF).
2. Create `api/ai/reports/generate` endpoint.
3. Teach Gemini to call the "generateReport" tool when a user asks for an export.
4. Implement a "Report Download" card type in the chat UI.
5. Run `pnpm turbo test`.
6. `/github` — feat(gateai): phase 4 — PDF/CSV report generation.
