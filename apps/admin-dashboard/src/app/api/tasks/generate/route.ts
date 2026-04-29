import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { type NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const runtime = 'nodejs';
export const maxDuration = 45;

/**
 * AI Task Generation Endpoint
 *
 * Converts natural language descriptions into structured task lists
 * across multiple GateFlow departments.
 */
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthorized(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { prompt, organizationId, boardId } = body;

    if (!prompt || !organizationId || !boardId) {
      return NextResponse.json(
        { error: 'prompt, organizationId, and boardId are required' }, 
        { status: 400 }
      );
    }

    // Verify board exists and belongs to the organization
    const board = await prisma.taskBoard.findFirst({
      where: { id: boardId, organizationId },
    });

    if (!board) {
      return NextResponse.json({ error: 'Task board not found' }, { status: 404 });
    }

    const google = createGoogleGenerativeAI({ apiKey });

    const result = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: z.object({
        tasks: z.array(z.object({
          title: z.string(),
          description: z.string(),
          priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
          estimatedMinutes: z.number().optional(),
          department: z.enum(['SALES', 'MARKETING', 'DEV', 'SUPPORT']),
        })),
        strategy: z.string(),
      }),
      prompt: `Plan a series of tasks for the following initiative on the GateFlow platform:
      
"${prompt}"

GateFlow is a MENA-focused access control and marketing intelligence platform.
Departments: SALES, MARKETING, DEV, SUPPORT.

Guidelines:
- Breakdown the initiative into 5-10 actionable tasks.
- Assign appropriate priorities.
- The strategy should explain the reasoning for this task breakdown in English.
- Do not include any PII.`,
    });

    // Create the tasks in the database and log the AI action
    const createdTasks = await prisma.$transaction(async (tx) => {
      const tasks = await Promise.all(result.object.tasks.map(task => 
        tx.task.create({
          data: {
            title: task.title,
            description: task.description,
            priority: task.priority,
            department: task.department,
            status: 'TODO',
            boardId: board.id,
            organizationId,
            createdById: 'system', // In a real app, this would be the session user ID
          }
        })
      ));

      await tx.aiActionLog.create({
        data: {
          organizationId,
          action: 'TASK_AI_GENERATED',
          prompt,
          reasoning: result.object.strategy,
          result: JSON.stringify(result.object.tasks),
          status: 'CONFIRMED',
          metadata: {
            taskCount: tasks.length,
            boardId: board.id,
          }
        }
      });

      return tasks;
    });

    return NextResponse.json({
      success: true,
      strategy: result.object.strategy,
      tasks: createdTasks,
    });
  } catch (error) {
    console.error('[TASK_GENERATE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
