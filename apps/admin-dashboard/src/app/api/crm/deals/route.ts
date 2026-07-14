import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');

  try {
    const deals = await prisma.deal?.findMany({
      where: orgId ? { organizationId: orgId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ deals: deals || [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
