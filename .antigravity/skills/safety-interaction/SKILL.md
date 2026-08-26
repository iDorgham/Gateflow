---
name: safety-interaction
description: Mutation confirmation, audit trails, and multi-step safety flows for GateAI.
---

# AI Safety & Interaction

## Purpose

Prevent destructive or accidental actions by the AI. This skill enforces a "Human-in-the-loop" pattern for any state-changing operations (mutations) like bulk QR code deletion or organization setting updates.

## Core Principles

1. **Mutation Protection**: No `execute` call for a mutation tool should happen without a prior `confirmation` UI state.
2. **Auditability**: Every AI action must be logged in `EventLog` with the `Actor: AI` and the prompt that triggered it.
3. **Multi-tenancy Safety**: Tool calls MUST be scoped to the user's `organizationId` at the code level, regardless of AI instructions.

## Implementation Rules

- **Confirmation Flow**: AI proposes an action -> Frontend renders a "Confirmation Card" -> User clicks "Approve" -> Tool execution finishes.
- **Rollback Preparedness**: For bulk operations, implement "dry-run" modes to show the user what _would_ happen first.
- **Graceful Denials**: If an AI request violates RBAC (Skill 16), the tool must return an "Unauthorized" error, not a hallucination.

## Anti-Patterns

- Implicitly deleting data because the AI said "Cleanup old QRs".
- Allowing the AI to change its own permission level.
- Bypassing server-side validation because "the AI prompt was secure".

## Code Example

```tsx
// Frontend Confirmation Pattern
const SafetyConfirmation = ({ action, onConfirm, onCancel }: any) => {
  return (
    <div className="p-space-200 border border-ds-border-warning bg-ds-surface-warning rounded-md">
      <h4 className="font-bold flex items-center gap-2">
        <AlertTriangle size={16} /> Confirm Bulk Action
      </h4>
      <p className="text-ds-text-subtle">
        Are you sure you want to {action.summary}?
      </p>
      <div className="flex gap-space-100 mt-space-200">
        <Button variant="danger" onClick={onConfirm}>
          Approve Action
        </Button>
        <Button variant="subtle" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
```
