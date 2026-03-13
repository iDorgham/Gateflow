import { prisma } from '@gate-access/db';
import crypto from 'crypto';

interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
  organizationId: string;
}

/**
 * Trigger CRM webhooks for marketing events
 */
export async function triggerCRMWebhooks(
  organizationId: string,
  event: 'QR_CREATED' | 'QR_SCANNED' | 'SCAN_SUCCESS',
  data: Record<string, unknown>
): Promise<void> {
  try {
    // Fetch active webhooks for this organization and event
    const webhooks = await prisma.webhook.findMany({
      where: {
        organizationId,
        isActive: true,
        deletedAt: null,
        events: {
          has: event,
        },
      },
      select: {
        id: true,
        url: true,
        secret: true,
      },
    });

    if (webhooks.length === 0) return;

    const payload: WebhookPayload = {
      event,
      data,
      timestamp: new Date().toISOString(),
      organizationId,
    };

    // Send webhooks in parallel
    await Promise.allSettled(
      webhooks.map(async (webhook) => {
        try {
          const signature = generateWebhookSignature(
            JSON.stringify(payload),
            webhook.secret || ''
          );

          const response = await fetch(webhook.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-GateFlow-Signature': signature,
              'X-GateFlow-Event': event,
            },
            body: JSON.stringify(payload),
          });

          // Log webhook delivery status
          await prisma.auditLog.create({
            data: {
              organizationId,
              action: 'WEBHOOK_DELIVERED',
              entityType: 'WEBHOOK',
              entityId: webhook.id,
              metadata: {
                event,
                status: response.status,
                success: response.ok,
              },
            },
          });
        } catch (error) {
          console.error(`Webhook delivery failed for ${webhook.id}:`, error);
          
          // Log webhook failure
          await prisma.auditLog.create({
            data: {
              organizationId,
              action: 'WEBHOOK_FAILED',
              entityType: 'WEBHOOK',
              entityId: webhook.id,
              metadata: {
                event,
                error: error instanceof Error ? error.message : 'Unknown error',
              },
            },
          });
        }
      })
    );
  } catch (error) {
    console.error('CRM webhook trigger error:', error);
  }
}

/**
 * Generate HMAC signature for webhook payload
 */
function generateWebhookSignature(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Trigger webhook when contact is created (uses QR_CREATED event)
 */
export async function triggerContactCreatedWebhook(
  organizationId: string,
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    source?: string | null;
  },
  utmParams?: {
    utm_source?: string;
    utm_campaign?: string;
    utm_medium?: string;
  }
): Promise<void> {
  await triggerCRMWebhooks(organizationId, 'QR_CREATED', {
    contact: {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      source: contact.source,
    },
    attribution: utmParams || {},
  });
}

/**
 * Trigger webhook when QR is scanned
 */
export async function triggerQRScannedWebhook(
  organizationId: string,
  scan: {
    id: string;
    qrCodeId: string;
    gateId: string;
    status: string;
    scannedAt: Date;
  },
  utmParams?: {
    utm_source?: string;
    utm_campaign?: string;
  }
): Promise<void> {
  await triggerCRMWebhooks(organizationId, 'QR_SCANNED', {
    scan: {
      id: scan.id,
      qrCodeId: scan.qrCodeId,
      gateId: scan.gateId,
      status: scan.status,
      scannedAt: scan.scannedAt.toISOString(),
    },
    attribution: utmParams || {},
  });
}
