import { tool } from 'ai';
import { z } from 'zod';

/**
 * GateAI UI Components - UI Tools
 * These tools are used to render rich components directly in the chat panel.
 */

export const uiTools = {
  showChart: tool({
    description: 'Display a chart to the user based on analytics data.',
    inputSchema: z.object({
      chartType: z.enum(['bar', 'line', 'pie']),
      title: z.string().describe('Descriptive title for the chart'),
      data: z.array(z.record(z.any())).describe('The data points to visualize'),
      xAxisKey: z
        .string()
        .describe('Key to use for the X axis (e.g., "label", "date")'),
      yAxisKey: z
        .string()
        .describe('Key to use for the Y axis (e.g., "value", "count")'),
    }),
    execute: async () => ({ status: 'rendered', component: 'chart' }),
  }),

  showReport: tool({
    description: 'Display a report download link to the user.',
    inputSchema: z.object({
      reportType: z.enum(['pdf', 'csv']),
      title: z.string().describe('Description of the report'),
      params: z.object({
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        projectId: z.string().optional(),
        gateId: z.string().optional(),
        unitType: z.string().optional(),
        search: z.string().optional(),
      }),
    }),
    execute: async () => ({ status: 'rendered', component: 'report' }),
  }),

  showSchedule: tool({
    description: 'Display a scheduled task summary to the user.',
    inputSchema: z.object({
      type: z.literal('schedule'),
      name: z.string(),
      frequency: z.string(),
      format: z.string(),
      nextRun: z.string().optional(),
    }),
    execute: async () => ({ status: 'rendered', component: 'schedule' }),
  }),

  requestConfirmation: tool({
    description: 'Request user confirmation before executing a major action.',
    inputSchema: z.object({
      actionType: z
        .string()
        .describe('The type of action being proposed (e.g. SCHEDULE_TASK)'),
      title: z.string().describe('Short title for the action'),
      description: z.string().describe('Clear explanation of what will happen'),
      intentJson: z
        .record(z.any())
        .describe('The parameters that will be used if confirmed'),
    }),
    execute: async () => ({ status: 'pending', component: 'confirm' }),
  }),
};
