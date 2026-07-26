import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import QRCode from 'qrcode';
import { getTransporter, buildEmailHtml } from '@/lib/email';
import nodemailer from 'nodemailer';
import { checkRateLimit } from '@/lib/rate-limit';

const SendEmailRequestSchema = z
  .object({
    qrId: z.string().min(1, 'QR ID is required'),
    recipientEmail: z.string().email('Invalid recipient email').optional(),
    email: z.string().email('Invalid recipient email').optional(),
    recipientName: z.string().optional(),
  })
  .refine((value) => value.recipientEmail || value.email, {
    message: 'Recipient email is required',
    path: ['recipientEmail'],
  })
  .transform((value) => ({
    qrId: value.qrId,
    recipientEmail: value.recipientEmail ?? value.email!,
    recipientName: value.recipientName,
  }));

function errorType(error: unknown): string {
  return error instanceof Error ? error.name : 'UnknownError';
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rateLimit = await checkRateLimit(
      `qr-email:${claims.orgId}:${claims.sub}`,
      10,
      60_000
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many email delivery requests. Please retry shortly.',
        },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const validation = SendEmailRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request body',
          error: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { qrId, recipientEmail, recipientName } = validation.data;

    // Verify QR belongs to this org
    const qrRecord = await prisma.qRCode.findFirst({
      where: {
        id: qrId,
        organizationId: claims.orgId,
        deletedAt: null,
      },
      select: { id: true, code: true, expiresAt: true },
    });

    if (!qrRecord) {
      return NextResponse.json(
        { success: false, message: 'QR code not found or access denied' },
        { status: 404 }
      );
    }

    // Fetch org name for email body
    const org = await prisma.organization.findFirst({
      where: { id: claims.orgId, deletedAt: null },
      select: { name: true },
    });
    const orgName = org?.name ?? 'GateFlow';

    // Generate QR code PNG buffer
    let qrBuffer: Buffer;
    try {
      qrBuffer = await QRCode.toBuffer(qrRecord.code, {
        width: 400,
        margin: 2,
        color: {
          dark: '#0f172a', // token('color.text','#0f172a')
          light: '#ffffff', // token('elevation.surface','#ffffff')
        },
        errorCorrectionLevel: 'M',
      });
    } catch (err) {
      console.error('QR generation error:', { type: errorType(err) });
      return NextResponse.json(
        { success: false, message: 'Failed to generate QR code image' },
        { status: 500 }
      );
    }

    // Build and send email
    let transporter: nodemailer.Transporter;
    try {
      transporter = getTransporter();
    } catch (err) {
      console.error('SMTP config error:', { type: errorType(err) });
      return NextResponse.json(
        { success: false, message: 'Email service not configured' },
        { status: 503 }
      );
    }

    const fromAddress =
      process.env.SMTP_FROM ?? `"GateFlow" <noreply@gateflow.site>`;
    const attemptReceipt = await prisma.auditLog.create({
      data: {
        action: 'QR_EMAIL_DELIVERY_ATTEMPTED',
        entityType: 'QRCode',
        entityId: qrId,
        organizationId: claims.orgId,
        userId: claims.sub,
        metadata: { channel: 'email' },
      },
    });

    try {
      await transporter.sendMail({
        from: fromAddress,
        to: {
          name: recipientName || recipientEmail,
          address: recipientEmail,
        },
        subject: `Your Access QR Code — ${orgName}`,
        html: buildEmailHtml(recipientName ?? '', orgName, qrRecord.expiresAt),
        attachments: [
          {
            filename: `gateflow-qr-${qrId.slice(0, 8)}.png`,
            content: qrBuffer,
            cid: 'qrcode@gateflow',
            contentType: 'image/png',
          },
        ],
      });
    } catch (err) {
      console.error('Email send error:', { type: errorType(err) });
      await prisma.auditLog.create({
        data: {
          action: 'QR_EMAIL_DELIVERY_FAILED',
          entityType: 'QRCode',
          entityId: qrId,
          organizationId: claims.orgId,
          userId: claims.sub,
          metadata: {
            attemptAuditId: attemptReceipt.id,
            channel: 'email',
            errorType: errorType(err),
          },
        },
      });
      return NextResponse.json(
        {
          success: false,
          message: 'Email delivery failed',
        },
        { status: 502 }
      );
    }

    await prisma.auditLog.create({
      data: {
        action: 'QR_EMAIL_DELIVERY_SUCCEEDED',
        entityType: 'QRCode',
        entityId: qrId,
        organizationId: claims.orgId,
        userId: claims.sub,
        metadata: {
          attemptAuditId: attemptReceipt.id,
          channel: 'email',
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { sent: true },
    });
  } catch (error) {
    console.error('Send email error:', { type: errorType(error) });
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
