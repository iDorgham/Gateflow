import Link from 'next/link';
import {
  Home,
  User,
  Settings,
  LogOut,
  QrCode,
  Users,
  History,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">GateFlow</h1>
          <button className="p-2 hover:bg-slate-100 rounded-full">
            <Settings className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Unit Info Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Unit A-101</p>
              <p className="text-sm text-slate-500">3 Bedroom • Building A</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Status</span>
            <span className="text-green-600 font-medium">Active</span>
          </div>
        </div>

        {/* Quota Widget */}
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
                  strokeDashoffset="125.6"
                  className="text-blue-600"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">8/15</span>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-slate-500">
            7 visitors remaining this month
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/visitors/new"
            className="flex flex-col items-center gap-2 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <QrCode className="h-8 w-8" />
            <span className="font-medium">Add Visitor</span>
          </Link>
          <Link
            href="/open-qr/new"
            className="flex flex-col items-center gap-2 p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <Users className="h-8 w-8" />
            <span className="font-medium">Open QR</span>
          </Link>
        </div>

        {/* Visitor List Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Active Visitors</h2>
            <Link
              href="/visitors"
              className="text-sm text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">John Doe</p>
                  <p className="text-xs text-slate-500">Today until 6 PM</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Active
              </span>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Jane Smith</p>
                  <p className="text-xs text-slate-500">Sat-Sun</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                Recurring
              </span>
            </div>
          </div>
        </div>

        {/* History Link */}
        <Link
          href="/history"
          className="flex items-center justify-center gap-2 p-4 bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <History className="h-5 w-5" />
          <span className="font-medium">View Visitor History</span>
        </Link>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
        <div className="max-w-md mx-auto flex justify-around py-3">
          <button className="flex flex-col items-center gap-1 text-blue-600">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <QrCode className="h-5 w-5" />
            <span className="text-xs">Visitors</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <History className="h-5 w-5" />
            <span className="text-xs">History</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
