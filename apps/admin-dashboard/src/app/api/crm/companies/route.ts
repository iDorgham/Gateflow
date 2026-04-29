import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');

  try {
    const companies = await prisma.organization?.findMany({
      where: orgId ? { id: orgId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ companies: companies || [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
