# Client Dashboard local readiness

Run the deterministic readiness check from the repository root:

```bash
pnpm --filter client-dashboard env:check
```

The check loads gitignored root and Client Dashboard environment files using
the same precedence as local development. Its output contains environment
variable names and status values only; it never prints variable values.

It verifies the required runtime names and sends a read-only `PING` to the
configured Upstash Redis REST endpoint with a five-second timeout. A successful
result reports `connectivity.redis.status` as `passed`. Missing names,
authentication failures, unexpected responses, and timeouts fail the command.

Do not paste the environment files or command internals into tickets, logs, or
phase evidence. Record only the command, timestamp, operator, and resulting
name/status summary.
