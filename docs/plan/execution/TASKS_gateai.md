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

## Phase 2: Scoped Context Injection + Simple Real Q&A 🔄
- [ ] Implement prompt engineering for organization context
- [ ] Create data gathering helpers for project/gate stats
- [ ] Verify AI can answer "How many gates in this project?"

## Phase 3: Inline Recharts Visuals from Analytics [ ]
- [ ] Create dynamic chart renderer component
- [ ] Implement AI-to-Chart payload parsing
- [ ] Verify charts appear in chat thread

## Phase 4: One-Shot Report Generation (PDF/CSV) [ ]
- [ ] Implement report generation service
- [ ] Add PDF and CSV export tools to AI agent
- [ ] Verify download links are generated in chat

## Phase 5: Scheduling Engine Skeleton + AiTask Model [ ]
- [ ] Update Prisma schema with `AiTask` model
- [ ] Implement basic cron/background task runner
- [ ] Verify task creation via database

## Phase 6: Mutation Safety Layer + Confirmation UX [ ]
- [ ] Implement "Confirm & Execute" UI pattern
- [ ] Create mutation middleware for AI tools
- [ ] Verify no unsafe tool runs without user click

## Phase 7: Bulk QR Creation Agent – MVP [ ]
- [ ] Implement QR creation function calling
- [ ] Add preview table for bulk creation
- [ ] Verify bulk creation after manual confirmation

## Phase 8: Feedback, Usage Tracking, Rate Limiting & Polish [ ]
- [ ] Implement `AiActionLog` for audit trails
- [ ] Add cost tracking and rate limiting (Upstash)
- [ ] Verify usage dashboard and feedback buttons

## Phase 9: Resident Portal / Mobile Mini-Version [ ]
- [ ] Port chat UI to Resident Portal (React)
- [ ] Port simplified AI to Resident Mobile (Expo)
- [ ] Verify guest QR creation via voice/chat on mobile

## Phase 10: Hardening, Red-Teaming & Monitoring [ ]
- [ ] Conduct security audit of all AI tools
- [ ] Finalize audit trail and monitoring alerts
- [ ] Verify red-team compliance (org-scoping etc.)
