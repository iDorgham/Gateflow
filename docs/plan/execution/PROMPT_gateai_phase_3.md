# Pro Prompt — Phase 3: Inline Recharts Visuals from Analytics

**Primary role:** FRONTEND
**Preferred tool:** Cursor

### Context
- **Project**: GateFlow
- **Packages**: ui, types
- **UI**: Recharts via `@gate-access/ui`

### Goal
Enable Gemini to suggest and render charts directly in the chat window.

### Scope (in)
- Parser for AI responses containing chart data (e.g., JSON blocks).
- `ChartContainer` component in chat that renders Recharts based on the AI output.
- System prompt updates to guide Gemini on when to output chart JSON.

### Scope (out)
- No specialized report generation (PDF).

### Steps
1. Update `ChatPanel` to detect a specific message type or Markdown block containing chart specs.
2. Create a `DynamicChart` component that maps AI-provided JSON to existing Recharts patterns in `@gate-access/ui`.
3. Update the Gemini system prompt with examples of how to format chart data (line, bar, pie).
4. Test with "Show me a chart of visitors per day".
5. Run `pnpm turbo build` and `lint`.
6. `/github` — feat(gateai): phase 3 — inline Recharts in chat.

### Acceptance Criteria
- [ ] Charts render correctly inside the message stream.
- [ ] Charts are responsive and support dark mode tokens.
- [ ] AI correctly picks the right chart type for the data.
