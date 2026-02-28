import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Share2, Download, Trash2, Shield } from 'lucide-react';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { Button, Badge } from '@gate-access/ui';
import { VisitorQRCard } from '@/components/visitor-qr-card';
import { format } from 'date-fns';

export default async function VisitorDetailPage({ params }: { params: { id: string } }) {
  const claims = await getSessionClaims();
  const userId = claims?.sub || 'dev-resident-id';

  const visitor = await prisma.visitorQR.findUnique({
    where: { id: params.id },
    include: {
      qrCode: true,
      accessRule: true,
    },
  });

  if (!visitor || visitor.createdBy !== userId) {
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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/visitors" className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900">Pass Details</h1>
          </div>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded-full">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8 flex flex-col items-center space-y-8 pb-24">
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
