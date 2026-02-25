import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({
        contacts: [],
        units: [],
        qrs: [],
        gates: [],
      });
    }

    const orgId = claims.orgId;
    const containsQuery = { contains: query, mode: 'insensitive' as const };

    const [contacts, units, qrs, gates] = await Promise.all([
      // Search Contacts
      prisma.contact.findMany({
        where: {
          organizationId: orgId,
          deletedAt: null,
          OR: [
            { firstName: containsQuery },
            { lastName: containsQuery },
            { email: containsQuery },
            { phone: containsQuery },
          ],
        },
        take: 5,
        select: { id: true, firstName: true, lastName: true, email: true },
      }),
      // Search Units
      prisma.unit.findMany({
        where: {
          organizationId: orgId,
          deletedAt: null,
          OR: [
            { name: containsQuery },
          ],
        },
        take: 5,
        select: { id: true, name: true, type: true },
      }),
      // Search QRs
      prisma.qRCode.findMany({
        where: {
          organizationId: orgId,
          deletedAt: null,
          OR: [
            { code: containsQuery },
          ],
        },
        take: 5,
        select: { id: true, code: true, isActive: true },
      }),
      // Search Gates
      prisma.gate.findMany({
        where: {
          organizationId: orgId,
          deletedAt: null,
          OR: [
            { name: containsQuery },
          ],
        },
        take: 5,
        select: { id: true, name: true, isActive: true },
      })
    ]);

    // Normalize output format
    const formattedContacts = contacts.map(c => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName}`.trim(),
      email: c.email
    }));
    
    const formattedUnits = units.map(u => ({
      id: u.id,
      identifier: u.name,
      type: u.type
    }));

    const formattedQrs = qrs.map(q => ({
      id: q.id,
      code: q.code,
      guestName: q.code, // Fallback as guest name isn't stored here
      status: q.isActive ? 'Active' : 'Inactive'
    }));

    const formattedGates = gates.map(g => ({
      id: g.id,
      name: g.name,
      status: g.isActive ? 'Active' : 'Inactive'
    }));

    return NextResponse.json({
      contacts: formattedContacts,
      units: formattedUnits,
      qrs: formattedQrs,
      gates: formattedGates,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
