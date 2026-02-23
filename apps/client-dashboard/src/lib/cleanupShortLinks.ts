import { PrismaClient } from '@gate-access/db';

/**
 * Delete all QrShortLink rows whose expiry has passed.
 *
 * Intended to be called from a scheduled job (e.g. a cron route, Vercel Cron,
 * or a background worker). Safe to call at any frequency — only expired rows
 * are affected.
 *
 * @returns The number of rows deleted.
 */
export async function deleteExpiredShortLinks(prisma: PrismaClient): Promise<number> {
  const result = await prisma.qrShortLink.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return result.count;
}
