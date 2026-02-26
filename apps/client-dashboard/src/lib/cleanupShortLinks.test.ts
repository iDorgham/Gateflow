import { deleteExpiredShortLinks } from './cleanupShortLinks';
import { PrismaClient } from '@gate-access/db';

describe('deleteExpiredShortLinks', () => {
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      qrShortLink: {
        deleteMany: jest.fn(),
      },
    };
    // Fix system time for deterministic tests
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delete expired short links and return the count', async () => {
    const mockCount = 5;
    mockPrisma.qrShortLink.deleteMany.mockResolvedValue({ count: mockCount });

    const result = await deleteExpiredShortLinks(mockPrisma as unknown as PrismaClient);

    expect(result).toBe(mockCount);
    expect(mockPrisma.qrShortLink.deleteMany).toHaveBeenCalledWith({
      where: {
        expiresAt: {
          lt: new Date('2024-01-01T12:00:00Z'),
        },
      },
    });
  });

  it('should return 0 when no links are expired', async () => {
    mockPrisma.qrShortLink.deleteMany.mockResolvedValue({ count: 0 });

    const result = await deleteExpiredShortLinks(mockPrisma as unknown as PrismaClient);

    expect(result).toBe(0);
    expect(mockPrisma.qrShortLink.deleteMany).toHaveBeenCalledTimes(1);
  });

  it('should propagate errors from prisma', async () => {
    const error = new Error('DB Error');
    mockPrisma.qrShortLink.deleteMany.mockRejectedValue(error);

    await expect(deleteExpiredShortLinks(mockPrisma as unknown as PrismaClient)).rejects.toThrow('DB Error');
  });
});
