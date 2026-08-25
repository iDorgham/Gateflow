import {
  createAgenticToolCall,
  approveToolCall,
  rejectToolCall,
  executeToolCall,
  AgenticToolCall,
} from './tool-lifecycle-engine';

describe('tool-lifecycle-engine', () => {
  const MOCK_ACTOR = {
    id: 'user-manager-01',
    organizationId: 'org-palm-hills',
  };

  describe('createAgenticToolCall', () => {
    it('sets safe tools directly to executing', () => {
      const call = createAgenticToolCall('call-1', 'searchResidents', {
        query: 'Sarah',
      });

      expect(call.isDangerous).toBe(false);
      expect(call.state).toBe('executing');
      expect(call.userConfirmed).toBe(true);
    });

    it('sets dangerous mutations to requires-action', () => {
      const call = createAgenticToolCall('call-2', 'lockdownGate', {
        gateId: 'gate-north-01',
      });

      expect(call.isDangerous).toBe(true);
      expect(call.state).toBe('requires-action');
      expect(call.userConfirmed).toBe(false);
    });
  });

  describe('approveToolCall and rejectToolCall', () => {
    it('transitions dangerous tool from requires-action to executing upon approval', () => {
      const call = createAgenticToolCall('call-3', 'issueGuestPass', {
        visitorName: 'Alex',
      });
      const approved = approveToolCall(call, MOCK_ACTOR);

      expect(approved.state).toBe('executing');
      expect(approved.userConfirmed).toBe(true);
      expect(approved.auditMetadata?.actor).toBe('user-manager-01');
    });

    it('transitions to rejected when user declines', () => {
      const call = createAgenticToolCall('call-4', 'dispatchWorkOrder', {
        unitId: 'Villa 104',
      });
      const rejected = rejectToolCall(call, 'Unapproved vendor selection');

      expect(rejected.state).toBe('rejected');
      expect(rejected.userConfirmed).toBe(false);
      expect(rejected.error).toBe('Unapproved vendor selection');
    });
  });

  describe('executeToolCall', () => {
    it('executes tool with injected organizationId and marks completed', async () => {
      const call = createAgenticToolCall('call-5', 'searchResidents', {
        query: 'Alex',
      });
      const executor = jest
        .fn()
        .mockResolvedValue([{ id: 'res-1', name: 'Alex' }]);

      const result = await executeToolCall(call, executor, MOCK_ACTOR);

      expect(result.state).toBe('completed');
      expect(result.result).toEqual([{ id: 'res-1', name: 'Alex' }]);
      expect(executor).toHaveBeenCalledWith({
        query: 'Alex',
        organizationId: 'org-palm-hills',
      });
    });

    it('fails execution if organizationId is missing from actor', async () => {
      const call = createAgenticToolCall('call-6', 'searchResidents', {
        query: 'Alex',
      });
      const executor = jest.fn();

      const result = await executeToolCall(call, executor, {
        id: 'user-01',
        organizationId: '',
      });

      expect(result.state).toBe('failed');
      expect(result.error).toContain('TENANT_SCOPE_MISSING');
      expect(executor).not.toHaveBeenCalled();
    });

    it('captures thrown executor errors gracefully', async () => {
      const call = createAgenticToolCall('call-7', 'searchResidents', {
        query: 'Alex',
      });
      const executor = jest
        .fn()
        .mockRejectedValue(new Error('Database query timed out'));

      const result = await executeToolCall(call, executor, MOCK_ACTOR);

      expect(result.state).toBe('failed');
      expect(result.error).toBe('Database query timed out');
    });
  });
});
