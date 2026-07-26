import { GET } from './route';

describe('GET /api/health', () => {
  it('returns a minimal unauthenticated no-store health response', async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(body).toEqual({
      status: 'ok',
      service: 'client-dashboard',
    });
    expect(Object.keys(body).sort()).toEqual(['service', 'status']);
  });
});
