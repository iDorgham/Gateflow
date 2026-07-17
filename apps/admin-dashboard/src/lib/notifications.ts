import { prisma } from '@gate-access/db';

/**
 * Notifications Engine
 *
 * Centralized utility for creating and managing in-app notifications
 * for the GateFlow Admin Dashboard.
 */
export const notifications = {
  /**
   * Create a notification for a specific user
   */
  async create({
    userId,
    organizationId,
    type,
    message,
    taskId,
  }: {
    userId: string;
    organizationId: string;
    type:
      | 'TASK_ASSIGNED'
      | 'BOT_APPROVAL_REQUIRED'
      | 'TASK_DUE_SOON'
      | 'TASK_STATUS_CHANGED';
    message: string;
    taskId?: string;
  }) {
    return prisma.notification.create({
      data: {
        userId,
        organizationId,
        type,
        message,
        taskId,
        status: 'UNREAD',
      },
    });
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { status: 'READ' },
    });
  },

  /**
   * Get unread notifications for a user
   */
  async getUnread(userId: string) {
    return prisma.notification.findMany({
      where: {
        userId,
        status: 'UNREAD',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, status: 'UNREAD' },
      data: { status: 'READ' },
    });
  },
};
