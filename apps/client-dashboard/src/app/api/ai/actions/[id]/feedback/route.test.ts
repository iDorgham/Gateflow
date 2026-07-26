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

const mockSubmitFeedback = jest.fn();
jest.mock('@/lib/ai/ai-action-service', () => ({
  AiActionService: {
    submitFeedback: (...args: unknown[]) => mockSubmitFeedback(...args),
  },
}));

import { POST } from './route';

const session = {
  user: { id: 'user_1', organizationId: 'org_1' },
  claims: { sub: 'user_1', orgId: 'org_1', permissions: {} },
};
const params = { params: Promise.resolve({ id: 'action_1' }) };
const request = (body: unknown) => ({ json: async () => body }) as Request;

describe('POST /api/ai/actions/[id]/feedback ownership', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAuth.mockResolvedValue(session);
    mockSubmitFeedback.mockResolvedValue(true);
  });

  it('scopes feedback to the session organization and user', async () => {
    const response = await POST(request({ feedback: 'THUMBS_UP' }), params);

    expect(response.status).toBe(200);
    expect(mockSubmitFeedback).toHaveBeenCalledWith({
      actionId: 'action_1',
      organizationId: 'org_1',
      userId: 'user_1',
      feedback: 'THUMBS_UP',
    });
  });

  it('returns 404 without disclosing a foreign or already-reviewed action', async () => {
    mockSubmitFeedback.mockResolvedValue(false);

    const response = await POST(request({ feedback: 'THUMBS_DOWN' }), params);

    expect(response.status).toBe(404);
  });
});
