import { z } from 'zod';

export const NotificationConfigSchema = z.object({
  channels: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
  }),
  events: z.object({
    scanSuccess: z.boolean(),
    scanFailed: z.boolean(),
    qrExpired: z.boolean(),
    newMember: z.boolean(),
    systemAlerts: z.boolean(),
  }),
});

export type NotificationConfig = z.infer<typeof NotificationConfigSchema>;

export const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  channels: { email: true, sms: false, push: true },
  events: {
    scanSuccess: false,
    scanFailed: true,
    qrExpired: true,
    newMember: true,
    systemAlerts: true,
  },
};
