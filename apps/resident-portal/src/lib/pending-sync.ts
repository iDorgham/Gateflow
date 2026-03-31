'use client';

const QUEUE_KEY = 'gateflow-resident-pending-visitors';

interface QueueItem {
  body: Record<string, unknown>;
  createdAt: string;
}

function readQueue(): QueueItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = window.localStorage.getItem(QUEUE_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value) as QueueItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(items: QueueItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

export function queueVisitorRequest(body: Record<string, unknown>): void {
  const queue = readQueue();
  queue.push({ body, createdAt: new Date().toISOString() });
  writeQueue(queue);
}

export async function flushQueuedVisitorRequests(): Promise<number> {
  const queue = readQueue();
  if (!queue.length || !navigator.onLine) return 0;

  const remaining: QueueItem[] = [];
  let synced = 0;

  for (const item of queue) {
    try {
      const response = await fetch('/api/resident/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.body),
      });

      if (!response.ok) {
        remaining.push(item);
      } else {
        synced += 1;
      }
    } catch {
      remaining.push(item);
    }
  }

  writeQueue(remaining);
  return synced;
}
