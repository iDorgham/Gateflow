import { AccessRule } from '@prisma/client';
import { format, getDay } from 'date-fns';

export function isAccessAllowed(rule: AccessRule, now: Date = new Date()): { allowed: boolean; reason?: string } {
  const { type, startDate, endDate, recurringDays, startTime, endTime } = rule;

  // 1. Check Date Range (if applicable)
  if (startDate && now < startDate) {
    return { allowed: false, reason: 'Access period has not started yet' };
  }
  if (endDate && now > endDate) {
    return { allowed: false, reason: 'Access period has expired' };
  }

  // 2. Type-specific logic
  if (type === 'ONETIME') {
    // ONETIME usually has a narrow window or single scan. 
    // Date range check above covers the window if provided.
    return { allowed: true };
  }

  if (type === 'DATERANGE') {
    // Already covered by date range check.
    return { allowed: true };
  }

  if (type === 'RECURRING') {
    // Check day of week
    if (recurringDays && recurringDays.length > 0) {
      const day = getDay(now);
      if (!recurringDays.includes(day)) {
        return { allowed: false, reason: 'Access not allowed on this day of the week' };
      }
    }

    // Check time of day
    if (startTime && endTime) {
      const currentTimeStr = format(now, 'HH:mm');
      if (currentTimeStr < startTime || currentTimeStr > endTime) {
        return { allowed: false, reason: `Access only allowed between ${startTime} and ${endTime}` };
      }
    }

    return { allowed: true };
  }

  if (type === 'PERMANENT') {
    return { allowed: true };
  }

  return { allowed: true };
}
