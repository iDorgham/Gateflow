import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";

// Define mocks for Prisma methods
const mockPrisma = {
  user: {
    findFirst: mock(() => Promise.resolve(null)),
    findMany: mock(() => Promise.resolve([])),
    count: mock(() => Promise.resolve(0)),
  },
  organization: {
    findFirst: mock(() => Promise.resolve(null)),
    findUnique: mock(() => Promise.resolve(null)),
    findMany: mock(() => Promise.resolve([])),
  },
  gate: {
    findFirst: mock(() => Promise.resolve(null)),
    findMany: mock(() => Promise.resolve([])),
    count: mock(() => Promise.resolve(0)),
  },
  qRCode: {
    findFirst: mock(() => Promise.resolve(null)),
    findMany: mock(() => Promise.resolve([])),
    count: mock(() => Promise.resolve(0)),
  },
  scanLog: {
    findMany: mock(() => Promise.resolve([])),
    count: mock(() => Promise.resolve(0)),
  },
};

// Mock the ./client module
mock.module("./client", () => {
  return {
    prisma: mockPrisma,
    db: mockPrisma, // Assuming db export is just prisma in client.ts
  };
});

// Import the module under test AFTER mocking
import { setOrganizationContext, getOrganizationContext, clearOrganizationContext, db } from "./tenant";

describe("Organization Context Isolation", () => {
  beforeEach(() => {
    clearOrganizationContext();
    // Reset mocks
    Object.values(mockPrisma).forEach((model: any) => {
      Object.values(model).forEach((fn: any) => {
        if (fn.mock) fn.mockClear();
      });
    });
  });

  afterEach(() => {
    clearOrganizationContext();
  });

  describe("Context Management", () => {
    it("should set and get organization context", () => {
      const orgId = "org-123";
      setOrganizationContext({ organizationId: orgId });
      expect(getOrganizationContext()).toEqual({ organizationId: orgId });
    });

    it("should clear organization context", () => {
      setOrganizationContext({ organizationId: "org-123" });
      clearOrganizationContext();
      expect(getOrganizationContext()).toEqual({ organizationId: null });
    });
  });

  describe("DB Proxy with Context", () => {
    const orgId = "org-123";

    it("should filter user.findFirst by organizationId when context is set", async () => {
      setOrganizationContext({ organizationId: orgId });
      await db.user.findFirst({ where: { email: "test@example.com" } });

      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: "test@example.com",
          organizationId: { equals: orgId },
        },
      });
    });

    it("should NOT filter user.findFirst when context is NOT set", async () => {
      await db.user.findFirst({ where: { email: "test@example.com" } });

      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    it("should filter user.findMany by organizationId when context is set", async () => {
      setOrganizationContext({ organizationId: orgId });
      await db.user.findMany();

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: { equals: orgId },
        },
      });
    });

    it("should filter gate.findMany by organizationId when context is set", async () => {
      setOrganizationContext({ organizationId: orgId });
      await db.gate.findMany();

      expect(mockPrisma.gate.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: { equals: orgId },
        },
      });
    });

    it("should filter qRCode.count by organizationId when context is set", async () => {
      setOrganizationContext({ organizationId: orgId });
      await db.qRCode.count();

      expect(mockPrisma.qRCode.count).toHaveBeenCalledWith({
        where: {
          organizationId: { equals: orgId },
        },
      });
    });

    it("should filter scanLog.findMany by gate.organizationId when context is set", async () => {
      setOrganizationContext({ organizationId: orgId });
      await db.scanLog.findMany();

      expect(mockPrisma.scanLog.findMany).toHaveBeenCalledWith({
        where: {
          gate: {
            organizationId: orgId,
          },
        },
      });
    });

    it("should NOT filter scanLog.findMany when context is NOT set", async () => {
      await db.scanLog.findMany();
      expect(mockPrisma.scanLog.findMany).toHaveBeenCalledWith(); // Called with no args or undefined
    });
  });
});
