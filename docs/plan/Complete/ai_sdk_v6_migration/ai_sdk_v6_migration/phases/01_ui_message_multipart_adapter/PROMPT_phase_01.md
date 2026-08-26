# Phase 1: Multi-Part `UIMessage` Data Transformers & Adapter

## Primary Role

BACKEND-API / ARCHITECTURE

## Tool Selection

- **Tool 1**: Cursor IDE (Multi-part parser & stream transformer)
- **Tool 2**: Opencode CLI (Transformer unit tests)

## Context

- **Focused Apps**: `apps/client-dashboard`, `apps/admin-dashboard`
- **Scope**: Multi-part stream parser, `UIMessage` normalization, legacy message fallback converter.
- **Packages**: `@gate-access/ui`, `@gate-access/types`.

## Goal

Build the universal multi-part message data transformer that parses AI SDK v6 stream chunks into structured `UIMessage` parts (`text`, `tool-invocation`, `reasoning`).

## Scope (In)

1. Multi-part parser:
   - Parses chunked JSON streams and SSE events into typed parts.
   - Normalizes text deltas, reasoning tokens, and tool invocations.
2. Legacy message converter:
   - Seamlessly converts legacy `{ role, content }` objects into structured `UIMessage` instances.
3. Unit tests:
   - Text delta accumulation, reasoning block extraction, tool invocation serialization.
4. Write `phase_logs/PHASE_LOG_phase_01.md`.

## Acceptance Criteria

- [ ] Universal stream parser extracts text, reasoning, and tool calls with 100% accuracy.
- [ ] Legacy message converter transforms flat messages with 0 data loss.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_01.md` created.
