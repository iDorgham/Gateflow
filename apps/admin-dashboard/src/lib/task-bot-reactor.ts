import { prisma } from '@gate-access/db';

/**
 * Task Bot Reactor
 * Handles automated task creation triggered by platform events.
 * Implements HiTL (Human-in-the-Loop) as requested in Phase 3.
 */
export async function reactToBotEvent(event: string, context: any) {
  try {
    // 1. Fetch matching active rules for this department/event
    const rules = await (prisma as any).taskBotRule.findMany({
      where: {
        organizationId: context.organizationId,
        triggerEvent: event,
        enabled: true,
      },
    });

    if (rules.length === 0) return;

    for (const rule of rules) {
      // 2. Apply Conditions logic (Stub - assumes basic match for now)
      // In a real app, evaluate rule.conditions against context.metadata

      const actionTemplate = rule.actionTemplate as any;
      const deptBoard = await (prisma as any).taskBoard.findFirst({
        where: {
          organizationId: context.organizationId,
          department: rule.department,
        },
      });

      if (!deptBoard) {
        console.error(
          `[BOT_REACTOR] No board found for department ${rule.department} in org ${context.organizationId}`
        );
        continue;
      }

      // 3. Create Automated Task
      // If autoExecute: false (HiTL), task is created but show "Pending Approval" in the UI logic.
      const task = await (prisma as any).task.create({
        data: {
          title:
            actionTemplate.title ||
            `Automated Follow-up for ${context.linkedType}`,
          description:
            actionTemplate.description ||
            `Rule ${rule.name} triggered by ${event}.`,
          status: 'TODO',
          priority: actionTemplate.priority || 'MEDIUM',
          department: rule.department,
          organizationId: context.organizationId,
          boardId: deptBoard.id,
          createdById: rule.createdById, // The rule owner
          assigneeId: context.userId, // Default to event initiator
          linkedType: context.linkedType,
          linkedId: context.linkedId,
        },
      });

      // 4. Log AI Action & Handle HiTL Safeguards
      await (prisma as any).aiActionLog.create({
        data: {
          organizationId: context.organizationId,
          action: 'TASK_BOT_ACTION',
          status: rule.autoExecute ? 'CONFIRMED' : 'PENDING',
          prompt: `Rule: ${rule.name}, Trigger: ${event}`,
          result: `Task generated: ${task.id}`,
          metadata: JSON.stringify({
            ruleId: rule.id,
            autoExecute: rule.autoExecute,
            actionNeeded: !rule.autoExecute ? 'CONFIRM_BOT_TASK' : 'NONE',
          }),
        },
      });

      // 5. Build Notification for the user
      await (prisma as any).notification.create({
        data: {
          organizationId: context.organizationId,
          userId: context.userId,
          taskId: task.id,
          type: rule.autoExecute ? 'TASK_ASSIGNED' : 'BOT_ACTION_PENDING',
          message: rule.autoExecute
            ? `New automated task: ${task.title}`
            : `AI Bot ${rule.name} needs your approval to create a task.`,
          status: 'UNREAD',
        },
      });
    }
  } catch (error) {
    console.error('[BOT_REACTOR_ERROR]', error);
  }
}
