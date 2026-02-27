import { streamText, tool, type CoreMessage } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { appendFileSync } from 'fs';
import { type NextRequest } from 'next/server';
import { prisma, UnitType } from '@gate-access/db';
import { QRCodeType as PrismaQRCodeType } from '@gate-access/db';
import { signQRPayload, QRCodeType, type QRPayload } from '@gate-access/types';
import { init as initCuid2 } from '@paralleldrive/cuid2';
import { getSessionClaims } from '@/lib/auth-cookies';
import { getValidatedProjectId } from '@/lib/project-cookie';

export const runtime = 'nodejs';
export const maxDuration = 30;

const logFile = '/tmp/gateflow-ai.log';

function log(msg: string, data?: any) {
  const line = `[${new Date().toISOString()}] ${msg} ${data ? JSON.stringify(data, Object.getOwnPropertyNames(data)) : ''}\n`;
  try {
    appendFileSync(logFile, line);
  } catch {
    console.error(line);
  }
}

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
  log('POST request received');
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    log('Unauthorized: no orgId');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    log('AI service not configured: GEMINI_API_KEY missing');
    return new Response(JSON.stringify({ error: 'AI service not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    log('Failed to parse JSON body', err);
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { messages } = body as { messages: CoreMessage[] };
  log('Messages:', messages);

  try {
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
        createProject: tool({
          description: 'Create a new project in the organization, optionally with named gates.',
          parameters: z.object({
            name: z.string().min(1).describe('Project name'),
            gates: z.array(z.string().min(1)).default([]).describe('Gate names to create under this project'),
          }),
          execute: async ({ name, gates }) => {
            log('Executing createProject', { name, gates });
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
        createUnit: tool({
          description: 'Create a residential unit (apartment, villa, etc.)',
          parameters: z.object({
            name: z.string().min(1).describe('Unit identifier, e.g. "A-101"'),
            type: z.enum(['STUDIO', 'ONE_BR', 'TWO_BR', 'THREE_BR', 'FOUR_BR', 'VILLA', 'PENTHOUSE', 'COMMERCIAL']).describe('Unit type'),
            projectId: z.string().optional().describe('Project ID to link this unit to'),
            contactId: z.string().optional().describe('Contact ID to link as resident of this unit'),
          }),
          execute: async ({ name, type, projectId, contactId }) => {
            log('Executing createUnit', { name, type, projectId, contactId });
            const unit = await prisma.unit.create({
              data: { name, type: type as UnitType, qrQuota: QUOTA_DEFAULTS[type] ?? 5, organizationId: claims.orgId, ...(projectId ? { projectId } : {}) },
              select: { id: true, name: true, type: true },
            });
            if (contactId) {
              await prisma.contactUnit.create({ data: { contactId, unitId: unit.id } });
            }
            return { success: true, unit };
          },
        }),
        createQR: tool({
          description: 'Create one or more QR codes for gate access.',
          parameters: z.object({
            count: z.number().int().min(1).max(20).default(1),
            type: z.enum(['SINGLE', 'RECURRING', 'PERMANENT']).default('SINGLE'),
            unitId: z.string().optional(),
          }),
          execute: async ({ count, type, unitId }) => {
            log('Executing createQR', { count, type, unitId });
            // Simplified for debugging
            return { success: true, message: 'QR creation simulation success' };
          },
        }),
        getProjectStats: tool({
          description: 'Get statistics for a project or the organization.',
          parameters: z.object({ projectId: z.string().optional() }),
          execute: async ({ projectId }) => {
            log('Executing getProjectStats', { projectId });
            return { success: true, stats: { projects: 1, gates: 2, totalQRCodes: 10, activeQRCodes: 5, totalScans: 100 } };
          },
        }),
      },
      onFinish: ({ text, toolCalls, toolResults }) => {
        log('AI Finish', { text, toolCalls, toolResults });
      },
    });

    log('Success: returning data stream');
    return result.toDataStreamResponse();
  } catch (err) {
    log('FATAL AI ERROR', err);
    return new Response(JSON.stringify({ error: (err as Error).message || 'Internal AI Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
