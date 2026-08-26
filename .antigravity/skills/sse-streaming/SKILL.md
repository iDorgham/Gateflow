---
name: sse-streaming
description: Specialized workflows and patterns for sse-streaming.
---

# SKILL: Server-Sent Events (SSE) Real-time Streaming

## Purpose

Implement robust, unidirectional real-time data streams for the GateFlow v9.0 "Anomaly Feed" and "Mission Workspace" alerts.

## Core Principles

1.  **Unidirectional Power**: Use SSE for low-latency updates from server-to-client (simpler than WebSockets for most dashboard needs).
2.  **Auto-Reconnect**: Clients must handle connection drops with exponential backoff.
3.  **Event Segmentation**: Deliver small, incremental updates (deltas) rather than re-sending full datasets.

## Implementation Rules

- **Headers**: Use `Content-Type: text/event-stream`.
- **Heartbeats**: Send a "ping" comment every 15-30 seconds to keep the connection alive.
- **Organization Filtering**: Ensure streaming events are strictly filtered by `organizationId`.

## Anti-Patterns

- Maintaining open connections for inactive/minimized tabs (use Page Visibility API to close/re-open).
- Sending huge payloads (>10KB) via SSE.
- Not handling terminal errors on the server (leading to memory leaks).

## Code Examples

### Next.js SSE Route

```typescript
export async function GET(req: Request) {
  const stream = new ReadableStream({
    start(controller) {
      const ping = setInterval(() => {
        controller.enqueue('event: ping\ndata: {}\n\n');
      }, 30000);

      // Listen to Redis/DB change events
      eventBus.on('new-alert', (data) => {
        controller.enqueue(
          `event: new-alert\ndata: ${JSON.stringify(data)}\n\n`
        );
      });

      req.signal.addEventListener('abort', () => {
        clearInterval(ping);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
```

### React Subscriber Hook

```tsx
const useSSE = (url) => {
  useEffect(() => {
    const eventSource = new EventSource(url);
    eventSource.addEventListener('new-alert', (e) => {
      setAlerts((prev) => [JSON.parse(e.data), ...prev]);
    });
    return () => eventSource.close();
  }, [url]);
};
```
