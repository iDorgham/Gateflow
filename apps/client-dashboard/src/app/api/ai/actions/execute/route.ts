import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/dashboard-auth';
import { hasPermission } from '@/lib/auth';
import { AiActionService } from '@/lib/ai/ai-action-service';
import { AiTaskService } from '@/lib/ai/ai-task-service';
import { prisma } from '@gate-access/db';

const ExecuteSchema = z.object({
  actionId: z.string().min(1),
});

const ScheduleIntentSchema = z.object({
  title: z.string().trim().min(1).max(200),
  cron: z.enum(['daily', 'weekly', '0 0 * * *', '0 0 * * 0']).optional(),
  params: z
    .object({
      taskType: z.string().trim().min(1).max(100).default('REPORT_GEN'),
    })
    .passthrough(),
});

const BulkQrIntentSchema = z.object({
  count: z.number().int().min(1).max(100).default(1),
  type: z
    .enum(['SINGLE', 'RECURRING', 'PERMANENT', 'VISITOR', 'OPEN'])
    .default('SINGLE'),
  validUntil: z
    .string()
    .datetime()
    .refine((val) => new Date(val).getTime() > Date.now(), {
      message: 'validUntil must be in the future',
    })
    .optional(),
  tag: z.string().trim().max(100).optional(),
  assignTo: z.string().trim().max(200).optional(),
  projectId: z.string().min(1).optional(),
  gateId: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    if (!session || !session.user.organizationId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const parsedRequest = ExecuteSchema.safeParse(await req.json());
    if (!parsedRequest.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const { actionId } = parsedRequest.data;
    const scope = {
      actionId,
      organizationId: session.user.organizationId,
      userId: session.user.id,
    };

    const action = await AiActionService.claimPendingAction(scope);
    if (!action) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 });
    }

    const requiredPermission =
      action.actionType === 'SCHEDULE_TASK'
        ? 'workspace:manage'
        : action.actionType === 'BULK_QR_CREATE'
          ? 'qr:create'
          : null;
    if (
      !requiredPermission ||
      !hasPermission(session.claims, requiredPermission)
    ) {
      await AiActionService.completeClaimedAction({
        ...scope,
        status: 'FAILED',
        result: 'Action is not permitted',
      });
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let result: string;
    try {
      if (action.actionType === 'SCHEDULE_TASK') {
        const intent = ScheduleIntentSchema.parse(action.intentJson);
        await AiTaskService.createTask({
          organizationId: session.user.organizationId,
          type: intent.params.taskType,
          title: intent.title,
          cron: intent.cron,
          params: intent.params,
        });
        result = 'Task successfully scheduled.';
      } else {
        const intent = BulkQrIntentSchema.parse(action.intentJson);
        const { count, type, validUntil, tag, assignTo, projectId, gateId } =
          intent;

        if (projectId) {
          const project = await prisma.project.findFirst({
            where: {
              id: projectId,
              organizationId: session.user.organizationId,
              deletedAt: null,
            },
            select: { id: true },
          });
          if (!project) throw new Error('Invalid action target');
        }
        if (gateId) {
          const gate = await prisma.gate.findFirst({
            where: {
              id: gateId,
              organizationId: session.user.organizationId,
              deletedAt: null,
            },
            select: { id: true },
          });
          if (!gate) throw new Error('Invalid action target');
        }

        const qrs = [];
        for (let i = 0; i < count; i++) {
          const randomCode = Math.random()
            .toString(36)
            .substring(2, 10)
            .toUpperCase();
          qrs.push({
            organizationId: session.user.organizationId,
            projectId: projectId || null,
            gateId: gateId || null,
            code: `GF-${randomCode}`,
            type,
            isActive: true,
            expiresAt: validUntil ? new Date(validUntil) : null,
            guestName: assignTo || null,
            utmCampaign: tag || 'ai-bulk-gen',
          });
        }

        await prisma.qRCode.createMany({
          data: qrs,
        });

        result = `Successfully created ${qrs.length} QR codes.`;
      }

      await AiActionService.completeClaimedAction({
        ...scope,
        status: 'EXECUTED',
        result,
      });
      return NextResponse.json({ success: true, result });
    } catch (execError: unknown) {
      console.error('>>> [AiAction API] Execution failed:', execError);
      await AiActionService.completeClaimedAction({
        ...scope,
        status: 'FAILED',
        result: 'Action execution failed',
      });
      return NextResponse.json(
        { error: 'Action execution failed' },
        { status: 422 }
      );
    }
  } catch (error: unknown) {
    console.error('>>> [AiAction API] Fatal Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
