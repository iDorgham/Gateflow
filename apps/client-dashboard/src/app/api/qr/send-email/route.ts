import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import QRCode from 'qrcode';
import { getTransporter, buildEmailHtml } from '@/lib/email';
import nodemailer from 'nodemailer';

const SendEmailRequestSchema = z.object({
  qrString: z.string().min(1, 'QR string is required'),
  qrId: z.string().min(1, 'QR ID is required'),
  recipientEmail: z.string().email('Invalid recipient email'),
  recipientName: z.string().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = SendEmailRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { qrString, qrId, recipientEmail, recipientName } = validation.data;

    // Verify QR belongs to this org
    const qrRecord = await prisma.qRCode.findFirst({
      where: {
        id: qrId,
        organizationId: claims.orgId,
        deletedAt: null,
      },
      select: { id: true, expiresAt: true },
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
      qrBuffer = await QRCode.toBuffer(qrString, {
        width: 400,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      });
    } catch (err) {
      console.error('QR generation error:', err);
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
      console.error('SMTP config error:', err);
      return NextResponse.json(
        { success: false, message: 'Email service not configured' },
        { status: 503 }
      );
    }

    const fromAddress = process.env.SMTP_FROM ?? `"GateFlow" <noreply@gateflow.io>`;
    const displayName = recipientName || recipientEmail;

    try {
      await transporter.sendMail({
        from: fromAddress,
        to: `"${displayName}" <${recipientEmail}>`,
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
      console.error('Email send error:', err);
      return NextResponse.json(
        { success: false, message: `Email delivery failed: ${(err as Error).message}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { sentTo: recipientEmail },
    });
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
