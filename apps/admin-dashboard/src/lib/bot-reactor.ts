import { prisma } from '@gate-access/db';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

export type BotEvent = {
  organizationId: string;
  triggerEvent: string; // e.g., 'LEAD_SCORE_CHANGED'
  payload: Record<string, any>; // e.g., { leadId: string, score: number, ... }
  userId?: string;
};

export async function processBotRules(event: BotEvent) {
  const { organizationId, triggerEvent, payload } = event;

  // Find enabled rules matching this event in this organization
  const rules = await prisma.taskBotRule.findMany({
    where: {
      organizationId,
      enabled: true,
      triggerEvent,
    },
  });

  if (rules.length === 0) return { triggered: 0, actions: [] };

  const results = [];

  for (const rule of rules) {
    try {
      // 1. Evaluate conditions
      // Conditions schema: { field: string, operator: 'gt' | 'lt' | 'eq', value: any }
      // This is a simple evaluation. For complex logic, we could use JSON logic or similar.
      const conditions = rule.conditions as Record<string, any>;
      let conditionMet = true;

      if (conditions && typeof conditions === 'object') {
        const { field, operator, value } = conditions;
        if (field && payload[field] !== undefined) {
          const payloadValue = payload[field];
          switch (operator) {
            case 'gt':
              conditionMet = payloadValue > value;
              break;
            case 'lt':
              conditionMet = payloadValue < value;
              break;
            case 'eq':
              conditionMet = payloadValue === value;
              break;
            default:
              conditionMet = false;
          }
        }
      }

      if (!conditionMet) continue;

      // 2. Check Rate Limits (Max 10 tasks/rule/hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentTasks = await prisma.task.count({
        where: {
          organizationId,
          createdById: 'bot',
          // Use description or a dedicated metadata field to track which rule created it.
          // For now, we search description for the rule ID.
          description: { contains: `[Rule:${rule.id}]` },
          createdAt: { gte: oneHourAgo },
        },
      });

      if (recentTasks >= 10) {
        // Auto-disable rule
        await prisma.taskBotRule.update({
          where: { id: rule.id },
          data: { enabled: false },
        });

        await prisma.notification.create({
          data: {
            message: `Bot Rule Auto-Disabled: "${rule.name}" exceeded the rate limit of 10 tasks/hour and was disabled.`,
            type: 'WARNING',
            userId: event.userId || 'system',
            organizationId,
          },
        });
        continue;
      }

      // 3. Prepare Task Action
      const template = rule.actionTemplate as Record<string, any>;

      // Basic templating replacement (e.g. {{lead.company}})
      let title = template.title || `Bot Task: ${rule.name}`;
      let description = (template.description || '') + `\n\n[Rule:${rule.id}]`;

      // Simple regex to replace {{key}} with payload[key]
      const replaceVars = (str: string) => {
        return str.replace(/{{([^}]+)}}/g, (match, key) => {
          return payload[key.trim()] !== undefined
            ? String(payload[key.trim()])
            : match;
        });
      };

      title = replaceVars(title);
      description = replaceVars(description);

      // Find appropriate board
      const board = await prisma.taskBoard.findFirst({
        where: { organizationId, department: rule.department },
      });

      if (!board) {
        console.warn(
          `[BOT_REACTOR] No board found for department ${rule.department} in org ${organizationId}`
        );
        continue;
      }

      // 4. Execute or Require HiTL
      if (rule.autoExecute) {
        const task = await prisma.task.create({
          data: {
            title,
            description,
            priority: template.priority || 'MEDIUM',
            department: rule.department,
            status: 'TODO',
            boardId: board.id,
            organizationId,
            createdById: 'bot',
            linkedType: payload.linkedType,
            linkedId: payload.linkedId,
          },
        });
        results.push({ ruleId: rule.id, status: 'EXECUTED', taskId: task.id });
      } else {
        // Require HiTL (Human in the Loop)
        const log = await prisma.aiActionLog.create({
          data: {
            organizationId,
            actionType: 'BOT_TASK_APPROVAL',
            prompt: `Bot Rule "${rule.name}" triggered task creation.`,
            intentJson: { ruleId: rule.id, ...payload },
            result: JSON.stringify({
              title,
              description,
              priority: template.priority,
              department: rule.department,
              boardId: board.id,
            }),
            status: 'PENDING',
            metadata: {
              requiresHiTL: true,
              reasoning: `Condition met: ${JSON.stringify(conditions)}`,
            },
          },
        });
        results.push({
          ruleId: rule.id,
          status: 'PENDING_CONFIRMATION',
          logId: log.id,
        });
      }
    } catch (err) {
      console.error(`[BOT_REACTOR] Error processing rule ${rule.id}:`, err);
    }
  }

  return { triggered: results.length, actions: results };
}
