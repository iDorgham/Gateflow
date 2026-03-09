/**
 * Shared analytics query validation and filter building.
 * All analytics API routes use this for auth, org scope, and filter validation.
 */

import { z } from 'zod';
import { prisma } from '@gate-access/db';
import type { Prisma } from '@gate-access/db';

export const AnalyticsQuerySchema = z.object({
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  projectId: z.string().optional().default(''),
  gateId: z.string().optional().default(''),
  unitType: z.string().optional().default(''),
});

export type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>;

export interface ValidatedAnalyticsContext {
  orgId: string;
  dateFrom: string;
  dateTo: string;
  projectId: string;
  gateId: string;
  unitType: string;
  dateFromDate: Date;
  dateToDate: Date;
}

/** Build base Prisma where for ScanLogs (org-scoped via QRCode, date range, optional gate/project) */
export function buildScanLogWhere(
  ctx: ValidatedAnalyticsContext
): Prisma.ScanLogWhereInput {
  const qrFilter: Prisma.QRCodeWhereInput = {
    organizationId: ctx.orgId,
    deletedAt: null,
    ...(ctx.projectId ? { projectId: ctx.projectId } : {}),
  };

  return {
    qrCode: qrFilter,
    scannedAt: { gte: ctx.dateFromDate, lte: ctx.dateToDate },
    ...(ctx.gateId ? { gateId: ctx.gateId } : {}),
  };
}

/** Input shape accepted for validation (Zod output or equivalent) */
export type AnalyticsQueryInput = AnalyticsQuery;

/** Validate projectId and gateId belong to org; return validated context or null with error message */
export async function validateAnalyticsQuery(
  orgId: string,
  parsed: AnalyticsQueryInput
): Promise<{ ok: true; ctx: ValidatedAnalyticsContext } | { ok: false; message: string }> {
  const { dateFrom, dateTo, projectId = '', gateId = '', unitType = '' } = parsed;
  const dateFromDate = new Date(dateFrom + 'T00:00:00.000Z');
  const dateToDate = new Date(dateTo + 'T23:59:59.999Z');

  if (projectId) {
    const proj = await prisma.project.findFirst({
      where: { id: projectId, organizationId: orgId, deletedAt: null },
      select: { id: true },
    });
    if (!proj) return { ok: false, message: 'Invalid project' };
  }

  if (gateId) {
    const gate = await prisma.gate.findFirst({
      where: {
        id: gateId,
        organizationId: orgId,
        deletedAt: null,
        ...(projectId ? { projectId } : {}),
      },
      select: { id: true },
    });
    if (!gate) {
      return {
        ok: false,
        message: projectId ? 'Gate must belong to the selected project' : 'Invalid gate',
      };
    }
  }

  return {
    ok: true,
    ctx: {
      orgId,
      dateFrom,
      dateTo,
      projectId,
      gateId,
      unitType,
      dateFromDate,
      dateToDate,
    },
  };
}
