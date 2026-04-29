import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');

  try {
    const tickets = await prisma.ticket?.findMany({
      where: orgId ? { organizationId: orgId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ tickets: tickets || [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
