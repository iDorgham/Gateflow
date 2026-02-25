import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

// ─── GET /api/contacts ────────────────────────────────────────────────────────

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unitId = searchParams.get('unitId');
    const format = searchParams.get('format');

    const contacts = await prisma.contact.findMany({
      where: {
        organizationId: claims.orgId,
        deletedAt: null,
        ...(unitId ? { units: { some: { unitId } } } : {}),
      },
      include: {
        units: {
          include: { unit: { select: { id: true, name: true } } },
        },
      },
      orderBy: { firstName: 'asc' },
    });

    if (format === 'csv') {
      const rows = [
        ['First Name', 'Last Name', 'Birthday', 'Company', 'Phone', 'Email', 'Units'].join(','),
        ...contacts.map((c) =>
          [
            c.firstName,
            c.lastName,
            c.birthday ? c.birthday.toISOString().slice(0, 10) : '',
            c.company ?? '',
            c.phone ?? '',
            c.email ?? '',
            c.units.map((cu) => cu.unit.name).join('; '),
          ]
            .map((v) => `"${String(v).replace(/"/g, '""')}"`)
            .join(',')
        ),
      ].join('\n');

      return new NextResponse(rows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="contacts.csv"',
        },
      });
    }

    const data = contacts.map((c) => ({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      birthday: c.birthday?.toISOString().slice(0, 10) ?? null,
      company: c.company,
      phone: c.phone,
      email: c.email,
      units: c.units.map((cu) => ({ id: cu.unit.id, name: cu.unit.name })),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/contacts error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// ─── POST /api/contacts ───────────────────────────────────────────────────────

const CreateContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  birthday: z.string().optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  email: z.string().email().optional().nullable(),
  unitIds: z.array(z.string()).optional(),
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

    const validation = CreateContactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { firstName, lastName, birthday, company, phone, email, unitIds } = validation.data;

    const contact = await prisma.contact.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthday: birthday ? new Date(birthday) : null,
        company: company?.trim() ?? null,
        phone: phone?.trim() ?? null,
        email: email?.trim() ?? null,
        organizationId: claims.orgId,
        units: unitIds?.length
          ? { create: unitIds.map((unitId) => ({ unitId })) }
          : undefined,
      },
      include: {
        units: { include: { unit: { select: { id: true, name: true } } } },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        birthday: contact.birthday?.toISOString().slice(0, 10) ?? null,
        company: contact.company,
        phone: contact.phone,
        email: contact.email,
        units: contact.units.map((cu) => ({ id: cu.unit.id, name: cu.unit.name })),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/contacts error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
