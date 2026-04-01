import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma, VisitorQR, QRCode, AccessRule } from '@gate-access/db';
import { Button } from '@gate-access/ui';
import { PageHeader } from '@/components/layout/page-header';
import { VisitorsList } from '@/components/visitors/visitors-list';
import { PullToRefresh } from '@/components/common/pull-to-refresh';

export default async function VisitorsPage() {
  const claims = await getSessionClaims();
  const userId = claims?.sub || 'dev-resident-id';
  const orgId = claims?.org || 'dev-org-id';

  const visitors = await prisma.visitorQR.findMany({
    where: {
      createdBy: userId,
      qrCode: {
        organizationId: orgId,
        deletedAt: null,
      },
    },
    include: {
      qrCode: true,
      accessRule: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const unit = await prisma.unit.findFirst({
    where: {
      userId,
      organizationId: orgId,
      deletedAt: null,
    },
    select: { id: true },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="My Visitors"
        backHref="/"
        action={
          <Link href="/visitors/new">
            <Button size="sm" className="h-9 gap-1">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </Link>
        }
      />

      <PullToRefresh>
        <main className="mx-auto w-full max-w-md space-y-4 px-4 py-6 pb-24 md:max-w-5xl">
          <VisitorsList
            unitId={unit?.id ?? ''}
            visitors={visitors.map(
              (
                v: VisitorQR & { qrCode: QRCode; accessRule: AccessRule | null }
              ) => ({
                id: v.id,
                visitorName: v.visitorName,
                isOpenQR: v.isOpenQR,
                qrCode: {
                  isActive: v.qrCode.isActive,
                  expiresAt: v.qrCode.expiresAt?.toISOString() ?? null,
                  currentUses: v.qrCode.currentUses,
                },
                accessRule: v.accessRule?.type
                  ? {
                      type: v.accessRule.type as
                        | 'ONETIME'
                        | 'RECURRING'
                        | 'PERMANENT'
                        | 'DATERANGE',
                    }
                  : null,
              })
            )}
          />
        </main>
      </PullToRefresh>
    </div>
  );
}
