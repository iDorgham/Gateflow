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
}));
