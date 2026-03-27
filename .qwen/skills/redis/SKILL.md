# SKILL: Upstash Redis & Rate Limiting

## Purpose
Manage serverless caching, queuing, and global rate limiting using **Upstash Redis** for the GateFlow v9.0 infrastructure.

## Core Principles
1.  **Ephemeral Data**: Use Redis for data that is transient (sessions, rates, temp counts).
2.  **Cache-Aside**: Always check Redis before DB; update Redis on DB write.
3.  **Token Bucket**: Implement rate limiting using the token bucket algorithm for API protection.

## Implementation Rules
- **Keyspace Hierarchy**: `gf:<env>:<orgId>:<module>:<key>`.
- **TTL**: Always define Time-To-Live (TTL) to prevent memory leaks.
- **Upstash SDK**: Use `@upstash/redis` for edge-compatible requests.

## Anti-Patterns
- Using Redis as a primary, persistent database (use Prisma/PG).
- Storing large objects (>1MB) in Redis.
- Not using prefixes (leads to key collisions in multi-tenant environments).

## Code Examples

### Rate Limiter (Upstash Ratelimit)
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export const checkRate = async (userId: string) => {
  const { success, remaining } = await ratelimit.limit(`limit:${userId}`);
  return { success, remaining };
};
```

### Cached Query
```typescript
const getMission = async (id: string) => {
  const cacheKey = `mission:${id}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const mission = await prisma.mission.findUnique({ where: { id } });
  await redis.set(cacheKey, JSON.stringify(mission), { ex: 3600 });
  return mission;
};
```
