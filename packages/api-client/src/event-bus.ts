/**
 * Central Event Bus Interface
 * GateFlow Multi-Tenant Redis Event Bus for real-time telemetry, barriers, and agentic workflows.
 */

export interface GateFlowBusEvent<T = Record<string, unknown>> {
  id: string;
  organizationId: string;
  type: string;
  timestamp: string;
  payload: T;
}

export type EventBusSubscriber<T = Record<string, unknown>> = (
  event: GateFlowBusEvent<T>
) => void | Promise<void>;

export class EventBus {
  private static instance: EventBus;
  private subscribers: Map<string, Set<EventBusSubscriber>> = new Map();

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Publish an event to the Central Event Bus.
   */
  public async publish<T = Record<string, unknown>>(
    organizationId: string,
    type: string,
    payload: T
  ): Promise<GateFlowBusEvent<T>> {
    const event: GateFlowBusEvent<T> = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      organizationId,
      type,
      timestamp: new Date().toISOString(),
      payload,
    };

    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (redisUrl && redisToken) {
      try {
        await fetch(
          `${redisUrl}/publish/gateflow:events:${organizationId}:${type}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${redisToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
          }
        );
      } catch (err) {
        console.warn(
          '[EventBus] Upstash Redis publish failed, falling back to local bus:',
          err
        );
      }
    }

    // Local in-process delivery
    const channelKey = `${organizationId}:${type}`;
    const globalKey = `*:${type}`;
    const orgWildcardKey = `${organizationId}:*`;

    const listeners = new Set<EventBusSubscriber>([
      ...(this.subscribers.get(channelKey) || []),
      ...(this.subscribers.get(globalKey) || []),
      ...(this.subscribers.get(orgWildcardKey) || []),
    ]);

    for (const listener of listeners) {
      try {
        await listener(event as GateFlowBusEvent<Record<string, unknown>>);
      } catch (err) {
        console.error('[EventBus] Error in subscriber handler:', err);
      }
    }

    return event;
  }

  /**
   * Subscribe to events for an organization.
   */
  public subscribe<T = Record<string, unknown>>(
    organizationId: string,
    type: string,
    subscriber: EventBusSubscriber<T>
  ): () => void {
    const channelKey = `${organizationId}:${type}`;
    if (!this.subscribers.has(channelKey)) {
      this.subscribers.set(channelKey, new Set());
    }
    this.subscribers.get(channelKey)!.add(subscriber as EventBusSubscriber);

    return () => {
      this.subscribers
        .get(channelKey)
        ?.delete(subscriber as EventBusSubscriber);
    };
  }
}

export const eventBus = EventBus.getInstance();
