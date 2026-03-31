import { UserPlus } from 'lucide-react';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { VisitorForm } from '@/components/visitor-form';
import { PageHeader } from '@/components/layout/page-header';

export default async function NewVisitorPage() {
  const claims = await getSessionClaims();
  const userId = claims?.sub || 'dev-resident-id';
  const orgId = claims?.org || 'dev-org-id';

  const unit = await prisma.unit.findFirst({
    where: { 
      userId, 
      organizationId: orgId,
      deletedAt: null 
    },
  });

  if (!unit) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Add Visitor" backHref="/visitors" />

      <main className="mx-auto w-full max-w-md px-4 py-6 pb-24 md:max-w-3xl">
        <div className="mb-6 flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">New Guest Pass</p>
            <p className="text-xs text-slate-600 leading-tight">
              A temporary QR code will be generated for your visitor. You can share it via WhatsApp
              or Email.
            </p>
          </div>
        </div>

        <VisitorForm unitId={unit.id} />
      </main>
    </div>
  );
}
