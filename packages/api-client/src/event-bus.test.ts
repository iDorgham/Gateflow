import { EventBus } from './event-bus';

describe('EventBus', () => {
  it('publishes events to subscribers cleanly', async () => {
    const bus = EventBus.getInstance();
    const handler = jest.fn();

    const unsubscribe = bus.subscribe('org_test', 'SCAN_SUCCESS', handler);

    const event = await bus.publish('org_test', 'SCAN_SUCCESS', {
      scanId: 'scan_123',
    });

    expect(handler).toHaveBeenCalledWith(event);
    expect(event.organizationId).toBe('org_test');
    expect(event.type).toBe('SCAN_SUCCESS');
    expect(event.payload).toEqual({ scanId: 'scan_123' });

    unsubscribe();
  });
});
