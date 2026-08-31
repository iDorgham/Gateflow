import { backfillScanLogOrganizationId } from './backfill-scanlog-organization-id';
import { prisma } from '../src';

jest.mock('../src', () => ({
  prisma: {
    scanLog: {
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('backfillScanLogOrganizationId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles empty unlinked scan logs cleanly', async () => {
    (prisma.scanLog.findMany as jest.Mock).mockResolvedValue([]);

    const result = await backfillScanLogOrganizationId();

    expect(result).toEqual({ updatedCount: 0, remainingNulls: 0 });
    expect(prisma.scanLog.update).not.toHaveBeenCalled();
  });

  it('populates organizationId from linked Gate or QRCode', async () => {
    (prisma.scanLog.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'scan_1',
        gate: { organizationId: 'org_gate_1' },
        qrCode: { organizationId: 'org_qr_1' },
      },
      {
        id: 'scan_2',
        gate: null,
        qrCode: { organizationId: 'org_qr_2' },
      },
    ]);
    (prisma.scanLog.update as jest.Mock).mockResolvedValue({});
    (prisma.scanLog.count as jest.Mock).mockResolvedValue(0);

    const result = await backfillScanLogOrganizationId();

    expect(result).toEqual({ updatedCount: 2, remainingNulls: 0 });
    expect(prisma.scanLog.update).toHaveBeenCalledWith({
      where: { id: 'scan_1' },
      data: { organizationId: 'org_gate_1' },
    });
    expect(prisma.scanLog.update).toHaveBeenCalledWith({
      where: { id: 'scan_2' },
      data: { organizationId: 'org_qr_2' },
    });
  });
});
