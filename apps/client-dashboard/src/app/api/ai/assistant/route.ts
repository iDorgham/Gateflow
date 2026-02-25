import { streamText, tool, type CoreMessage } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { type NextRequest } from 'next/server';
import { prisma, UnitType } from '@gate-access/db';
import { QRCodeType as PrismaQRCodeType } from '@gate-access/db';
import { signQRPayload, QRCodeType, type QRPayload } from '@gate-access/types';
import { init as initCuid2 } from '@paralleldrive/cuid2';
import { getSessionClaims } from '@/lib/auth-cookies';
import { getValidatedProjectId } from '@/lib/project-cookie';

export const runtime = 'nodejs';
export const maxDuration = 30;

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

const createShortId = initCuid2({ length: 8 });

const QUOTA_DEFAULTS: Record<string, number> = {
  STUDIO: 3,
  ONE_BR: 5,
  TWO_BR: 8,
  THREE_BR: 10,
  FOUR_BR: 12,
  VILLA: 20,
  PENTHOUSE: 20,
  COMMERCIAL: 5,
};

export async function POST(request: NextRequest): Promise<Response> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: 'AI service not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages } = (await request.json()) as { messages: CoreMessage[] };

  const result = streamText({
    model: google('gemini-1.5-flash'),
    system: `You are the GateFlow AI Assistant — an intelligent helper for a gate access control SaaS platform.
You help users manage their organization through natural language.
You can create projects (with gates), units, QR codes, and retrieve scan data.

Rules:
- Always be concise and friendly.
- After a successful action, confirm what was done and include the ID.
- If a required field is missing, ask for it before proceeding.
- Respond in the SAME language the user writes in. Arabic → Arabic, English → English.
- Never invent or guess IDs. Only use IDs returned by previous tool calls or provided by the user.
- All actions are scoped to the user's organization (${claims.orgId}).`,
    messages,
    maxSteps: 6,
    tools: {
      // ── createProject ──────────────────────────────────────────────────────
      createProject: tool({
        description:
          'Create a new project in the organization, optionally with named gates.',
        parameters: z.object({
          name: z.string().min(1).describe('Project name'),
          gates: z
            .array(z.string().min(1))
            .default([])
            .describe('Gate names to create under this project'),
        }),
        execute: async ({ name, gates }) => {
          const project = await prisma.project.create({
            data: { name, organizationId: claims.orgId },
            select: { id: true, name: true },
          });

          const createdGates: { id: string; name: string }[] = [];
          for (const gateName of gates) {
            const gate = await prisma.gate.create({
              data: {
                name: gateName,
                organizationId: claims.orgId,
                projectId: project.id,
                isActive: true,
              },
              select: { id: true, name: true },
            });
            createdGates.push(gate);
          }

          return { success: true, project, gates: createdGates };
        },
      }),

      // ── createUnit ────────────────────────────────────────────────────────
      createUnit: tool({
        description: 'Create a residential unit (apartment, villa, etc.)',
        parameters: z.object({
          name: z.string().min(1).describe('Unit identifier, e.g. "A-101"'),
          type: z
            .enum([
              'STUDIO',
              'ONE_BR',
              'TWO_BR',
              'THREE_BR',
              'FOUR_BR',
              'VILLA',
              'PENTHOUSE',
              'COMMERCIAL',
            ])
            .describe('Unit type'),
          projectId: z.string().optional().describe('Project ID to link this unit to'),
          contactId: z
            .string()
            .optional()
            .describe('Contact ID to link as resident of this unit'),
          qrQuota: z
            .number()
            .int()
            .min(1)
            .optional()
            .describe('Override the default QR quota for this unit type'),
        }),
        execute: async ({ name, type, projectId, contactId, qrQuota }) => {
          if (projectId) {
            const proj = await prisma.project.findFirst({
              where: { id: projectId, organizationId: claims.orgId, deletedAt: null },
            });
            if (!proj) return { success: false, error: 'Project not found or unauthorized' };
          }

          if (contactId) {
            const contact = await prisma.contact.findFirst({
              where: { id: contactId, organizationId: claims.orgId, deletedAt: null },
            });
            if (!contact) return { success: false, error: 'Contact not found or unauthorized' };
          }

          const unit = await prisma.unit.create({
            data: {
              name,
              type: type as UnitType,
              qrQuota: qrQuota ?? QUOTA_DEFAULTS[type] ?? 5,
              organizationId: claims.orgId,
              ...(projectId ? { projectId } : {}),
            },
            select: { id: true, name: true, type: true, qrQuota: true },
          });

          if (contactId) {
            await prisma.contactUnit.create({
              data: { contactId, unitId: unit.id },
            });
          }

          return { success: true, unit };
        },
      }),

      // ── createQR ──────────────────────────────────────────────────────────
      createQR: tool({
        description:
          'Create one or more QR codes for gate access. Derives project scope from unit if provided.',
        parameters: z.object({
          count: z.number().int().min(1).max(20).default(1).describe('Number of QR codes to create'),
          type: z
            .enum(['SINGLE', 'RECURRING', 'PERMANENT'])
            .default('SINGLE')
            .describe('QR code type'),
          unitId: z
            .string()
            .optional()
            .describe('Unit ID — used to derive the project scope'),
          gateId: z
            .string()
            .optional()
            .describe('Gate ID to restrict this QR to a specific gate'),
          expiresAt: z
            .string()
            .optional()
            .describe('Expiry datetime in ISO 8601, e.g. "2026-03-01T23:59:00Z"'),
          maxUses: z
            .number()
            .int()
            .min(1)
            .optional()
            .describe('Max uses (required for RECURRING type)'),
        }),
        execute: async ({ count, type, unitId, gateId, expiresAt, maxUses }) => {
          const secret = process.env.QR_SIGNING_SECRET ?? '';
          if (!secret || secret.length < 32) {
            return { success: false, error: 'QR signing not configured on this server' };
          }

          // Validate gate belongs to org
          if (gateId) {
            const gate = await prisma.gate.findFirst({
              where: { id: gateId, organizationId: claims.orgId, deletedAt: null },
            });
            if (!gate) return { success: false, error: 'Gate not found or unauthorized' };
          }

          if (type === QRCodeType.RECURRING && (!maxUses || maxUses < 1)) {
            return { success: false, error: 'maxUses is required for RECURRING type' };
          }

          if (expiresAt && type !== QRCodeType.PERMANENT) {
            const expDate = new Date(expiresAt);
            if (isNaN(expDate.getTime()) || expDate <= new Date()) {
              return { success: false, error: 'expiresAt must be a valid future date' };
            }
          }

          // Derive projectId from unit if provided
          let resolvedProjectId: string | null = await getValidatedProjectId(claims.orgId);
          if (unitId) {
            const unit = await prisma.unit.findFirst({
              where: { id: unitId, organizationId: claims.orgId, deletedAt: null },
              select: { projectId: true },
            });
            if (!unit) return { success: false, error: 'Unit not found or unauthorized' };
            if (unit.projectId) resolvedProjectId = unit.projectId;
          }

          const resolvedMaxUses =
            type === QRCodeType.SINGLE
              ? 1
              : type === QRCodeType.PERMANENT
              ? null
              : (maxUses ?? null);

          const created: { qrId: string; shortUrl: string | null }[] = [];

          for (let i = 0; i < count; i++) {
            const qrId = randomUUID();
            const nonce = randomUUID();

            const payload: QRPayload = {
              qrId,
              organizationId: claims.orgId,
              type: type as QRCodeType,
              maxUses: resolvedMaxUses ?? null,
              expiresAt: type === QRCodeType.PERMANENT ? null : (expiresAt ?? null),
              issuedAt: new Date().toISOString(),
              nonce,
            };

            let qrString: string;
            try {
              qrString = signQRPayload(payload, secret);
            } catch (err) {
              return { success: false, error: (err as Error).message };
            }

            await prisma.qRCode.create({
              data: {
                code: qrString,
                type: type as unknown as PrismaQRCodeType,
                organizationId: claims.orgId,
                ...(resolvedProjectId ? { projectId: resolvedProjectId } : {}),
                gateId: gateId ?? null,
                maxUses: resolvedMaxUses,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                isActive: true,
              },
            });

            const shortId = createShortId();
            const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';
            const shortUrl = `${appUrl}/s/${shortId}`;
            const linkExpiresAt = expiresAt
              ? new Date(new Date(expiresAt).getTime() + 60 * 60 * 1000)
              : new Date(Date.now() + 24 * 60 * 60 * 1000);

            try {
              await prisma.qrShortLink.create({
                data: {
                  shortId,
                  fullPayload: qrString,
                  qrId,
                  organizationId: claims.orgId,
                  ...(resolvedProjectId ? { projectId: resolvedProjectId } : {}),
                  expiresAt: linkExpiresAt,
                },
              });
              created.push({ qrId, shortUrl });
            } catch {
              created.push({ qrId, shortUrl: null });
            }
          }

          return { success: true, count: created.length, qrCodes: created };
        },
      }),

      // ── listRecentScans ───────────────────────────────────────────────────
      listRecentScans: tool({
        description: 'List recent scan logs for the organization or a specific project.',
        parameters: z.object({
          projectId: z.string().optional().describe('Filter by project ID'),
          limit: z
            .number()
            .int()
            .min(1)
            .max(50)
            .default(10)
            .describe('Number of results'),
        }),
        execute: async ({ projectId, limit }) => {
          if (projectId) {
            const proj = await prisma.project.findFirst({
              where: { id: projectId, organizationId: claims.orgId, deletedAt: null },
            });
            if (!proj) return { success: false, error: 'Project not found or unauthorized' };
          }

          const scans = await prisma.scanLog.findMany({
            where: {
              qrCode: {
                organizationId: claims.orgId,
                ...(projectId ? { projectId } : {}),
              },
            },
            select: {
              id: true,
              status: true,
              scannedAt: true,
              gate: { select: { name: true } },
            },
            orderBy: { scannedAt: 'desc' },
            take: limit,
          });

          return {
            success: true,
            count: scans.length,
            scans: scans.map((s) => ({
              id: s.id,
              status: s.status,
              gateName: s.gate.name,
              scannedAt: s.scannedAt,
            })),
          };
        },
      }),

      // ── getProjectStats ───────────────────────────────────────────────────
      getProjectStats: tool({
        description:
          'Get statistics (QR codes, gates, scans) for a project or the whole organization.',
        parameters: z.object({
          projectId: z
            .string()
            .optional()
            .describe('Project ID to scope. Omit for org-wide stats.'),
        }),
        execute: async ({ projectId }) => {
          if (projectId) {
            const proj = await prisma.project.findFirst({
              where: { id: projectId, organizationId: claims.orgId, deletedAt: null },
            });
            if (!proj) return { success: false, error: 'Project not found or unauthorized' };
          }

          const qrFilter = {
            organizationId: claims.orgId,
            deletedAt: null as null,
            ...(projectId ? { projectId } : {}),
          };
          const scanFilter = {
            qrCode: {
              organizationId: claims.orgId,
              ...(projectId ? { projectId } : {}),
            },
          };

          const [totalQR, activeQR, gates, scans, projects] = await Promise.all([
            prisma.qRCode.count({ where: qrFilter }),
            prisma.qRCode.count({ where: { ...qrFilter, isActive: true } }),
            prisma.gate.count({
              where: {
                organizationId: claims.orgId,
                deletedAt: null,
                ...(projectId ? { projectId } : {}),
              },
            }),
            prisma.scanLog.count({ where: scanFilter }),
            projectId
              ? Promise.resolve(1)
              : prisma.project.count({
                  where: { organizationId: claims.orgId, deletedAt: null },
                }),
          ]);

          return {
            success: true,
            stats: { projects, gates, totalQRCodes: totalQR, activeQRCodes: activeQR, totalScans: scans },
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
