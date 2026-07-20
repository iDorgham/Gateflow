/*
 * Prisma Accelerate setup notes:
 * - In production/Vercel: DATABASE_URL = prisma://accelerate.prisma-data.net/?api_key=...
 *   and DIRECT_DATABASE_URL = postgresql://Dorgham@localhost:5432/gate_access (or prod Postgres URL)
 * - Locally: keep DATABASE_URL = postgresql://Dorgham@localhost:5432/gate_access
 *   → withAccelerate() is a no-op on non-prisma:// URLs
 * - For prisma studio / migrate dev: uses DIRECT_DATABASE_URL (see schema.prisma directUrl)
 * - To regenerate locally without --no-engine: pnpm db:generate:local
 *
 * Environment variables:
 *   ACCELERATE_URL=true    → Force Accelerate (regardless of DATABASE_URL)
 *   ACCELERATE_URL=false   → Disable Accelerate
 *   ACCELERATE_URL unset   → Auto-detect from DATABASE_URL (prisma:// = enable)
 */
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

function createPrismaClient() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/gate_access';

  const accelerateFlag = process.env.ACCELERATE_URL;

  const isAccelerate =
    accelerateFlag === 'true' ||
    (accelerateFlag !== 'false' && databaseUrl.startsWith('prisma://'));

  return new PrismaClient({
    datasources: {
      db: { url: databaseUrl },
    },
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  }).$extends(isAccelerate ? withAccelerate() : {});
}

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

/** @deprecated Use `privilegedDb` or migrate to tenant `db` from `./tenant`. */
export const db = prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
