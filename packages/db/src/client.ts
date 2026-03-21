/*
 * Prisma Accelerate setup notes:
 * - In production/Vercel: DATABASE_URL = prisma://accelerate.prisma-data.net/?api_key=...
 *   and DIRECT_DATABASE_URL = postgresql://Dorgham@localhost:5432/gate_access (or prod Postgres URL)
 * - Locally: keep DATABASE_URL = postgresql://Dorgham@localhost:5432/gate_access
 *   → withAccelerate() is a no-op on non-prisma:// URLs
 * - For prisma studio / migrate dev: uses DIRECT_DATABASE_URL (see schema.prisma directUrl)
 * - To regenerate locally without --no-engine: pnpm db:generate:local
 */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

export const db = prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
