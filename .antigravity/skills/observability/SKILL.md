# SKILL: Structured Observability & Logging

## Purpose
Ensure total visibility into the GateFlow v9.0 health using structured logging, correlation IDs, and error tracking.

## Core Principles
1.  **Structured JSON**: No plain text logs; always use JSON for machine-readability.
2.  **Context Injection**: Every log must include `orgId`, `userId`, `correlationId`, and `env`.
3.  **Severity Triage**: Use `DEBUG`, `INFO`, `WARN`, `ERROR` correctly to prevent log noise.

## Implementation Rules
- **Library**: Use `pino` for high-performance Node.js logging.
- **Correlation**: Capture the `x-correlation-id` from the API Gateway and pass it through all service calls.
- **Privacy**: Automatically mask PII (Visitor Names, Phone Numbers) using pino-masking.

## Anti-Patterns
- Using `console.log` in production.
- Logging sensitive data (Passwords, JWTs, Cryptographic Keys).
- Error logs without stack traces.

## Code Examples

### Structured Logger Instance
```typescript
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  mixin() {
    return { 
      service: "gateflow-v9",
      env: process.env.NODE_ENV
    };
  }
});
```

### Logging with Context
```typescript
export const logInfo = (msg: string, ctx: any) => {
  logger.info({
    ...ctx,
    msg,
    time: new Date().toISOString()
  });
};

// Usage
logInfo("Access granted at North Gate", { visitorId: "V-123", orgId: "SITE-Cairo" });
```
