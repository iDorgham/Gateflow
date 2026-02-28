import Link from 'next/link';
import { ArrowLeft, User, QrCode, Plus, Search, Filter } from 'lucide-react';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { Button } from '@gate-access/ui';

export default async function VisitorsPage() {
  const claims = await getSessionClaims();
  const userId = claims?.sub || 'dev-resident-id';

  const visitors = await prisma.visitorQR.findMany({
    where: {
      createdBy: userId,
      qrCode: {
        deletedAt: null,
      },
    },
    include: {
      qrCode: true,
      accessRule: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900">My Visitors</h1>
          </div>
          <Link href="/visitors/new">
            <Button size="sm" className="h-9 gap-1">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4 pb-24">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search visitors..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter className="h-4 w-4 text-slate-600" />
          </button>
        </div>

        <div className="space-y-3">
          {visitors.length > 0 ? (
            visitors.map((v) => {
              const isActive =
                v.qrCode.isActive && (!v.qrCode.expiresAt || v.qrCode.expiresAt > new Date());
              return (
                <div
                  key={v.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        v.isOpenQR ? 'bg-purple-100' : 'bg-blue-100'
                      }`}
                    >
                      {v.isOpenQR ? (
                        <QrCode
                          className={`h-6 w-6 ${v.isOpenQR ? 'text-purple-600' : 'text-blue-600'}`}
                        />
                      ) : (
                        <User className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{v.visitorName || 'Open Access QR'}</p>
                      <p className="text-xs text-slate-500">
                        {v.accessRule?.type === 'ONETIME'
                          ? 'One-time'
                          : v.accessRule?.type === 'RECURRING'
                            ? 'Recurring'
                            : 'Permanent'}{' '}
                        • {v.qrCode.currentUses} uses
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isActive ? 'Active' : 'Expired'}
                    </span>
                    <Link href={`/visitors/${v.id}`} className="text-xs text-blue-600 font-medium">
                      Details
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No visitors found</p>
              <Link href="/visitors/new" className="text-blue-600 text-sm mt-2 inline-block">
                Create a visitor pass
              </Link>
            </div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-20">
        <div className="max-w-md mx-auto flex justify-around py-3">
          <Link href="/" className="flex flex-col items-center gap-1 text-slate-400">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/visitors" className="flex flex-col items-center gap-1 text-blue-600">
            <QrCode className="h-5 w-5" />
            <span className="text-xs">Visitors</span>
          </Link>
          <Link href="/history" className="flex flex-col items-center gap-1 text-slate-400">
            <Plus className="h-5 w-5" />
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
