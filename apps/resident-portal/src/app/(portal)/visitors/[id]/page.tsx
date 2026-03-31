import { notFound } from 'next/navigation';
import { Share2, Download, Trash2, Shield } from 'lucide-react';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { Button, Badge } from '@gate-access/ui';
import { VisitorQRCard } from '@/components/visitor-qr-card';
import { format } from 'date-fns';
import { PageHeader } from '@/components/layout/page-header';
import { OfflineQrCacheClient } from '@/components/pwa/offline-qr-cache-client';

export default async function VisitorDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const claims = await getSessionClaims();
  const userId = claims?.sub || 'dev-resident-id';
  const orgId = claims?.org || 'dev-org-id';

  const visitor = await prisma.visitorQR.findFirst({
    where: { 
      id: params.id,
      createdBy: userId,
      qrCode: {
        organizationId: orgId,
        deletedAt: null
      }
    },
    include: {
      qrCode: true,
      accessRule: true,
    },
  });

  if (!visitor) {
    return notFound();
  }

  const isActive =
    visitor.qrCode.isActive &&
    (!visitor.qrCode.expiresAt || visitor.qrCode.expiresAt > new Date());

  const dateStr = visitor.accessRule?.startDate
    ? format(new Date(visitor.accessRule.startDate), 'MMM dd, yyyy')
    : 'Permanent Access';

  const timeStr =
    visitor.accessRule?.startTime && visitor.accessRule?.endTime
      ? `${visitor.accessRule.startTime} - ${visitor.accessRule.endTime}`
      : '24/7 Access';

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Pass Details"
        backHref="/visitors"
        action={
          <button type="button" className="rounded-full p-2 text-red-600 hover:bg-red-50">
            <Trash2 className="h-5 w-5" />
          </button>
        }
      />

      <main className="mx-auto flex w-full max-w-md flex-col items-center space-y-8 px-4 py-8 pb-24 md:max-w-3xl">
        <OfflineQrCacheClient
          payload={{
            id: visitor.id,
            code: visitor.qrCode.code,
            expiresAt: visitor.qrCode.expiresAt?.toISOString() ?? null,
            accessType: visitor.accessRule?.type ?? 'PERMANENT',
            cachedAt: new Date().toISOString(),
          }}
        />
        <VisitorQRCard
          visitorName={visitor.visitorName || 'Open Access Pass'}
          date={dateStr}
          timeWindow={timeStr}
          qrValue={visitor.qrCode.code}
          status={isActive ? 'active' : 'expired'}
          className="w-full shadow-lg border-2 border-slate-200"
        />

        <div className="w-full space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Access Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase font-semibold">Uses</p>
                <p className="text-sm font-medium">
                  {visitor.qrCode.currentUses} / {visitor.qrCode.maxUses || '∞'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase font-semibold">Type</p>
                <Badge variant="outline" className="capitalize">
                  {visitor.accessRule?.type.toLowerCase() || 'permanent'}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase font-semibold">Created</p>
                <p className="text-sm font-medium">
                  {format(new Date(visitor.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase font-semibold">ID</p>
                <p className="text-sm font-mono text-slate-400">
                  #{visitor.id.slice(-6).toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 h-12 gap-2 text-base shadow-md">
              <Share2 className="h-5 w-5" />
              Share Pass
            </Button>
            <Button variant="outline" className="h-12 w-12 p-0 shadow-sm">
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
