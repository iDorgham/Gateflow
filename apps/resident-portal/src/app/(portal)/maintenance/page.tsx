import Link from 'next/link';
import {
  ArrowLeft,
  Wrench,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  AlertCircle,
  Plus,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { MaintenanceStatus } from '@gate-access/types';
import { cn } from '@gate-access/ui';

interface MaintenanceRequestItem {
  id: string;
  title: string;
  status: MaintenanceStatus;
  createdAt: string;
  category: string;
}

const statusConfig: Record<
  MaintenanceStatus,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  [MaintenanceStatus.OPEN]: {
    label: 'Open',
    icon: Clock,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  [MaintenanceStatus.ASSIGNED]: {
    label: 'Assigned',
    icon: Clock,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  [MaintenanceStatus.IN_PROGRESS]: {
    label: 'In Progress',
    icon: PlayCircle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  [MaintenanceStatus.PENDING_PARTS]: {
    label: 'Pending Parts',
    icon: AlertCircle,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  [MaintenanceStatus.RESOLVED]: {
    label: 'Resolved',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  [MaintenanceStatus.CLOSED]: {
    label: 'Closed',
    icon: CheckCircle2,
    color: 'text-slate-500',
    bg: 'bg-slate-100',
  },
  [MaintenanceStatus.CANCELLED]: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-50',
  },
};

async function fetchMyRequests(): Promise<MaintenanceRequestItem[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  const res = await fetch(`${apiUrl}/resident/maintenance`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    return [];
  }
  const json = await res.json();
  if (!json?.success || !Array.isArray(json.data)) {
    return [];
  }
  return json.data as MaintenanceRequestItem[];
}

export default async function MaintenancePage({
  searchParams,
}: {
  searchParams: { new?: string };
}) {
  const isNew = searchParams.new === 'true';
  const requests = await fetchMyRequests();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 -ml-2 hover:bg-slate-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900">Maintenance</h1>
          </div>
          {!isNew && (
            <Link
              href="/maintenance?new=true"
              className="p-2 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Plus className="h-5 w-5" />
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6 pb-24">
        {isNew ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-1 px-1">
              <h2 className="text-2xl font-bold text-slate-900">
                Report an Issue
              </h2>
              <p className="text-sm text-slate-500">
                Submit a new maintenance request for your unit
              </p>
            </div>

            {/* Import client component dynamically if needed, but here we can just use it */}
            <MaintenanceFormWrapper />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-1 px-1">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                My Requests
              </h2>
              <p className="text-sm text-slate-500">
                Total {requests.length} reports for your unit
              </p>
            </div>

            {requests.length > 0 ? (
              <div className="space-y-3">
                {requests.map((request) => {
                  const cfg =
                    statusConfig[request.status] ||
                    statusConfig[MaintenanceStatus.OPEN];
                  const StatusIcon = cfg.icon;
                  return (
                    <div
                      key={request.id}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-4 active:bg-slate-50 transition-colors"
                    >
                      <div
                        className={cn(
                          'h-12 w-12 rounded-xl flex items-center justify-center shrink-0',
                          cfg.bg
                        )}
                      >
                        <StatusIcon className={cn('h-6 w-6', cfg.color)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span
                            className={cn(
                              'text-[10px] font-bold uppercase tracking-widest',
                              cfg.color
                            )}
                          >
                            {cfg.label}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {format(new Date(request.createdAt), 'MMM dd')}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 truncate mb-1">
                          {request.title}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                          {request.category}
                        </p>
                      </div>

                      <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wrench className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  No active requests
                </h3>
                <p className="text-slate-500 text-sm max-w-[200px] mx-auto mb-8">
                  Report issues like plumbing, electrical, or A/C directly from
                  here.
                </p>
                <Link
                  href="/maintenance?new=true"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  <Plus className="h-5 w-5" />
                  Request Repair
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/** Client component wrapper */
import { ResidentRequestForm } from '@/components/maintenance/resident-request-form';

function MaintenanceFormWrapper() {
  return <ResidentRequestForm />;
}
