import { mock } from "bun:test";

const PrismaClientMock = class {
  user: any;
  organization: any;
  gate: any;
  qRCode: any;
  scanLog: any;

  constructor() {
    this.user = { findFirst: () => {}, findMany: () => {}, count: () => {} };
    this.organization = { findFirst: () => {}, findUnique: () => {}, findMany: () => {} };
    this.gate = { findFirst: () => {}, findMany: () => {}, count: () => {} };
    this.qRCode = { findFirst: () => {}, findMany: () => {}, count: () => {} };
    this.scanLog = { findMany: () => {}, count: () => {} };
  }
};

mock.module("@prisma/client", () => {
  return {
    PrismaClient: PrismaClientMock,
    Prisma: {
      StringFilter: {}
    }
  };
});
