export {};

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

const mockVisitorQRFindUnique = jest.fn();
const mockGateFindUnique = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    visitorQR: {
      findUnique: (...args: unknown[]) => mockVisitorQRFindUnique(...args),
    },
    gate: {
      findUnique: (...args: unknown[]) => mockGateFindUnique(...args),
    },
  },
}));

import { POST } from './route';

describe('POST /api/resident/push/send', () => {
  it('is disabled because the unauthenticated primitive has no trusted caller', async () => {
    const request = {
      json: async () => ({ visitorQRId: 'foreign_qr', gateId: 'foreign_gate' }),
    } as never;

    const response = await POST(request);

    expect(response.status).toBe(410);
    expect(mockVisitorQRFindUnique).not.toHaveBeenCalled();
    expect(mockGateFindUnique).not.toHaveBeenCalled();
  });
});
