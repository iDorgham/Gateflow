# IDEA_gateai.md

GateFlow — Intelligent Operations Agent (GateAI)

**Vision:** GateAI is a secure, organization-scoped natural-language agent embedded in the Client Dashboard and Resident Portal. It allows users to ask questions about data, generate reports, and perform bulk intelligent actions (like QR creation) with explicit confirmation and strict multi-tenancy.

## Core Features

- **Read-Only Intelligence:** Q&A on scans, visitors, units. Inline Recharts visuals.
- **Scheduled Reporting:** Automated PDF/CSV exports (daily/weekly/monthly).
- **Intelligent Mutations:** Bulk QR creation from natural language (e.g., "Create 120 guests QRs for Friday").
- **Safety & Audit:** Full logging in `AiActionLog`. Confirmation required for all mutations.

## Success Metrics

- 40% dashboard adoption.
- 80% success rate on common intents.
- Reduction in manual report/QR creation time by >90%.

## Technical Stack

- Gemini 1.5 Flash (Function Calling).
- Vercel AI SDK.
- Upstash Redis (Scheduling/Rate Limiting).
- Prisma Multi-tenancy (orgId/deletedAt).
