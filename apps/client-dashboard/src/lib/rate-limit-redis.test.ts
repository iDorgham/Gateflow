import { getRateLimitStatus, _resetRateLimitStore } from './rate-limit';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

jest.mock('@upstash/ratelimit');
jest.mock('@upstash/redis');

describe('getRateLimitStatus (Redis)', () => {
  beforeEach(() => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.com';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token';
    _resetRateLimitStore();
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it('should use Ratelimit.getRemaining when Redis is configured', async () => {
    const mockGetRemaining = jest.fn().mockResolvedValue({
      remaining: 5,
      reset: Date.now() + 1000,
    });

    (Ratelimit as unknown as jest.Mock).mockImplementation(() => ({
      getRemaining: mockGetRemaining,
      limit: jest.fn(),
    }));

    // Mock Redis to prevent errors if the old code runs
    (Redis as unknown as jest.Mock).mockImplementation(() => ({
      zcard: jest.fn().mockResolvedValue(0),
    }));

    // We also need to mock slidingWindow static method since it's called
    (Ratelimit as any).slidingWindow = jest.fn();

    await getRateLimitStatus('user:123', 10, 60000);

    expect(mockGetRemaining).toHaveBeenCalledWith('user:123');
  });
});
