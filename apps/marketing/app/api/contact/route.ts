import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// In-memory rate limiter: 3 submissions per IP per 60 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter',
  pro: 'Pro',
  enterprise: 'Enterprise',
  unsure: 'Not sure yet',
};

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, message: 'Too many requests. Please try again in an hour.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Invalid request body.' },
      { status: 400 }
    );
  }

  // Honeypot: filled website field means bot — silent reject
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  // Validation
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const company = typeof body.company === 'string' ? body.company.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : undefined;
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const planInterest =
    typeof body.planInterest === 'string' ? body.planInterest : '';

  if (name.length < 2) {
    return NextResponse.json(
      { ok: false, message: 'Name must be at least 2 characters.' },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, message: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }
  if (!company) {
    return NextResponse.json(
      { ok: false, message: 'Company name is required.' },
      { status: 400 }
    );
  }
  if (message.length < 10) {
    return NextResponse.json(
      { ok: false, message: 'Message must be at least 10 characters.' },
      { status: 400 }
    );
  }
  if (planInterest && !PLAN_LABELS[planInterest]) {
    return NextResponse.json(
      { ok: false, message: 'Invalid plan interest value.' },
      { status: 400 }
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn('[contact] RESEND_API_KEY not set — skipping email delivery');
    return NextResponse.json(
      { ok: false, fallback: 'contact@gateflow.io' },
      { status: 503 }
    );
  }

  const resend = new Resend(resendApiKey);
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ?? 'noreply@gateflow.io';
  const notifyEmail =
    process.env.CONTACT_NOTIFY_EMAIL ?? 'team@gateflow.io';
  const planLabel = planInterest
    ? (PLAN_LABELS[planInterest] ?? 'Not specified')
    : 'Not specified';

  try {
    // Team notification
    await resend.emails.send({
      from: `GateFlow <${fromEmail}>`,
      to: [notifyEmail],
      subject: `New GateFlow contact: ${name} from ${company}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Plan Interest:</strong> ${planLabel}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });

    // Auto-reply to submitter
    await resend.emails.send({
      from: `GateFlow <${fromEmail}>`,
      to: [email],
      subject: 'We received your message — GateFlow',
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to GateFlow! We've received your message and our team will get back to you within <strong>1–2 business days</strong>.</p>
        <p>If you have an urgent question, you can also reach us directly at <a href="mailto:contact@gateflow.io">contact@gateflow.io</a>.</p>
        <p>Best regards,<br />The GateFlow Team</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] Resend error:', err);
    return NextResponse.json(
      { ok: false, message: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
