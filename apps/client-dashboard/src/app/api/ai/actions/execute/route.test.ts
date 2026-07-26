export {};

jest.mock('next/server', () => {
  class MockNextResponse {
    status: number;
    body: unknown;
    constructor(body: unknown, init?: { status?: number }) {
      this.body = body;
      this.status = init?.status ?? 200;
    }
    static json(body: unknown, init?: { status?: number }) {
      return new MockNextResponse(body, init);
    }
  }
  return { NextResponse: MockNextResponse };
});

const mockRequireAuth = jest.fn();
jest.mock('@/lib/dashboard-auth', () => ({
  requireAuth: (...args: unknown[]) => mockRequireAuth(...args),
}));

const mockHasPermission = jest.fn();
jest.mock('@/lib/auth', () => ({
  hasPermission: (...args: unknown[]) => mockHasPermission(...args),
}));

const mockClaimPendingAction = jest.fn();
const mockCompleteClaimedAction = jest.fn();
jest.mock('@/lib/ai/ai-action-service', () => ({
  AiActionService: {
    claimPendingAction: (...args: unknown[]) => mockClaimPendingAction(...args),
    completeClaimedAction: (...args: unknown[]) =>
      mockCompleteClaimedAction(...args),
  },
}));

const mockCreateTask = jest.fn();
jest.mock('@/lib/ai/ai-task-service', () => ({
  AiTaskService: {
    createTask: (...args: unknown[]) => mockCreateTask(...args),
  },
}));

const mockQrCreateMany = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    qRCode: { createMany: (...args: unknown[]) => mockQrCreateMany(...args) },
  },
}));

import { POST } from './route';

const session = {
  user: { id: 'user_1', organizationId: 'org_1' },
  claims: {
    sub: 'user_1',
    orgId: 'org_1',
    permissions: { 'workspace:manage': true, 'qr:create': true },
  },
};
const request = (body: unknown) => ({ json: async () => body }) as Request;

describe('POST /api/ai/actions/execute ownership and intent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAuth.mockResolvedValue(session);
    mockHasPermission.mockReturnValue(true);
    mockCompleteClaimedAction.mockResolvedValue(true);
  });

  it('claims an action using session organization and user ownership', async () => {
    mockClaimPendingAction.mockResolvedValue({
      id: 'action_1',
      actionType: 'SCHEDULE_TASK',
      intentJson: {
        title: 'Daily report',
        cron: 'daily',
        params: { taskType: 'REPORT_GEN' },
      },
    });
    mockCreateTask.mockResolvedValue({ id: 'task_1' });

    const response = await POST(
    const response = await POST(
      request({ actionId: 'action_1' })
    );

    expect(response.status).toBe(200);
    expect(mockClaimPendingAction).toHaveBeenCalledWith({
      actionId: 'action_1',
      organizationId: 'org_1',
      userId: 'user_1',
    });
    expect(mockCreateTask).toHaveBeenCalled();
    expect(mockQrCreateMany).not.toHaveBeenCalled();
  });

  it('returns 404 when the scoped compare-and-set claim fails', async () => {
    mockClaimPendingAction.mockResolvedValue(null);

    const response = await POST(request({ actionId: 'foreign_action' }));

    expect(response.status).toBe(404);
    expect(mockCreateTask).not.toHaveBeenCalled();
    expect(mockQrCreateMany).not.toHaveBeenCalled();
  });

  it('checks permission derived from the stored action type', async () => {
    mockClaimPendingAction.mockResolvedValue({
      id: 'action_1',
      actionType: 'BULK_QR_CREATE',
      intentJson: { count: 1, type: 'SINGLE' },
    });
    mockHasPermission.mockReturnValue(false);

    const response = await POST(request({ actionId: 'action_1' }));

    expect(response.status).toBe(403);
    expect(mockQrCreateMany).not.toHaveBeenCalled();
  });

  it('rejects execution when stored intent has a validUntil timestamp in the past', async () => {
    const pastIso = new Date(Date.now() - 60_000).toISOString();
    mockClaimPendingAction.mockResolvedValue({
      id: 'action_1',
      actionType: 'BULK_QR_CREATE',
      intentJson: { count: 1, type: 'SINGLE', validUntil: pastIso },
    });

    const response = await POST(request({ actionId: 'action_1' }));

    expect(response.status).toBe(422);
    expect(mockCompleteClaimedAction).toHaveBeenCalledWith(
      expect.objectContaining({
        actionId: 'action_1',
        status: 'FAILED',
      })
    );
    expect(mockQrCreateMany).not.toHaveBeenCalled();
  });
});
