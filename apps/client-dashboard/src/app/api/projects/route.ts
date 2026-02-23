import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';


const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
});

export async function GET() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { organizationId: claims.orgId, deletedAt: null },
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { gates: true, qrCodes: true } } },
  });

  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = CreateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      organizationId: claims.orgId,
    },
  });

  revalidatePath('/dashboard/settings');
  return NextResponse.json({ project }, { status: 201 });
}

