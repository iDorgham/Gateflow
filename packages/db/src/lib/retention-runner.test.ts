import { prisma } from '../client';
import { runRetentionBatch } from './retention-runner';

const NOW = new Date('2026-09-02T00:00:00.000Z');
const STALE_CONTACT = {
  firstName: 'Amr',
  lastName: 'Hassan',
  email: 'amr@example.com',
  phone: null,
  company: null,
  jobTitle: null,
  companyWebsite: null,
  notes: null,
};

describe('retention runner', () => {
  const originalSecret = process.env.RETENTION_REDACTION_SECRET;
  const originalModels = {
    organization: prisma.organization,
    scanLog: prisma.scanLog,
    incident: prisma.incident,
    scanAttachment: prisma.scanAttachment,
    contact: prisma.contact,
    vehiclePlate: prisma.vehiclePlate,
  };

  beforeEach(() => {
    process.env.RETENTION_REDACTION_SECRET =
      'retention-runner-test-secret-at-least-32-characters';
  });

  afterEach(() => {
    Object.assign(prisma, originalModels);
  });

  afterAll(() => {
    if (originalSecret === undefined) {
      delete process.env.RETENTION_REDACTION_SECRET;
    } else {
      process.env.RETENTION_REDACTION_SECRET = originalSecret;
    }
  });

  it('scopes deletion, drains stable pages, and skips plates after a stale write loses its race', async () => {
    const findManyContacts = jest
      .fn()
      .mockResolvedValueOnce([{ id: 'contact-raced', ...STALE_CONTACT }])
      .mockResolvedValueOnce([{ id: 'contact-updated', ...STALE_CONTACT }])
      .mockResolvedValueOnce([]);
    const updateManyContacts = jest
      .fn()
      .mockResolvedValueOnce({ count: 0 })
      .mockResolvedValueOnce({ count: 1 });
    const findManyPlates = jest.fn().mockResolvedValue([
      {
        id: 'plate-1',
        plateNumber: 'ABC 123',
        ownerName: 'Amr Hassan',
        ownerPhone: '+201234567890',
      },
    ]);
    const updatePlate = jest.fn().mockResolvedValue({ count: 1 });
    const deleteManyScanLogs = jest.fn().mockResolvedValue({ count: 2 });

    Object.assign(prisma, {
      organization: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'org-1',
            scanLogRetentionMonths: 1,
            visitorHistoryRetentionMonths: 1,
            idArtifactRetentionMonths: null,
            incidentRetentionMonths: null,
            retentionLegalHold: false,
            retentionPolicyUpdatedAt: NOW,
          },
        ]),
      },
      scanLog: { deleteMany: deleteManyScanLogs },
      incident: { deleteMany: jest.fn() },
      scanAttachment: { deleteMany: jest.fn() },
      contact: {
        findMany: findManyContacts,
        updateMany: updateManyContacts,
      },
      vehiclePlate: {
        findMany: findManyPlates,
        update: updatePlate,
      },
    });

    const result = await runRetentionBatch(NOW);

    expect(deleteManyScanLogs).toHaveBeenCalledWith({
      where: {
        organizationId: 'org-1',
        scannedAt: { lt: new Date('2026-08-02T00:00:00.000Z') },
        deletedAt: null,
      },
    });
    expect(findManyContacts).toHaveBeenCalledTimes(3);
    expect(findManyContacts).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { id: 'asc' }, take: 2000 })
    );
    expect(updateManyContacts).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: {
          id: 'contact-raced',
          organizationId: 'org-1',
          updatedAt: { lt: new Date('2026-08-02T00:00:00.000Z') },
        },
      })
    );
    expect(findManyPlates).toHaveBeenCalledTimes(1);
    expect(findManyPlates).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { contactId: 'contact-updated' },
      })
    );
    expect(updatePlate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'plate-1' },
        data: {
          ownerName: '[redacted-5e679a0610f0]',
          ownerPhone: '[redacted-7d755324beda]',
        },
      })
    );
    expect(result.organizations[0].anonymized.contacts).toBe(1);
    expect(result.organizations[0].anonymized.vehiclePlates).toBe(1);
    expect(result.organizations[0].deleted.scanLogs).toBe(2);
  });
});
