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
   * Mark a notification as read (scoped to the caller's organization)
   */
  async markAsRead(id: string, organizationId: string) {
    return prisma.notification.updateMany({
      where: { id, organizationId },
      data: { status: 'READ' },
    });
  },

  /**
   * Get unread notifications for a user within their organization
   */
  async getUnread(userId: string, organizationId: string) {
    return prisma.notification.findMany({
      where: {
        userId,
        organizationId,
        status: 'UNREAD',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });
  },

  /**
   * Mark all notifications as read for a user within their organization
   */
  async markAllAsRead(userId: string, organizationId: string) {
    return prisma.notification.updateMany({
      where: { userId, organizationId, status: 'UNREAD' },
      data: { status: 'READ' },
    });
  },
};
