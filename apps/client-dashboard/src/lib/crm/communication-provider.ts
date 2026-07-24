import { prisma } from '@gate-access/db';

export type CommunicationType = 'INVITATION' | 'ALERT';
export type CommunicationProvider = 'WHATSAPP' | 'SMS';
export type CommunicationStatus = 'PENDING' | 'SENT' | 'FAILED' | 'DELIVERED';

export interface SendMessageOptions {
  organizationId: string;
  userId?: string;
  contactId?: string;
  type: CommunicationType;
  provider: CommunicationProvider;
  recipient: string;
  content: string;
  metadata?: Record<string, unknown>;
}

/**
 * Communication Gateway Abstraction
 * Handles logging and dispatching messages via configured providers.
 */
export async function sendCommunication(options: SendMessageOptions) {
  const {
    organizationId,
    userId,
    contactId,
    type,
    provider,
    recipient,
    content,
    metadata,
  } = options;

  // 1. Create a log entry in PENDING status
  const log = await prisma.communicationLog.create({
    data: {
      organizationId,
      userId,
      contactId,
      type,
      provider,
      status: 'PENDING',
      metadata: {
        recipient,
        content,
        ...metadata,
      },
    },
  });

  try {
    // 2. Provider routing logic
    // NOTE: Actual integration with WhatsApp (Meta/Infobip) and SMS (Twilio)
    // will be implemented in Phase 2.

    // For Phase 1, we simulate the provider dispatch
    console.log(
      '[CommunicationProvider] Sending %s via %s to %s',
      type,
      provider,
      recipient
    );

    // Update log to SENT
    await prisma.communicationLog.update({
      where: { id: log.id },
      data: { status: 'SENT' },
    });

    return { success: true, logId: log.id };
  } catch (error) {
    console.error(
      '[CommunicationProvider] Failed to send %s via %s:',
      type,
      provider,
      error
    );

    // Update log to FAILED with error details
    await prisma.communicationLog.update({
      where: { id: log.id },
      data: {
        status: 'FAILED',
        metadata: {
          ...(log.metadata as Record<string, unknown>),
          error: error instanceof Error ? error.message : String(error),
        },
      },
    });

    return { success: false, logId: log.id, error };
  }
}

/**
 * Retrieve the communication config for an organization.
 */
export async function getOrganizationConfig(organizationId: string) {
  return prisma.organizationCommunicationConfig.findUnique({
    where: { organizationId },
  });
}
