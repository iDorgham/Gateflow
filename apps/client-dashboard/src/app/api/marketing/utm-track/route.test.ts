export {};

jest.mock('next/server', () => ({
  NextRequest: class MockNextRequest {},
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

const mockQrFindUnique = jest.fn();
const mockQrUpdate = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    qRCode: {
      findUnique: (...args: unknown[]) => mockQrFindUnique(...args),
      update: (...args: unknown[]) => mockQrUpdate(...args),
    },
  },
}));

import { POST } from './route';

describe('POST /api/marketing/utm-track', () => {
  it('retires unauthenticated QR attribution mutation before reading input', async () => {
    const request = { json: jest.fn() };

    const response = await POST(request as never);
    const json = await response.json();

    expect(response.status).toBe(410);
    expect(json).toEqual({
      success: false,
      message: 'Use the QR short link for campaign attribution',
    });
    expect(request.json).not.toHaveBeenCalled();
    expect(mockQrFindUnique).not.toHaveBeenCalled();
    expect(mockQrUpdate).not.toHaveBeenCalled();
  });
});
