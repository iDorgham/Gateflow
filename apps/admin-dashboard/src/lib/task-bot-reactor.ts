import { prisma } from '@gate-access/db';
import { type Department, type TaskPriority, type TaskStatus } from '@prisma/client';

interface BotTriggerEvent {
  type: 'LEAD_SCORE_UPDATE' | 'DEAL_STAGE_CHANGE' | 'BLOG_POST_PUBLISHED';
  organizationId: string;
  data: any;
}

/**
 * Task Bot Reactor
 * 
 * An event-driven automation engine that evaluates TaskBotRules 
 * and generates tasks with optional HiTL confirmation gates.
 */
export async function reactToEvent(event: BotTriggerEvent) {
  try {
    const rules = await prisma.taskBotRule.findMany({
      where: {
        organizationId: event.organizationId,
        triggerEvent: event.type,
        enabled: true,
      }
    });

    for (const rule of rules) {
      // 1. Evaluate Conditions (Simplified for now)
      const conditions = rule.conditions as any;
      let shouldTrigger = false;

      if (event.type === 'LEAD_SCORE_UPDATE') {
        const score = event.data.score;
        if (conditions.operator === 'gt' && score > conditions.value) {
          shouldTrigger = true;
        }
      }

      if (!shouldTrigger) continue;

      // 2. Rate Limiting Check (Max 10 per hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentTasksCount = await prisma.task.count({
        where: {
          organizationId: event.organizationId,
          createdAt: { gte: oneHourAgo },
          // We can track which rule created it via metadata or a specific field
          // For now, we'll use a specific description pattern or just count all bot tasks
          description: { contains: `[BOT_RULE:${rule.id}]` }
        }
      });

      if (recentTasksCount >= 10) {
        console.warn(`[TASK_BOT] Rate limit exceeded for rule ${rule.id}. Disabling rule.`);
        await prisma.taskBotRule.update({
          where: { id: rule.id },
          data: { enabled: false }
        });
        continue;
      }

      // 3. Create Task with optional HiTL status
      const actionTemplate = rule.actionTemplate as any;
      const board = await prisma.taskBoard.findFirst({
        where: { organizationId: event.organizationId, department: rule.department }
      });

      if (!board) continue;

      await prisma.$transaction(async (tx) => {
        const task = await tx.task.create({
          data: {
            title: actionTemplate.title.replace('{{lead.company}}', event.data.companyName || 'Lead'),
            description: `${actionTemplate.description || 'Automated task created by bot.'} [BOT_RULE:${rule.id}]`,
            department: rule.department,
            priority: (actionTemplate.priority || 'MEDIUM') as TaskPriority,
            status: 'TODO' as TaskStatus,
            boardId: board.id,
            organizationId: event.organizationId,
            createdById: 'system',
            linkedType: event.type.startsWith('LEAD') ? 'LEAD' : event.type.startsWith('DEAL') ? 'DEAL' : 'BLOG_POST',
            linkedId: event.data.id,
          }
        });

        await tx.aiActionLog.create({
          data: {
            organizationId: event.organizationId,
            action: 'TASK_BOT_EXECUTION',
            prompt: `Event ${event.type} triggered rule ${rule.name}`,
            result: JSON.stringify(task),
            status: rule.autoExecute ? 'CONFIRMED' : 'PENDING_CONFIRMATION',
            metadata: {
              ruleId: rule.id,
              taskId: task.id,
            }
          }
        });

        // 4. Notification
        if (task.assigneeId) {
          await tx.notification.create({
            data: {
              userId: task.assigneeId,
              organizationId: event.organizationId,
              type: rule.autoExecute ? 'TASK_ASSIGNED' : 'BOT_APPROVAL_REQUIRED',
              message: rule.autoExecute 
                ? `Bot created a new task: ${task.title}`
                : `Bot suggested a new task: ${task.title} (Requires Approval)`,
              linkedTaskId: task.id,
            }
          });
        }
      });
    }
  } catch (error) {
    console.error('[TASK_BOT_REACTOR_ERROR]', error);
  }
}
