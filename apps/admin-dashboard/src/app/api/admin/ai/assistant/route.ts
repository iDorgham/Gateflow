import { streamText, tool } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { type NextRequest } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthorized(request))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY is not configured' }),
      { status: 503 }
    );
  }

  const google = createGoogleGenerativeAI({ apiKey });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
    });
  }

  const { messages } = body as {
    messages: { role: string; content: string }[];
  };

  const result = streamText({
    model: google('gemini-1.5-flash') as any,
    system: `You are the GateFlow platform administrator AI assistant. You have read-only access to platform data.
You can answer questions about organizations, users, scan activity, and platform health.
Keep responses concise and data-driven. Always refer to data from the available tools.
Never make up data — use tools to fetch real information.`,
    messages: (messages as any[]).map((msg) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    })),
    // @ts-expect-error - Tools property has type mismatch in this workspace version
    tools: {
      getPlatformMetrics: tool({
        description:
          'Get platform-wide metrics: total organizations, total users, scans today, scans this month',
        parameters: z.object({}),
        execute: async () => {
          const now = new Date();
          const todayStart = new Date(now);
          todayStart.setHours(0, 0, 0, 0);
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

          const [totalOrgs, totalUsers, scansToday, scansThisMonth] =
            await Promise.all([
              prisma.organization.count({ where: { deletedAt: null } }),
              prisma.user.count({ where: { deletedAt: null } }),
              prisma.scanLog.count({
                where: { scannedAt: { gte: todayStart } },
              }),
              prisma.scanLog.count({
                where: { scannedAt: { gte: monthStart } },
              }),
            ]);

          return { totalOrgs, totalUsers, scansToday, scansThisMonth };
        },
      }) as any,

      listRecentOrgs: tool({
        description: 'List the most recently created organizations',
        parameters: z.object({
          limit: z
            .number()
            .min(1)
            .max(20)
            .default(5)
            .describe('Number of orgs to return'),
        }),
        execute: async ({ limit }: { limit: number }) => {
          const orgs = await prisma.organization.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
              id: true,
              name: true,
              plan: true,
              createdAt: true,
              users: { select: { id: true } },
            },
          });
          return orgs.map(
            (o: {
              id: string;
              name: string;
              plan: any;
              createdAt: Date;
              users: any[];
            }) => ({
              id: o.id,
              name: o.name,
              plan: String(o.plan),
              createdAt: o.createdAt.toISOString(),
              userCount: o.users.length,
            })
          );
        },
      }) as any,

      getOrgStats: tool({
        description:
          'Get detailed stats for a specific organization by name or ID',
        parameters: z.object({
          query: z.string().describe('Organization name (partial) or ID'),
        }),
        execute: async ({ query }: { query: string }) => {
          const org = await prisma.organization.findFirst({
            where: {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { id: query },
              ],
            },
            select: {
              id: true,
              name: true,
              plan: true,
              email: true,
              createdAt: true,
              deletedAt: true,
              users: { select: { id: true } },
              qrCodes: { select: { id: true } },
              gates: { select: { id: true } },
            },
          });
          if (!org) return { error: 'Organization not found' };
          const scansTotal = await prisma.scanLog.count({
            where: { qrCode: { organizationId: org.id } },
          });
          return {
            id: org.id,
            name: org.name,
            plan: String(org.plan),
            email: org.email,
            createdAt: org.createdAt.toISOString(),
            deletedAt: org.deletedAt?.toISOString() ?? null,
            userCount: org.users.length,
            qrCount: org.qrCodes.length,
            gateCount: org.gates.length,
            scansTotal,
          };
        },
      }) as any,

      listRecentScans: tool({
        description:
          'List the most recent scan log entries across all organizations',
        parameters: z.object({
          limit: z
            .number()
            .min(1)
            .max(20)
            .default(10)
            .describe('Number of scans to return'),
        }),
        execute: async ({ limit }: { limit: number }) => {
          const scans = await prisma.scanLog.findMany({
            orderBy: { scannedAt: 'desc' },
            take: limit,
            select: {
              id: true,
              status: true,
              scannedAt: true,
              gate: { select: { name: true } },
              qrCode: { select: { organization: { select: { name: true } } } },
            },
          });
          return scans.map(
            (s: {
              id: string;
              status: any;
              scannedAt: Date;
              gate: { name: string } | null;
              qrCode: { organization: { name: string } | null } | null;
            }) => ({
              id: s.id,
              status: String(s.status),
              scannedAt: s.scannedAt.toISOString(),
              gate: s.gate?.name ?? null,
              org: s.qrCode?.organization?.name ?? null,
            })
          );
        },
      }) as any,

      searchUsers: tool({
        description: 'Search for users by name or email',
        parameters: z.object({
          query: z.string().describe('Name or email to search for'),
          limit: z.number().min(1).max(10).default(5),
        }),
        execute: async ({ query, limit }: { query: string; limit: number }) => {
          const users = await prisma.user.findMany({
            where: {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
              ],
            },
            take: limit,
            select: {
              id: true,
              name: true,
              email: true,
              deletedAt: true,
              role: { select: { name: true } },
              organization: { select: { name: true } },
            },
          });
          return users.map(
            (u: {
              id: string;
              name: string;
              email: string | null;
              deletedAt: Date | null;
              role: { name: string } | null;
              organization: { name: string } | null;
            }) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role?.name ?? null,
              org: u.organization?.name ?? null,
              suspended: u.deletedAt !== null,
            })
          );
        },
      }) as any,
    } as any,
  } as any);

  return result.toTextStreamResponse();
}
