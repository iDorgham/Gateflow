import { Users } from 'lucide-react';
import { getSessionClaims } from '@/lib/auth-cookies';
import { requirePortalSession } from '@/lib/require-portal-session';
import { prisma } from '@gate-access/db';
import { OpenQRForm } from '@/components/open-qr-form';
import { PageHeader } from '@/components/layout/page-header';
import { UnitRequiredEmpty } from '@/components/common/unit-required-empty';

export default async function NewOpenQRPage() {
  const claims = await getSessionClaims();
  const { userId, organizationId: orgId } = requirePortalSession(claims);

  const unit = await prisma.unit.findFirst({
    where: {
      userId,
      organizationId: orgId,
      deletedAt: null,
    },
  });

  if (!unit) {
    return (
      <UnitRequiredEmpty intent="open-qr" title="Open Access QR" backHref="/" />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Open Access QR" backHref="/" />

      <main className="mx-auto w-full max-w-md px-4 py-6 pb-24 md:max-w-3xl">
        <div className="mb-6 flex items-center gap-4 bg-slate-100 border border-slate-200 rounded-xl p-4">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
            <Users className="h-6 w-6 text-slate-900" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Reusable Guest Pass</p>
            <p className="text-xs text-slate-600 leading-tight">
              Create a single QR code that works for multiple visitors (e.g. for
              a party).
            </p>
          </div>
        </div>

        <OpenQRForm unitId={unit.id} />
      </main>
    </div>
  );
}
