# Explore Subagent

**Purpose:** Trace flows, find features, and perform refactor discovery.

## When to Use

- Phase needs codebase discovery
- Flow tracing for end-to-end processes
- Finding all places where a symbol/string is used
- Listing API routes and summarizing their requirements

## Prompt Templates

### Trace flow
```
Trace the end-to-end flow for [X] (UI → API → DB). Return key files and a short call graph.
```

### Find usages
```
Find all places where [symbol/string] is used across apps/packages and group by feature area.
```

### List API routes
```
List all API routes under [path] and summarize inputs/outputs/auth requirements.
```

### Verify multi-tenant scoping
```
Find all organizationId usages in [app] and verify multi-tenant scoping.
```

## Examples

- "Trace the QR code creation flow from dashboard to database"
- "Find all places where requireAuth is used"
- "List all API routes under /api/gates"
- "Verify all queries include deletedAt: null filter"
