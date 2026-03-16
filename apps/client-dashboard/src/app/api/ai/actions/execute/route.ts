
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/dashboard-auth';
import { AiActionService } from '@/lib/ai/ai-action-service';
import { AiTaskService } from '@/lib/ai/ai-task-service';
import { prisma } from '@gate-access/db';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    if (!session || !session.user.organizationId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { actionId, actionType, intentJson } = await req.json();

    if (!actionId) {
      return NextResponse.json({ error: 'Missing actionId' }, { status: 400 });
    }

    // 1. Get and verify action
    const action = await AiActionService.getAction(actionId);
    if (!action || action.status !== 'PENDING') {
      return NextResponse.json({ error: 'Action not found or already processed' }, { status: 400 });
    }

    // 2. Mark as confirmed/executing
    await AiActionService.updateStatus(actionId, 'CONFIRMED');

    // 3. Execute the actual logic based on actionType
    let result = '';
    
    try {
      if (actionType === 'SCHEDULE_TASK') {
        const { title, cron, params } = intentJson;
        await AiTaskService.createTask({
          organizationId: session.user.organizationId,
          userId: session.user.id,
          type: params.taskType || 'REPORT_GEN',
          title,
          cron,
          params,
        });
        result = 'Task successfully scheduled.';
      } else if (actionType === 'BULK_QR_CREATE') {
        const { count, type, validUntil, tag, assignTo, projectId, gateId } = intentJson;
        
        const qrs = [];
        for (let i = 0; i < (count || 1); i++) {
          const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
          qrs.push({
            organizationId: session.user.organizationId,
            projectId: projectId || null,
            gateId: gateId || null,
            code: `GF-${randomCode}`,
            type: type || 'VIRTUAL',
            isActive: true,
            expiresAt: validUntil ? new Date(validUntil) : null,
            guestName: assignTo || null,
            utmCampaign: tag || 'ai-bulk-gen',
          });
        }

        await (prisma as any).qRCode.createMany({
          data: qrs,
        });

        result = `Successfully created ${qrs.length} QR codes.`;
      } else {
        throw new Error(`Unsupported action type: ${actionType}`);
      }

      // 4. Mark as executed
      await AiActionService.updateStatus(actionId, 'EXECUTED', result);
      return NextResponse.json({ success: true, result });
      
    } catch (execError: any) {
      console.error(`>>> [AiAction API] Execution failed:`, execError);
      await AiActionService.updateStatus(actionId, 'FAILED', execError.message);
      return NextResponse.json({ error: execError.message }, { status: 500 });
    }

  } catch (error: any) {
    console.error('>>> [AiAction API] Fatal Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
