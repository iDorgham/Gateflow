import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const WizardSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  website: z.string().url().max(200).optional().or(z.literal('')),
  socialMedia: z.any().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  coverUrl: z.string().url().optional().or(z.literal('')),
  gates: z.array(z.object({
    name: z.string().min(1),
    location: z.string().optional()
  })),
  units: z.array(z.object({
    name: z.string().min(1),
    type: z.enum(['STUDIO', 'ONE_BR', 'TWO_BR', 'THREE_BR', 'FOUR_BR', 'VILLA', 'PENTHOUSE', 'COMMERCIAL']),
    qrQuota: z.number().int().nonnegative()
  })).optional(),
  contacts: z.array(z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    company: z.string().optional().or(z.literal(''))
  })).optional()
});

export async function POST(request: NextRequest) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = WizardSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const project = await prisma.$transaction(async (tx) => {
      // 1. Create the Project
      const newProject = await tx.project.create({
        data: {
          name: parsed.data.name,
          description: parsed.data.description || null,
          location: parsed.data.location || null,
          website: parsed.data.website || null,
          socialMedia: parsed.data.socialMedia || null,
          logoUrl: parsed.data.logoUrl || null,
          coverUrl: parsed.data.coverUrl || null,
          organizationId: claims.orgId,
        },
      });

      // 2. Create the Gates
      if (parsed.data.gates.length > 0) {
        await tx.gate.createMany({
          data: parsed.data.gates.map(gate => ({
            name: gate.name,
            location: gate.location || null,
            organizationId: claims.orgId,
            projectId: newProject.id,
          }))
        });
      }

      // 3. Create the Units
      if (parsed.data.units && parsed.data.units.length > 0) {
        await tx.unit.createMany({
          data: parsed.data.units.map(unit => ({
            name: unit.name,
            type: unit.type,
            qrQuota: unit.qrQuota,
            organizationId: claims.orgId,
            projectId: newProject.id,
          }))
        });
      }

      // 4. Create the Contacts
      // Note: Contacts might not be strictly tied to a project in schema, but we tie them to the Org. 
      // If we need them tied to a specific unit later, we can map that, but for now we bulk insert to Org.
      if (parsed.data.contacts && parsed.data.contacts.length > 0) {
        await tx.contact.createMany({
          data: parsed.data.contacts.map(contact => ({
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email || null,
            phone: contact.phone || null,
            company: contact.company || null,
            organizationId: claims.orgId,
          }))
        });
      }

      return newProject;
    });

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/projects');
    
    return NextResponse.json({ project, success: true }, { status: 201 });
  } catch (error) {
    console.error('Project Wizard Transaction Error:', error);
    return NextResponse.json({ error: 'Failed to create project resources' }, { status: 500 });
  }
}
