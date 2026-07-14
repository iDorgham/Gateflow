import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');

  try {
    const contacts = await prisma.contact?.findMany({
      where: orgId ? { organizationId: orgId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ contacts: contacts || [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
