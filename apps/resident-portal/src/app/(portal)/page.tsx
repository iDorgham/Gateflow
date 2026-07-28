import Link from 'next/link';
import {
  Home,
  User,
  Users,
  History,
  Plus,
  Wrench,
  ChevronRight,
} from 'lucide-react';
import { getSessionClaims } from '@/lib/auth-cookies';
import { requirePortalSession } from '@/lib/require-portal-session';
import {
  prisma,
  checkAndConsumeQuota,
  VisitorQR,
  QRCode,
  AccessRule,
} from '@gate-access/db';
import { PageHeader } from '@/components/layout/page-header';
import { PullToRefresh } from '@/components/common/pull-to-refresh';

export default async function HomePage() {
  const claims = await getSessionClaims();
  const { userId, organizationId: orgId } = requirePortalSession(claims);

  const unit = await prisma.unit.findFirst({
    where: {
      userId,
      organizationId: orgId,
      deletedAt: null,
    },
    include: {
      project: {
        select: { name: true, location: true },
      },
    },
  });

  const quota = unit
    ? await checkAndConsumeQuota(unit.id)
    : { used: 0, quota: 15, remaining: 15, resetDate: new Date() };

  const activeVisitors = await prisma.visitorQR.findMany({
    where: {
      createdBy: userId,
      qrCode: {
        organizationId: orgId,
        isActive: true,
        deletedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    },
    include: {
      qrCode: true,
      accessRule: true,
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  const percentage = (quota.used / quota.quota) * 100;
  const strokeDashoffset = 251.2 - (251.2 * percentage) / 100;

  return (
    <div className="min-h-[105.3vh] bg-slate-50">
      <PageHeader title="GateFlow" />

      <PullToRefresh>
        <main className="mx-auto w-full max-w-md space-y-6 px-4 py-6 pb-24 md:max-w-6xl">
          <section className="grid gap-6 md:grid-cols-2">
            {unit && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Home className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{unit.name}</p>
                    <p className="text-sm text-slate-500">
                      {unit.type.replace('_', ' ')} -{' '}
                      {unit.building || 'Building'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-slate-900">
                Monthly Quota
              </h2>
              <div className="mb-4 flex items-center justify-center">
                <div className="relative h-24 w-24">
                  <svg className="h-full w-full -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-100"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset={strokeDashoffset}
                      className="text-blue-600 transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900">
                      {quota.used}/{quota.quota}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-slate-500">
                {quota.remaining} visitors remaining this month
              </p>
            </div>
          </section>

          {unit && (
            <>
              <div className="grid grid-cols-2 gap-3 md:max-w-xl">
                <Link
                  href="/visitors/new"
                  className="flex flex-col items-center gap-2 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Plus className="h-6 w-6" />
                  </div>
                  <span className="font-medium">Add Visitor</span>
                </Link>
                <Link
                  href="/open-qr/new"
                  className="flex flex-col items-center gap-2 p-4 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors"
                >
                  <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <span className="font-medium">Open QR</span>
                </Link>
              </div>

              <Link
                href="/maintenance"
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">Maintenance</h3>
                  <p className="text-xs text-slate-500">
                    Report plumbing, electrical or other issues
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300" />
              </Link>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">
                    Active Visitors
                  </h2>
                  <Link
                    href="/visitors"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="divide-y divide-slate-100">
                  {activeVisitors.length > 0 ? (
                    activeVisitors.map(
                      (
                        v: VisitorQR & {
                          qrCode: QRCode;
                          accessRule: AccessRule | null;
                        }
                      ) => (
                        <div
                          key={v.id}
                          className="px-5 py-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {v.visitorName || 'Open QR'}
                              </p>
                              <p className="text-xs text-slate-500">
                                {v.accessRule?.type === 'ONETIME'
                                  ? 'One-time access'
                                  : v.accessRule?.type === 'RECURRING'
                                    ? 'Recurring access'
                                    : 'Permanent access'}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              v.isOpenQR
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {v.isOpenQR ? 'Open' : 'Active'}
                          </span>
                        </div>
                      )
                    )
                  ) : (
                    <div className="px-5 py-8 text-center">
                      <p className="text-sm text-slate-500">
                        No active visitors
                      </p>
                      <Link
                        href="/visitors/new"
                        className="text-sm text-blue-600 font-medium mt-1 inline-block"
                      >
                        Create your first visitor QR
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Link
                  href="/history"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-slate-600 transition-colors hover:bg-slate-50"
                >
                  <History className="h-5 w-5" />
                  <span className="font-medium">View Visitor History</span>
                </Link>
                <Link
                  href="/visitors"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-slate-600 transition-colors hover:bg-slate-50"
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Manage Visitors</span>
                </Link>
              </div>
            </>
          )}
        </main>
      </PullToRefresh>
    </div>
  );
}
