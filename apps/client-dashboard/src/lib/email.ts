import nodemailer from 'nodemailer';
import { token } from '@atlaskit/tokens';

let transporter: nodemailer.Transporter | null = null;

export function getTransporter(): nodemailer.Transporter {
  if (transporter) {
    return transporter;
  }

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP_HOST, SMTP_USER, and SMTP_PASS must be configured');
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

export function resetTransporter() {
  transporter = null;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: {
    filename: string;
    content: Buffer;
    contentType: string;
  }[];
}

export async function sendEmail(options: SendEmailOptions) {
  const mailTransporter = getTransporter();

  const mailOptions = {
    from: `"GateFlow Ops" <${process.env.SMTP_USER}>`,
    ...options,
  };

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    console.log('[EmailService] Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('[EmailService] Failed to send email:', error);
    throw error;
  }
}

export function buildEmailHtml(
  recipientName: string,
  orgName: string,
  expiresAt?: Date | null
): string {
  const displayName = recipientName || 'there';
  const expiryLine = expiresAt
    ? `<p style="margin:0 0 12px;color:${token(
        'color.text.subtlest'
      )};font-size:14px;">
         Valid until: <strong>${new Date(expiresAt).toLocaleDateString(
           'en-US',
           {
             year: 'numeric',
             month: 'long',
             day: 'numeric',
           }
         )}</strong>
       </p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your GateFlow Access QR Code</title>
</head>
<body style="margin:0;padding:0;background:${token(
    'color.background.neutral'
  )};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
    style="background:${token('color.background.neutral')};padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" role="presentation"
          style="background:${token('elevation.surface')};border-radius:12px;overflow:hidden;
                 box-shadow:0 1px 3px rgba(0,0,0,.1);">

          <!-- Header -->
          <tr>
            <td style="background:${token('color.text')};padding:28px 32px;">
              <p style="margin:0;color:${token('color.text.inverse')};font-size:22px;font-weight:700;
                         letter-spacing:-0.3px;">GateFlow</p>
              <p style="margin:4px 0 0;color:${token('color.text.subtlest')};font-size:13px;">
                Secure Access Control
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:20px;font-weight:600;color:${token('color.text')};">
                Hi ${displayName},
              </p>
              <p style="margin:0 0 24px;color:${token('color.text.subtle')};font-size:15px;line-height:1.6;">
                <strong>${orgName}</strong> has issued you a QR access code.
                Present this code at the entrance to gain entry.
              </p>

              ${expiryLine}

              <!-- QR Code image (CID attachment) -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center" style="padding:24px;background:${token(
                    'color.background.neutral'
                  )};
                       border:2px dashed ${token('color.border')};border-radius:8px;">
                    <img src="cid:qrcode@gateflow" alt="Access QR Code"
                         width="200" height="200"
                         style="display:block;border:0;" />
                    <p style="margin:12px 0 0;font-size:12px;color:${token('color.text.subtlest')};">
                      Scan this QR code at the gate
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:13px;color:${token('color.text.subtlest')};line-height:1.5;">
                If you were not expecting this email, you can safely ignore it.
                Do not share this QR code with others.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:${token('color.background.neutral')};
                       border-top:1px solid ${token('color.border')};">
              <p style="margin:0;font-size:12px;color:${token('color.text.subtlest')};text-align:center;">
                Powered by GateFlow · Secure QR Access Control
              </p>
            </td>
          </tr>

        </table>
</body>
</html>`;
}

export function buildMemberWelcomeEmailHtml(
  orgName: string,
  loginUrl: string,
  memberName: string,
  mustChangePassword: boolean
): string {
  const resetNote = mustChangePassword
    ? 'You will be asked to choose a new password the first time you sign in.'
    : 'Use the password your administrator shared with you.';
  const greeting = memberName.trim() ? `Hi ${memberName.trim()},` : 'Hello,';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your ${orgName} GateFlow account</title>
</head>
<body style="margin:0;padding:0;background:${token(
    'color.background.neutral'
  )};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${token('color.background.neutral')};padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="background:${token('elevation.surface')};border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
          <tr>
            <td style="background:${token('color.text')};padding:28px 32px;">
              <p style="margin:0;color:${token('color.text.inverse')};font-size:22px;font-weight:700;letter-spacing:-0.3px;">GateFlow</p>
              <p style="margin:4px 0 0;color:${token('color.text.subtlest')};font-size:13px;">Team account</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${token('color.text')};">Your account is ready</h1>
              <p style="margin:0 0 16px;color:${token('color.text.subtle')};font-size:15px;line-height:1.6;">
                ${greeting}<br /><br />
                <strong>${orgName}</strong> created a GateFlow account for you.
                ${resetNote}
              </p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" style="background-color: ${token('color.background.brand.bold')}; border-radius: 8px; color: ${token('color.text.inverse')}; display: inline-block; font-size: 14px; font-weight: 700; line-height: 50px; text-align: center; text-decoration: none; width: 220px; -webkit-text-size-adjust: none;">Sign in</a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:13px;color:${token('color.text.subtlest')};line-height:1.5;">
                If you weren't expecting this, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background:${token('color.background.neutral')};border-top:1px solid ${token('color.border')};">
              <p style="margin:0;font-size:12px;color:${token('color.text.subtlest')};text-align:center;">
                Powered by GateFlow · Secure Access Infrastructure
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

export function buildInvitationEmailHtml(
  orgName: string,
  joinUrl: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Join ${orgName} on GateFlow</title>
</head>
<body style="margin:0;padding:0;background:${token(
    'color.background.neutral'
  )};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${token('color.background.neutral')};padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="background:${token('elevation.surface')};border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
          <!-- Header -->
          <tr>
            <td style="background:${token('color.text')};padding:28px 32px;">
              <p style="margin:0;color:${token('color.text.inverse')};font-size:22px;font-weight:700;letter-spacing:-0.3px;">GateFlow</p>
              <p style="margin:4px 0 0;color:${token('color.text.subtlest')};font-size:13px;">Team Invitation</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${token('color.text')};">You've been invited!</h1>
              <p style="margin:0 0 24px;color:${token('color.text.subtle')};font-size:15px;line-height:1.6;">
                <strong>${orgName}</strong> has invited you to join their security operations team on GateFlow.
                Our platform helps manage physical access control with AI-powered insights and real-time monitoring.
              </p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${joinUrl}" style="background-color: ${token('color.background.brand.bold')}; border-radius: 8px; color: ${token('color.text.inverse')}; display: inline-block; font-size: 14px; font-weight: 700; line-height: 50px; text-align: center; text-decoration: none; width: 220px; -webkit-text-size-adjust: none;">Join the Team</a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:13px;color:${token('color.text.subtlest')};line-height:1.5;">
                This link will expire in 7 days. If you weren't expecting this invitation, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:${token('color.background.neutral')};border-top:1px solid ${token('color.border')};">
              <p style="margin:0;font-size:12px;color:${token('color.text.subtlest')};text-align:center;">
                Powered by GateFlow · Secure Access Infrastructure
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
