/* eslint-disable @typescript-eslint/no-explicit-any -- test mock */

class PrismaClientMock {
  user: any;
  organization: any;
  gate: any;
  qRCode: any;
  scanLog: any;

  constructor() {
    this.user = { findFirst: () => {}, findMany: () => {}, count: () => {} };
    this.organization = {
      findFirst: () => {},
      findUnique: () => {},
      findMany: () => {},
    };
    this.gate = { findFirst: () => {}, findMany: () => {}, count: () => {} };
    this.qRCode = { findFirst: () => {}, findMany: () => {}, count: () => {} };
    this.scanLog = { findMany: () => {}, count: () => {} };
  }

  // `packages/db/src/client.ts` calls `new PrismaClient(...).$extends(withAccelerate())`.
  // In tests we just need a no-op `$extends` that preserves the mock client instance.
  $extends() {
    return this;
  }
}

jest.mock('@prisma/client', () => ({
  PrismaClient: PrismaClientMock,
  Prisma: {
    StringFilter: {},
  },
  /** Minimal enum stubs so modules that import values (e.g. advanced-seed-service) load under the mock. */
  ScanStatus: {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    EXPIRED: 'EXPIRED',
    MAX_USES_REACHED: 'MAX_USES_REACHED',
    INACTIVE: 'INACTIVE',
    DENIED: 'DENIED',
  },
  QRCodeType: {
    SINGLE: 'SINGLE',
    RECURRING: 'RECURRING',
    PERMANENT: 'PERMANENT',
    VISITOR: 'VISITOR',
    OPEN: 'OPEN',
  },
}));
