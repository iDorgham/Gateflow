import { Bell, Mail, Shield } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';

export default function NotificationsSettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Notifications" backHref="/profile" />

      <main className="mx-auto w-full max-w-md space-y-6 px-4 py-6 pb-24 md:max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Push Notifications</h2>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Visitor Arrival
                  </p>
                  <p className="text-xs text-slate-500">
                    When a visitor scans at gate
                  </p>
                </div>
              </div>
              <button className="w-11 h-6 bg-blue-600 rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
              </button>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Security Alerts
                  </p>
                  <p className="text-xs text-slate-500">
                    Important security notifications
                  </p>
                </div>
              </div>
              <button className="w-11 h-6 bg-blue-600 rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">
              Email Notifications
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Weekly Summary
                  </p>
                  <p className="text-xs text-slate-500">
                    Visitor activity summary
                  </p>
                </div>
              </div>
              <button className="w-11 h-6 bg-slate-200 rounded-full relative">
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
