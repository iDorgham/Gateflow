/**
 * Regression test for /api/support/tickets/[id]/messages.
 *
 * Both GET and POST used to import isAdminAuthorized but never call it,
 * making this a fully unauthenticated cross-org read/write on support
 * ticket messages. Both handlers now check it first.
 */
export {};

jest.mock('@/lib/admin-auth', () => ({
  isAdminAuthorized: jest.fn(),
}));

const mockFindMany = jest.fn();
const mockCreate = jest.fn();
const mockTicketUpdate = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    supportMessage: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      create: (...args: unknown[]) => mockCreate(...args),
    },
    supportTicket: {
      update: (...args: unknown[]) => mockTicketUpdate(...args),
    },
  },
}));

import { isAdminAuthorized } from '@/lib/admin-auth';

function makeRequest(body?: unknown) {
  return {
    json: async () => body ?? {},
  } as unknown as Request;
}

describe('/api/support/tickets/[id]/messages', () => {
  beforeEach(() => jest.clearAllMocks());

  it('GET returns 401 when not authorized and never queries messages', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(false);
    const { GET } = await import('./route');
    const res = await GET(makeRequest(), { params: { id: 'ticket_1' } });
    expect(res.status).toBe(401);
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  it('GET returns messages when authorized', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(true);
    mockFindMany.mockResolvedValue([{ id: 'msg_1', content: 'hi' }]);
    const { GET } = await import('./route');
    const res = await GET(makeRequest(), { params: { id: 'ticket_1' } });
    expect(res.status).toBe(200);
    expect(mockFindMany).toHaveBeenCalled();
  });

  it('POST returns 401 when not authorized and never writes a message', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(false);
    const { POST } = await import('./route');
    const res = await POST(makeRequest({ content: 'hello' }), {
      params: { id: 'ticket_1' },
    });
    expect(res.status).toBe(401);
    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockTicketUpdate).not.toHaveBeenCalled();
  });

  it('POST creates a message when authorized', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(true);
    mockCreate.mockResolvedValue({ id: 'msg_1', content: 'hello' });
    mockTicketUpdate.mockResolvedValue({});
    const { POST } = await import('./route');
    const res = await POST(makeRequest({ content: 'hello' }), {
      params: { id: 'ticket_1' },
    });
    expect(res.status).toBe(200);
    expect(mockCreate).toHaveBeenCalled();
  });
});
