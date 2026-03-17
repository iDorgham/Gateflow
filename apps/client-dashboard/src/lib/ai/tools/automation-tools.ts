import { tool } from 'ai';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

/**
 * GateAI Operations Hub - Automation Tools
 * Enables the AI to schedule reports and exports via natural language.
 */

export const automationTools = {
  scheduleReport: tool({
    description: 'Schedule an automated operational report (e.g., "Email me a visitor report every Friday").',
    parameters: z.object({
      name: z.string().min(1).describe('Descriptive name for the automation (e.g. Weekly Visitor Summary)'),
      reportType: z.enum(['VISITORS', 'SCANS', 'ALERTS', 'ANALYTICS']).describe('The type of data to report on'),
      frequency: z.string().describe('Natural language frequency (e.g. "every Friday", "daily at 8am")'),
      format: z.enum(['PDF', 'CSV', 'JSON']).default('PDF'),
      recipients: z.array(z.string().email()).optional().describe('Email addresses to send the report to'),
    }),
    execute: async ({ name, reportType, frequency, format, recipients }) => {
      const claims = await getSessionClaims();
      if (!claims?.orgId || !claims?.sub) throw new Error('Unauthorized');

      // Security: RBAC check
      const role = claims.role || 'USER';
      if (role !== 'ADMIN' && role !== 'TENANT_ADMIN' && role !== 'MANAGER') {
        return { error: 'Forbidden: You do not have permission to create automations.' };
      }

      try {
        const automation = await prisma.aiAutomation.create({
          data: {
            name,
            organizationId: claims.orgId,
            userId: claims.sub,
            type: 'REPORT',
            trigger: 'CRON',
            schedule: frequency,
            status: 'ACTIVE',
            action: {
              reportType,
              format,
              recipients: recipients || [claims.email],
            }
          }
        });

        return {
          success: true,
          message: `Scheduled ${reportType} report "${name}" to run ${frequency}.`,
          automationId: automation.id
        };
      } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : 'Failed to schedule automation' };
      }
    }
  }),

  exportDataNow: tool({
    description: 'Instantly generate and export a data file (CSV/PDF).',
    parameters: z.object({
      dataType: z.enum(['VISITORS', 'SCANS', 'ALERTS']).describe('The data set to export'),
      format: z.enum(['CSV', 'PDF']).default('CSV'),
      timeRange: z.string().optional().describe('Natural language time range (e.g. "last 24 hours", "this month")'),
    }),
    execute: async ({ dataType, format, timeRange }) => {
      // Logic for instant export
      return {
        success: true,
        message: `Generating ${format} export for ${dataType} (${timeRange || 'all time'})...`,
        downloadUrl: `/api/gateai/export?type=${dataType}&format=${format}&range=${encodeURIComponent(timeRange || '')}`
      };
    }
  })
};
