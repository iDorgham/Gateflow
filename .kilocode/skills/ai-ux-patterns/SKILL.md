---
name: gf-ai-ux-patterns
description: Hybrid Text/Chart/Action UI patterns for the GateAI chat interface.
---

# AI & Chat Interface Patterns (UX)

## Purpose
Ensure the GateAI chat interface feels like a professional operational tool, not just a chatbot. This skill guides the rendering of specialized "Message Parts" like interactive charts, action buttons, and status trackers.

## Core Principles
1. **Hybrid Interface**: Move beyond text. If an AI can show a chart (Skill 10), it should.
2. **Contextual Actions**: If the AI suggests a task (e.g., "Review incidents"), provide a button to navigate there.
3. **Optimistic States**: Show "Thinking" indicators and tool-calling status to maintain user trust during latent operations.

## Implementation Rules
- **Markdown Rendering**: Use `react-markdown` with ADS overrides (Skill 4).
- **Tool UI**: Render tool calls as "Operation Cards" with loading states and result summaries.
- **Scroll Management**: Automatically scroll to bottom on new messages unless the user has manually scrolled up.
- **Arabic UI**: Ensure the chat bubbles and system messages flip correctly in RTL mode (Skill 3).

## Anti-Patterns
- Wall-of-text responses for data analysis. Use tables or charts.
- Modal-only AI interfaces. The AI should be accessible in a sidebar or dedicated view.
- Static, non-interactive AI responses (lack of "Copy," "Retry," or "Report Issue").

## Code Example
```tsx
// Pattern for a Hybrid Message Component
export const AIMessage = ({ content, toolInvocations }: { content: string, toolInvocations?: ToolInvocation[] }) => {
  return (
    <div className="flex flex-col gap-space-200 p-space-200 bg-ds-surface-sunken rounded-lg">
      <Markdown content={content} />
      
      {toolInvocations?.map((tool) => (
        <div key={tool.toolCallId} className="border-l-2 border-ds-brand-bold pl-space-200">
           {tool.toolName === 'generateScanChart' && <ScanTrendChart data={tool.result} />}
           {tool.state === 'loading' && <Spinner label="Processing data..." />}
        </div>
      ))}
    </div>
  );
};
```
