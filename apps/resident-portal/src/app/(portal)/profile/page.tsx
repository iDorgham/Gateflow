import Link from 'next/link';
import {
  User,
  Home,
  LogOut,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { Button } from '@gate-access/ui';
import { PageHeader } from '@/components/layout/page-header';

export default async function ProfilePage() {
  const claims = await getSessionClaims();
  const userId = claims?.sub || 'dev-resident-id';
  const orgId = claims?.org || 'dev-org-id';

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      organizationId: orgId,
      deletedAt: null,
    },
    include: {
      unit: {
        where: { deletedAt: null },
        include: { project: { select: { name: true } } },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Profile" backHref="/" />

      <main className="mx-auto w-full max-w-md space-y-6 px-4 py-6 pb-24 md:max-w-3xl">
        {/* User Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-slate-900">
                {user?.name || 'Resident'}
              </h2>
              <p className="text-sm text-slate-500">
                {user?.email || 'resident@example.com'}
              </p>
              <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* My Unit */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">My Unit</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {user?.unit ? (
              <div className="px-5 py-4 flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Home className="h-5 w-5 text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{user.unit.name}</p>
                  <p className="text-xs text-slate-500">
                    {user.unit.type.replace('_', ' ')} •{' '}
                    {user.unit.project?.name}
                  </p>
                </div>
                <span className="text-xs text-green-600 font-medium">
                  Active
                </span>
              </div>
            ) : (
              <div className="px-5 py-6 text-center">
                <p className="text-sm text-slate-500">No unit assigned</p>
                <Link
                  href="/"
                  className="text-sm text-blue-600 font-medium mt-1 inline-block"
                >
                  Go to home
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Settings</h3>
          </div>
          <div className="divide-y divide-slate-100">
            <Link
              href="/settings/notifications"
              className="px-5 py-4 flex items-center justify-between hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-slate-400" />
                <span className="text-sm text-slate-700">Notifications</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link
              href="/settings/privacy"
              className="px-5 py-4 flex items-center justify-between hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-slate-400" />
                <span className="text-sm text-slate-700">
                  Privacy & Security
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link
              href="/settings/help"
              className="px-5 py-4 flex items-center justify-between hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-slate-400" />
                <span className="text-sm text-slate-700">Help & Support</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Logout */}
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* App Info */}
        <div className="text-center text-xs text-slate-400">
          <p>GateFlow Resident Portal v1.0</p>
          <p className="mt-1">Made for secure living</p>
        </div>
      </main>
    </div>
  );
}
