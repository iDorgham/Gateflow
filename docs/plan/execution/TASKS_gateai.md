# TASKS_gateai: GateFlow Intelligent Operations Agent

## Phase 0: Ready & /ai Page Scaffold ✅

- [x] Create `/app/[locale]/dashboard/ai/page.tsx` skeleton
- [x] Update sidebar navigation with GateAI link
- [x] Choose Phosphor `Sparkles` icon
- [x] Add i18n keys for sidebar groups and labels
- [x] Verify layout and branding ("mediaBubble AI")

## Phase 1: Basic Read-Only Chat + Gemini 1.5 Flash Hello World ✅

- [x] Create `/api/ai/chat/route.ts` with Gemini integration
- [x] Implement `useChat` hook in AI Hub page
- [x] Implement streaming UI response
- [x] Verify basic "Hello World" from AI

## Phase 2: Scoped Context Injection + Simple Real Q&A ✅
- [x] Implement prompt engineering for organization context
- [x] Create data gathering helpers for project/gate stats
- [x] Verify AI can answer "How many gates in this project?"

## Phase 3: Inline Recharts Visuals from Analytics ✅

- [x] Create dynamic chart renderer component
- [x] Implement AI-to-Chart payload parsing
- [x] Verify charts appear in chat thread

## Phase 4: One-Shot Report Generation (PDF/CSV) ✅

- [x] Implement report generation service
- [x] Add PDF and CSV export tools to AI agent
- [x] Verify download links are generated in chat

## Phase 5: Scheduling Engine Skeleton + AiTask Model ✅

- [x] Update Prisma schema with `AiTask` model
- [x] Implement basic cron/background task runner
- [x] Verify task creation via database

## Phase 6: Mutation Safety Layer + Confirmation UX ✅

- [x] Implement "Confirm & Execute" UI pattern
- [x] Create mutation middleware for AI tools
- [x] Verify no unsafe tool runs without user click
- [x] Audit ALL AI actions in `AiActionLog`

## Phase 7: Bulk QR Creation Agent – MVP ✅

- [x] Implement QR creation function calling
- [x] Add preview table for bulk creation
- [x] Integrate with secure mutation flow
- [x] Verify bulk creation in DB

## Phase 8: Feedback, Usage Tracking, Rate Limiting & Polish ✅

- [x] Interaction logging for all chat sessions
- [x] Token usage tracking and cost estimation
- [x] Thumbs up/down feedback loop
- [x] Upstash rate limiting (20 req/min)
- [x] Verify usage dashboard

## Phase 9: Resident Portal / Mobile Mini-Version [ ]

- [ ] Port chat UI to Resident Portal (React)
- [ ] Port simplified AI to Resident Mobile (Expo)
- [ ] Verify guest QR creation via voice/chat on mobile

## Phase 10: Hardening, Red-Teaming & Monitoring [ ]

- [ ] Conduct security audit of all AI tools
- [ ] Finalize audit trail and monitoring alerts
- [ ] Verify red-team compliance (org-scoping etc.)
