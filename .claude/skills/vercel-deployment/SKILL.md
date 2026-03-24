# SKILL: Vercel Deployment & Edge Optimization

## Purpose
Optimize the deployment and runtime environment for GateFlow v9.0 web applications on the Vercel platform.

## Core Principles
1.  **Edge-Computed**: Utilize Vercel Edge Functions for mission-critical logic (Auth, Redirects) to reduce TTFB in the MENA region.
2.  **Incremental Static Regeneration (ISR)**: Use ISR for content that updates infrequently (Manuals, Help Docs) to ensure instant loading.
3.  **Environment Sync**: Maintain perfect parity between Local, Preview, and Production environment variables.
4.  **Operations & Recovery**: Proactively monitor and resolve deployment failures (serverless timeouts, build errors, log anomalies) using the `/clis team ops` recovery workflow.

## Implementation Rules
- **Runtime**: Prefer Node.js for heavy operations; Edge for light/global logic.
- **Regions**: Pin deployment regions to `fra1` (Frankfurt) or Middle-East specific regions when available to minimize MENA latency.
- **Previews**: Every PR must generate a Vercel Preview URL for design review.

## Anti-Patterns
- Manual deployment (always use CI/CD git-integration).
- Massive edge function bundles (keep 'em under 1MB).
- Storing large assets in the git repo (use Vercel Blob or External S3/Cloudinary).

## Code Examples

### Edge Runtime Config
```typescript
export const config = {
  runtime: 'edge',
  regions: ['fra1'], // Closer to MENA
};

export default function handler(req: Request) {
  return new Response("Verified Secure Channel");
}
```

### ISR Implementation
```typescript
export const revalidate = 3600; // Revalidate docs every hour

export default async function Page() {
  const data = await getManualData();
  return <div>{data.content}</div>;
}
```
