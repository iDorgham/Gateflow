import { streamText, tool, type CoreMessage } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { init as initCuid2 } from '@paralleldrive/cuid2';
import { type NextRequest } from 'next/server';
import { prisma, UnitType, QRCodeType as PrismaQRCodeType, TaskStatus } from '@gate-access/db';
import { signQRPayload, QRCodeType } from '@gate-access/types';
import { getSessionClaims } from '@/lib/auth-cookies';

export const runtime = 'nodejs';
export const maxDuration = 30;

const createShortId = initCuid2({ length: 8 });

function log(msg: string, data?: unknown) {
  const line = `[${new Date().toISOString()}] ${msg}${data ? ' ' + JSON.stringify(data) : ''}`;
  console.log(line);
}

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

// ─── QR creation helper (mirrors qrcodes/create/actions.ts) ──────────────────

interface QRCreateOptions {
  orgId: string;
  type: QRCodeType;
  gateId?: string | null;
  maxUses?: number | null;
  expiresAt?: string | null;
  guestName?: string | null;
  guestEmail?: string | null;
}

async function createOneQR(opts: QRCreateOptions): Promise<{ qrId: string; shortUrl: string | null }> {
  const secret = process.env.QR_SIGNING_SECRET ?? '';
  const resolvedMaxUses =
    opts.type === QRCodeType.SINGLE ? 1 : opts.type === QRCodeType.PERMANENT ? null : (opts.maxUses ?? null);

  const qrId = randomUUID();
  const nonce = randomUUID();

  const payload = {
    qrId,
    organizationId: opts.orgId,
    type: opts.type,
    maxUses: resolvedMaxUses,
    expiresAt: opts.type === QRCodeType.PERMANENT ? null : (opts.expiresAt ?? null),
    issuedAt: new Date().toISOString(),
    nonce,
  };

  const qrString = signQRPayload(payload, secret);

  await prisma.qRCode.create({
    data: {
      code: qrString,
      type: opts.type as unknown as PrismaQRCodeType,
      organizationId: opts.orgId,
      gateId: opts.gateId ?? null,
      maxUses: resolvedMaxUses,
      expiresAt: opts.expiresAt ? new Date(opts.expiresAt) : null,
      isActive: true,
      guestName: opts.guestName ?? null,
      guestEmail: opts.guestEmail ?? null,
    },
  });

  const shortId = createShortId();
  const appUrl = process.env.NEXT_PUBLIC_QR_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';
  const shortUrl = `${appUrl}/s/${shortId}`;
  const linkExpiresAt = opts.expiresAt
    ? new Date(new Date(opts.expiresAt).getTime() + 60 * 60 * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  try {
    await prisma.qrShortLink.create({
      data: {
        shortId,
        fullPayload: qrString,
        qrId,
        organizationId: opts.orgId,
        expiresAt: linkExpiresAt,
      },
    });
    return { qrId, shortUrl };
  } catch {
    return { qrId, shortUrl: null };
  }
}

// ─── Route ────────────────────────────────────────────────────────────────────

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

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { messages } = body as { messages: CoreMessage[] };

  try {
    const result = streamText({
      model: google('gemini-1.5-flash'),
      system: `You are the GateFlow AI Assistant — an intelligent helper for a gate access control SaaS platform.
You help users manage their organization through natural language.

Available tools and what they do:
- createQR: Create 1–20 signed QR access codes (supports SINGLE/RECURRING/PERMANENT types).
- createProject: Create a new project with optional named gates.
- createUnit: Create a residential unit (apartment, villa, etc.).
- createTask: Create a task for the team (title, description, due date).
- getOrgStats: Get real-time counts: projects, gates, QR codes, contacts, units, scans.
- listProjects: List all projects with gate and unit counts.
- listGates: List active gates (optionally filter by project).
- listContacts: Search contacts by name or email.
- listRecentScans: Get the last 20 scan logs.
- listUnits: List units (optionally filter by project or type).

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

        // ── createQR ──────────────────────────────────────────────────────────
        createQR: tool({
          description: 'Create one or more signed QR access codes. Use count > 1 to create a set.',
          parameters: z.object({
            count: z.number().int().min(1).max(20).default(1).describe('Number of QR codes to create (1–20)'),
            type: z.enum(['SINGLE', 'RECURRING', 'PERMANENT']).default('SINGLE').describe('QR code type'),
            gateId: z.string().optional().describe('Restrict to a specific gate ID'),
            expiresAt: z.string().optional().describe('ISO expiry date (e.g. 2026-04-01T00:00:00Z)'),
            maxUses: z.number().int().min(1).optional().describe('Required for RECURRING type'),
            guestName: z.string().optional().describe('Optional guest name to associate'),
            guestEmail: z.string().optional().describe('Optional guest email to associate'),
          }),
          execute: async ({ count, type, gateId, expiresAt, maxUses, guestName, guestEmail }) => {
            log('createQR', { count, type });
            const secret = process.env.QR_SIGNING_SECRET ?? '';
            if (!secret || secret.length < 32) {
              return { success: false, error: 'QR_SIGNING_SECRET not configured.' };
            }
            const created: { qrId: string; shortUrl: string | null }[] = [];
            for (let i = 0; i < count; i++) {
              const result = await createOneQR({
                orgId: claims.orgId,
                type: type as QRCodeType,
                gateId: gateId ?? null,
                expiresAt: expiresAt ?? null,
                maxUses: maxUses ?? null,
                guestName: guestName ?? null,
                guestEmail: guestEmail ?? null,
              });
              created.push(result);
            }
            return { success: true, created, count: created.length };
          },
        }),

        // ── createProject ─────────────────────────────────────────────────────
        createProject: tool({
          description: 'Create a new project in the organization, optionally with named gates.',
          parameters: z.object({
            name: z.string().min(1).describe('Project name'),
            gates: z.array(z.string().min(1)).default([]).describe('Gate names to create under this project'),
          }),
          execute: async ({ name, gates }) => {
            log('createProject', { name, gates });
            const project = await prisma.project.create({
              data: { name, organizationId: claims.orgId },
              select: { id: true, name: true },
            });
            const createdGates = [];
            for (const gateName of gates) {
              const gate = await prisma.gate.create({
                data: { name: gateName, organizationId: claims.orgId, projectId: project.id, isActive: true },
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
            type: z.enum(['STUDIO', 'ONE_BR', 'TWO_BR', 'THREE_BR', 'FOUR_BR', 'VILLA', 'PENTHOUSE', 'COMMERCIAL']),
            projectId: z.string().optional().describe('Project ID to link this unit to'),
            contactId: z.string().optional().describe('Contact ID to link as resident'),
          }),
          execute: async ({ name, type, projectId, contactId }) => {
            log('createUnit', { name, type });
            const QUOTA: Record<string, number> = {
              STUDIO: 3, ONE_BR: 5, TWO_BR: 8, THREE_BR: 10, FOUR_BR: 12, VILLA: 20, PENTHOUSE: 20, COMMERCIAL: 5,
            };
            const unit = await prisma.unit.create({
              data: {
                name, type: type as UnitType, qrQuota: QUOTA[type] ?? 5,
                organizationId: claims.orgId,
                ...(projectId ? { projectId } : {}),
              },
              select: { id: true, name: true, type: true },
            });
            if (contactId) {
              await prisma.contactUnit.create({ data: { contactId, unitId: unit.id } });
            }
            return { success: true, unit };
          },
        }),

        // ── getOrgStats ───────────────────────────────────────────────────────
        getOrgStats: tool({
          description: 'Get real-time counts for the organization: projects, gates, QR codes, contacts, units, scans.',
          parameters: z.object({}),
          execute: async () => {
            log('getOrgStats');
            const [projects, gates, qrCodes, contacts, units, scans] = await Promise.all([
              prisma.project.count({ where: { organizationId: claims.orgId, deletedAt: null } }),
              prisma.gate.count({ where: { organizationId: claims.orgId, deletedAt: null } }),
              prisma.qRCode.count({ where: { organizationId: claims.orgId, deletedAt: null, isActive: true } }),
              prisma.contact.count({ where: { organizationId: claims.orgId, deletedAt: null } }),
              prisma.unit.count({ where: { organizationId: claims.orgId, deletedAt: null } }),
              prisma.scanLog.count({ where: { gate: { organizationId: claims.orgId } } }),
            ]);
            return { success: true, stats: { projects, gates, activeQRCodes: qrCodes, contacts, units, totalScans: scans } };
          },
        }),

        // ── listProjects ──────────────────────────────────────────────────────
        listProjects: tool({
          description: 'List all projects with gate and unit counts.',
          parameters: z.object({}),
          execute: async () => {
            log('listProjects');
            const projects = await prisma.project.findMany({
              where: { organizationId: claims.orgId, deletedAt: null },
              select: {
                id: true, name: true, createdAt: true,
                _count: { select: { gates: true, units: true } },
              },
              orderBy: { name: 'asc' },
              take: 20,
            });
            return {
              success: true,
              projects: projects.map((p) => ({
                id: p.id, name: p.name,
                gateCount: p._count.gates, unitCount: p._count.units,
                createdAt: p.createdAt.toISOString(),
              })),
            };
          },
        }),

        // ── listGates ─────────────────────────────────────────────────────────
        listGates: tool({
          description: 'List active gates, optionally filtered by project.',
          parameters: z.object({ projectId: z.string().optional() }),
          execute: async ({ projectId }) => {
            log('listGates', { projectId });
            const gates = await prisma.gate.findMany({
              where: {
                organizationId: claims.orgId, deletedAt: null, isActive: true,
                ...(projectId ? { projectId } : {}),
              },
              select: { id: true, name: true, isActive: true, project: { select: { name: true } } },
              take: 20,
            });
            return {
              success: true,
              gates: gates.map((g) => ({ id: g.id, name: g.name, isActive: g.isActive, projectName: g.project?.name ?? null })),
            };
          },
        }),

        // ── listContacts ──────────────────────────────────────────────────────
        listContacts: tool({
          description: 'Search and list contacts by name or email.',
          parameters: z.object({ search: z.string().optional().describe('Optional search term') }),
          execute: async ({ search }) => {
            log('listContacts', { search });
            const contacts = await prisma.contact.findMany({
              where: {
                organizationId: claims.orgId, deletedAt: null,
                ...(search ? {
                  OR: [
                    { firstName: { contains: search, mode: 'insensitive' as const } },
                    { lastName: { contains: search, mode: 'insensitive' as const } },
                    { email: { contains: search, mode: 'insensitive' as const } },
                  ],
                } : {}),
              },
              select: { id: true, firstName: true, lastName: true, email: true, phone: true },
              take: 10,
            });
            return {
              success: true,
              contacts: contacts.map((c) => ({
                id: c.id, name: `${c.firstName} ${c.lastName}`, email: c.email, phone: c.phone,
              })),
            };
          },
        }),

        // ── listRecentScans ───────────────────────────────────────────────────
        listRecentScans: tool({
          description: 'Get the last 20 scan logs for the organization.',
          parameters: z.object({ gateId: z.string().optional().describe('Optional gate filter') }),
          execute: async ({ gateId }) => {
            log('listRecentScans', { gateId });
            const scans = await prisma.scanLog.findMany({
              where: {
                gate: { organizationId: claims.orgId },
                ...(gateId ? { gateId } : {}),
              },
              select: { id: true, status: true, scannedAt: true, gate: { select: { name: true } } },
              orderBy: { scannedAt: 'desc' },
              take: 20,
            });
            return {
              success: true,
              scans: scans.map((s) => ({
                id: s.id, status: s.status, gateName: s.gate.name,
                scannedAt: s.scannedAt.toISOString(),
              })),
            };
          },
        }),

        // ── listUnits ─────────────────────────────────────────────────────────
        listUnits: tool({
          description: 'List residential units, optionally filtered by project or unit type.',
          parameters: z.object({
            projectId: z.string().optional(),
            unitType: z.enum(['STUDIO', 'ONE_BR', 'TWO_BR', 'THREE_BR', 'FOUR_BR', 'VILLA', 'PENTHOUSE', 'COMMERCIAL']).optional(),
          }),
          execute: async ({ projectId, unitType }) => {
            log('listUnits', { projectId, unitType });
            const units = await prisma.unit.findMany({
              where: {
                organizationId: claims.orgId, deletedAt: null,
                ...(projectId ? { projectId } : {}),
                ...(unitType ? { type: unitType as UnitType } : {}),
              },
              select: { id: true, name: true, type: true, building: true, qrQuota: true },
              take: 20,
            });
            return { success: true, units };
          },
        }),

        // ── createTask ────────────────────────────────────────────────────────
        createTask: tool({
          description: 'Create a task for the organization team.',
          parameters: z.object({
            title: z.string().min(1).max(200).describe('Task title'),
            description: z.string().optional().describe('Optional task description'),
            dueDate: z.string().optional().describe('Optional due date (ISO format, e.g. 2026-04-01)'),
          }),
          execute: async ({ title, description, dueDate }) => {
            log('createTask', { title });
            const task = await prisma.task.create({
              data: {
                title,
                description: description ?? null,
                dueDate: dueDate ? new Date(dueDate) : null,
                organizationId: claims.orgId,
                createdBy: claims.sub ?? null,
                status: TaskStatus.TODO,
              },
              select: { id: true, title: true, status: true },
            });
            return { success: true, task };
          },
        }),
      },

      onFinish: ({ text, toolCalls }) => {
        log('AI Finish', { textLength: text?.length, toolCallCount: toolCalls?.length });
      },
    });

    return result.toDataStreamResponse();
  } catch (err) {
    log('FATAL AI ERROR', (err as Error).message);
    return new Response(
      JSON.stringify({ error: (err as Error).message || 'Internal AI Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
