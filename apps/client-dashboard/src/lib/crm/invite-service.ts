import { prisma } from '@gate-access/db';
import { sendCommunication } from './communication-provider';

interface InviteOptions {
  organizationId: string;
  userId: string;
  contactId: string;
  provider: 'WHATSAPP' | 'SMS';
  locale: 'ar' | 'en';
}

/**
 * Service to manage invitation logic, including QR generation and message interpolation.
 */
export class InviteService {
  /**
   * Generates or retrieves an active QR code for a contact and sends/prepares the invite.
   */
  static async processInvitation(options: InviteOptions) {
    const { organizationId, userId, contactId, provider, locale } = options;

    // 1. Fetch contact details
    const contact = await prisma.contact.findUnique({
      where: { id: contactId, organizationId },
      include: {
        organization: {
          select: { name: true },
        },
      },
    });

    if (!contact) {
      throw new Error('Contact not found');
    }

    // 2. Find or Create a permanent QR code for this resident contact
    // We prioritize an active permanent QR if it exists.
    const qrCode = await prisma.qRCode.findFirst({
      where: {
        contactId,
        organizationId,
        type: 'PERMANENT',
        isActive: true,
        deletedAt: null,
      },
      include: {
        qrShortLink: true,
      },
    });

    // If no active QR found, we'd normally trigger code creation here.
    // NOTE: For Phase 2, we assume a QR will be created if missing,
    // but we'll focus on the retrieval and messaging logic.

    if (!qrCode || !qrCode.qrShortLink[0]) {
      // In a real flow, we would call the QR creation utility here.
      // For now, if missing, we return an error or placeholder logic.
      throw new Error(
        'No active QR code found for this contact. Create one first.'
      );
    }

    const shortId = qrCode.qrShortLink[0].shortId;
    const appUrl =
      process.env.NEXT_PUBLIC_QR_BASE_URL ??
      process.env.NEXT_PUBLIC_APP_URL ??
      'https://gateflow.io';
    const shortUrl = `${appUrl}/s/${shortId}`;

    // 3. Template Interpolation
    const name = `${contact.firstName} ${contact.lastName}`;
    const orgName = contact.organization?.name || 'GateFlow';

    // Simplified template logic (ideally would use i18next directly if available in server context)
    const templates = {
      en: `Hello ${name}, here is your access code for ${orgName}: ${shortUrl}`,
      ar: `مرحباً ${name}، إليك كود الدخول الخاص بك لـ ${orgName}: ${shortUrl}`,
    };

    const content = templates[locale] || templates.en;

    // 4. WhatsApp Deep Link Generation
    let deepLink = null;
    if (provider === 'WHATSAPP' && contact.phone) {
      const cleanPhone = contact.phone.replace(/\D/g, '');
      const encodedMsg = encodeURIComponent(content);
      deepLink = `https://wa.me/${cleanPhone}/?text=${encodedMsg}`;
    }

    // 5. Send/Log Communication
    const result = await sendCommunication({
      organizationId,
      userId,
      contactId,
      type: 'INVITATION',
      provider,
      recipient: contact.phone || contact.email || 'Unknown',
      content,
      metadata: {
        qrId: qrCode.id,
        shortId,
        deepLink,
      },
    });

    return {
      success: result.success,
      logId: result.logId,
      deepLink,
      content,
      recipient: contact.phone,
    };
  }
}
