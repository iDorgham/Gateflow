import Link from 'next/link';
import {
  Home,
  User,
  Settings,
  QrCode,
  Users,
  History,
  Plus,
} from 'lucide-react';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma, checkAndConsumeQuota } from '@gate-access/db';

export default async function HomePage() {
  const claims = await getSessionClaims();
  const userId = claims?.sub || 'dev-resident-id';

  const unit = await prisma.unit.findFirst({
    where: { userId, deletedAt: null },
    include: {
      project: {
        select: { name: true, location: true },
      },
    },
  });

  const quota = unit ? await checkAndConsumeQuota(unit.id) : { used: 0, quota: 15, remaining: 15, resetDate: new Date() };

  const activeVisitors = await prisma.visitorQR.findMany({
    where: {
      createdBy: userId,
      qrCode: {
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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">GateFlow</h1>
          <button className="p-2 hover:bg-slate-100 rounded-full">
            <Settings className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6 pb-24">
        {unit && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{unit.name}</p>
                <p className="text-sm text-slate-500">
                  {unit.type.replace('_', ' ')} • {unit.building || 'Building'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <h2 className="font-semibold text-slate-900 mb-4">Monthly Quota</h2>
          <div className="flex items-center justify-center mb-4">
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

        {unit && (
          <>
            <div className="grid grid-cols-2 gap-3">
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

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Active Visitors</h2>
                <Link href="/visitors" className="text-sm text-blue-600 hover:underline">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {activeVisitors.length > 0 ? (
                  activeVisitors.map((v) => (
                    <div key={v.id} className="px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{v.visitorName || 'Open QR'}</p>
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
                          v.isOpenQR ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {v.isOpenQR ? 'Open' : 'Active'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-slate-500">No active visitors</p>
                    <Link href="/visitors/new" className="text-sm text-blue-600 font-medium mt-1 inline-block">
                      Create your first visitor QR
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <Link
              href="/history"
              className="flex items-center justify-center gap-2 p-4 bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <History className="h-5 w-5" />
              <span className="font-medium">View Visitor History</span>
            </Link>
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-20">
        <div className="max-w-md mx-auto flex justify-around py-3">
          <Link href="/" className="flex flex-col items-center gap-1 text-blue-600">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/visitors" className="flex flex-col items-center gap-1 text-slate-400">
            <QrCode className="h-5 w-5" />
            <span className="text-xs">Visitors</span>
          </Link>
          <Link href="/history" className="flex flex-col items-center gap-1 text-slate-400">
            <History className="h-5 w-5" />
            <span className="text-xs">History</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-400">
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
