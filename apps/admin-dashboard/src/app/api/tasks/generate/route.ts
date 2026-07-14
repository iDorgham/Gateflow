import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import type { Department, TaskPriority } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { trackAiUsage } from '@/lib/ai-usage-tracker';

/**
 * AI Task Generation API
 * POST /api/tasks/generate
 * Body: { prompt: string, orgId: string, department: string }
 */
export async function POST(req: Request) {
  if (!(await isAdminAuthorized(req))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { prompt, orgId, department } = await req.json();

    if (!prompt || !orgId || !department) {
      return NextResponse.json(
        {
          error: 'Missing required fields (prompt, orgId, department)',
        },
        { status: 400 }
      );
    }

    // 1. Fetch Department Board
    const board = await prisma.taskBoard.findFirst({
      where: { organizationId: orgId, department: department as Department },
    });

    if (!board) {
      return NextResponse.json(
        {
          error: `No TaskBoard found for department: ${department}`,
        },
        { status: 404 }
      );
    }

    // 2. Generate Structured Tasks (Vercel AI SDK v6)
    const { object, usage } = await generateObject({
      model: google('gemini-1.5-pro'),
      schema: z.object({
        tasks: z
          .array(
            z.object({
              title: z.string(),
              description: z.string(),
              priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
              suggestedAssignee: z.string().optional(),
              daysToComplete: z.number().optional(), // Days from now
            })
          )
          .min(1)
          .max(10),
      }),
      system: `
        You are a GateFlow Productivity AI. 
        Transform a project request into a structured list of tasks for the ${department} department.
        Keep tasks concise and professional.
      `,
      prompt: `Project: ${prompt}`,
    });

    // Record AI Cost Tracking
    await (trackAiUsage as any)({
      model: 'gemini-1.5-pro',
      usage: {
        promptTokens: (usage as any).promptTokens || 0,
        completionTokens: (usage as any).completionTokens || 0,
      },
      department: department as Department,
      action: 'TASK_AI_GENERATED',
    });

    // 3. Create Tasks in DB
    // For simplicity, we find the first user in the org to own/assign if not specified
    const adminUser = await prisma.user.findFirst({
      where: { organizationId: orgId, role: { name: 'SUPER_ADMIN' } },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: 'No admin user found to assign tasks' },
        { status: 400 }
      );
    }

    const createdTasks = await Promise.all(
      object.tasks.map(async (t) => {
        const dueDate = t.daysToComplete
          ? new Date(Date.now() + t.daysToComplete * 24 * 60 * 60 * 1000)
          : undefined;

        return prisma.task.create({
          data: {
            title: t.title,
            description: t.description,
            priority: t.priority as TaskPriority,
            status: 'TODO',
            department: department as Department,
            organizationId: orgId,
            boardId: board.id,
            createdById: adminUser.id,
            dueDate,
          },
        });
      })
    );

    // 4. Log AI Action
    await prisma.aiActionLog.create({
      data: {
        organizationId: orgId,
        action: 'TASK_AI_GENERATED',
        status: 'CONFIRMED',
        prompt: prompt,
        result: `Generated ${createdTasks.length} tasks.`,
        metadata: JSON.stringify({
          boardId: board.id,
          taskIds: createdTasks.map((t: { id: string }) => t.id),
        }),
      },
    });

    return NextResponse.json({
      success: true,
      tasks: createdTasks,
    });
  } catch (error) {
    console.error('[TASK_GENERATE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
