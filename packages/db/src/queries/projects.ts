import { prisma } from '../client';
import { subDays } from 'date-fns';

/**
 * Higher-order aggregates for project-level reporting & CRM.
 * Scoped by organization for security.
 */
export async function getProjectMetrics(
  projectId: string,
  organizationId: string
) {
  const now = new Date();
  const periodStart = subDays(now, 7);
  const prevPeriodStart = subDays(periodStart, 7);

  const [
    unitsCount,
    contactsCount,
    activeQrs,
    currentScans,
    prevScans,
    gatesCount,
  ] = await Promise.all([
    prisma.unit.count({
      where: { projectId, organizationId, deletedAt: null },
    }),
    prisma.contact.count({
      where: {
        organizationId,
        units: { some: { unit: { projectId } } },
        deletedAt: null,
      },
    }),
    prisma.qRCode.count({
      where: {
        projectId,
        organizationId,
        isActive: true,
        deletedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
    }),
    prisma.scanLog.count({
      where: {
        gate: { projectId, organizationId },
        scannedAt: { gte: periodStart },
        deletedAt: null,
      },
    }),
    prisma.scanLog.count({
      where: {
        gate: { projectId, organizationId },
        scannedAt: { gte: prevPeriodStart, lt: periodStart },
        deletedAt: null,
      },
    }),
    prisma.gate.count({
      where: { projectId, organizationId, deletedAt: null },
    }),
  ]);

  let scanGrowth = 0;
  if (prevScans > 0) {
    scanGrowth = Math.round(((currentScans - prevScans) / prevScans) * 100);
  } else if (currentScans > 0) {
    scanGrowth = 100;
  }

  return {
    unitsCount,
    contactsCount,
    activeQrs,
    scanVolume: currentScans,
    scanGrowth,
    gatesCount,
  };
}
