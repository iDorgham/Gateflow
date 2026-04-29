import Link from 'next/link';
import { Button } from '@gate-access/ui';
import { ArrowLeft } from 'lucide-react';
import { requireAuth } from '@/lib/dashboard-auth';
import { prisma } from '@gate-access/db';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { CreateQRClient } from './create-qr-client';

export default async function CreateQRCodePage() {
  const { org } = await requireAuth();
  if (!org) return null;

  const projectId = await getValidatedProjectId(org.id);

  const [gates, currentProject, contacts] = await Promise.all([
    prisma.gate.findMany({
      where: { organizationId: org.id, deletedAt: null, isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    projectId
      ? prisma.project.findFirst({
          where: { id: projectId, organizationId: org.id, deletedAt: null },
          select: { id: true, name: true },
        })
      : Promise.resolve(null),
    prisma.contact.findMany({
      where: { organizationId: org.id, deletedAt: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        units: {
          select: { unit: { select: { id: true, name: true } } },
        },
      },
      orderBy: { firstName: 'asc' },
    }),
  ]);

  // Flatten the ContactUnit junction to the shape CreateQRClient expects
  const formattedContacts = contacts.map((c) => ({
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone,
    units: c.units.map((cu) => ({ id: cu.unit.id, name: cu.unit.name })),
  }));

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">Create QR Code</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate a signed access pass for your gates.
          </p>
        </div>
        <Button variant="outline" asChild className="rounded-xl h-10 px-5 font-bold text-xs">
          <Link href="./">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to QR Codes
          </Link>
        </Button>
      </div>

      <CreateQRClient
        organizationId={org.id}
        gates={gates}
        currentProject={currentProject}
        contacts={formattedContacts}
      />
    </div>
  );
}
