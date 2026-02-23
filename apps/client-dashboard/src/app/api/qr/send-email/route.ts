import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

const SendEmailRequestSchema = z.object({
  qrString: z.string().min(1, 'QR string is required'),
  qrId: z.string().min(1, 'QR ID is required'),
  recipientEmail: z.string().email('Invalid recipient email'),
  recipientName: z.string().optional(),
});

function buildTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP_HOST, SMTP_USER, and SMTP_PASS must be configured');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function buildEmailHtml(recipientName: string, orgName: string, expiresAt?: Date | null): string {
  const displayName = recipientName || 'there';
  const expiryLine = expiresAt
    ? `<p style="margin:0 0 12px;color:#64748b;font-size:14px;">
         Valid until: <strong>${new Date(expiresAt).toLocaleDateString('en-US', {
           year: 'numeric',
           month: 'long',
           day: 'numeric',
         })}</strong>
       </p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your GateFlow Access QR Code</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
    style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" role="presentation"
          style="background:#ffffff;border-radius:12px;overflow:hidden;
                 box-shadow:0 1px 3px rgba(0,0,0,.1);">

          <!-- Header -->
          <tr>
            <td style="background:#0f172a;padding:28px 32px;">
              <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;
                         letter-spacing:-0.3px;">GateFlow</p>
              <p style="margin:4px 0 0;color:#94a3b8;font-size:13px;">
                Secure Access Control
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:20px;font-weight:600;color:#0f172a;">
                Hi ${displayName},
              </p>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                <strong>${orgName}</strong> has issued you a QR access code.
                Present this code at the entrance to gain entry.
              </p>

              ${expiryLine}

              <!-- QR Code image (CID attachment) -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center" style="padding:24px;background:#f8fafc;
                       border:2px dashed #e2e8f0;border-radius:8px;">
                    <img src="cid:qrcode@gateflow" alt="Access QR Code"
                         width="200" height="200"
                         style="display:block;border:0;" />
                    <p style="margin:12px 0 0;font-size:12px;color:#94a3b8;">
                      Scan this QR code at the gate
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;line-height:1.5;">
                If you were not expecting this email, you can safely ignore it.
                Do not share this QR code with others.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#f8fafc;
                       border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                Powered by GateFlow · Secure QR Access Control
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

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
      transporter = buildTransporter();
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
