import { NextRequest, NextResponse } from 'next/server';
import { prisma, GateMode } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';


const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  website: z.string().url().max(200).optional().or(z.literal('')),
  socialMedia: z.any().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  coverUrl: z.string().url().optional().or(z.literal('')),
  externalUrl: z.string().url().max(500).optional().or(z.literal('')),
  galleryJson: z.array(z.string().url()).max(20).optional(),
  gateMode: z.nativeEnum(GateMode).optional(),
});

export async function GET() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { organizationId: claims.orgId, deletedAt: null },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      description: true,
      logoUrl: true,
      coverUrl: true,
      website: true,
      socialMedia: true,
      location: true,
      externalUrl: true,
      galleryJson: true,
      gateMode: true,
      organizationId: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { gates: true, qrCodes: true } },
    },
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

  const project = await prisma.$transaction(async (tx) => {
    const newProject = await tx.project.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        website: parsed.data.website || null,
        socialMedia: parsed.data.socialMedia || null,
        logoUrl: parsed.data.logoUrl || null,
        coverUrl: parsed.data.coverUrl || null,
        externalUrl: parsed.data.externalUrl || null,
        galleryJson: parsed.data.galleryJson ?? null,
        gateMode: parsed.data.gateMode ?? GateMode.MULTI,
        organizationId: claims.orgId,
      },
    });

    await tx.gate.create({
      data: {
        name: 'Main Gate',
        organizationId: claims.orgId,
        projectId: newProject.id,
      },
    });

    return newProject;
  });

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard/projects');
  return NextResponse.json({ project }, { status: 201 });
}

