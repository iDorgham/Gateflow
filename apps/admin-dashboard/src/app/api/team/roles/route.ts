import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';

export async function GET(req: Request) {
  try {
    const roles = await prisma.role?.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ roles: roles || [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
