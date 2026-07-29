import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import {
  MaintenanceHub,
  type MaintenanceRequestItem,
} from '@/components/maintenance/maintenance-hub';
import { ResidentRequestForm } from '@/components/maintenance/resident-request-form';
import { fetchResidentJson } from '@/lib/resident-api-fetch';

async function fetchMyRequests(): Promise<{
  requests: MaintenanceRequestItem[];
  error: string | null;
}> {
  const result = await fetchResidentJson<MaintenanceRequestItem[]>(
    '/resident/maintenance'
  );
  if (!result.ok) {
    return {
      requests: [],
      error:
        result.error === 'Unauthorized'
          ? 'Sign in again to view maintenance requests.'
          : 'Could not load maintenance requests.',
    };
  }
  return {
    requests: Array.isArray(result.data) ? result.data : [],
    error: null,
  };
}

export default async function MaintenancePage(props: {
  params: Promise<Record<string, string>>;
  searchParams: Promise<{ new?: string }>;
}) {
  const searchParams = await props.searchParams;
  const isNew = searchParams.new === 'true';
  const { requests, error } = await fetchMyRequests();

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Maintenance"
        backHref="/"
        action={
          !isNew ? (
            <Link
              href="/maintenance?new=true"
              className="rounded-full bg-blue-600 p-2 text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
            >
              <Plus className="h-5 w-5" />
            </Link>
          ) : null
        }
      />

      <main className="mx-auto w-full max-w-md space-y-6 px-4 py-6 pb-24 md:max-w-6xl">
        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            {error}
          </div>
        ) : null}
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
            <MaintenanceHub requests={requests} />
          </div>
        )}
      </main>
    </div>
  );
}

function MaintenanceFormWrapper() {
  return <ResidentRequestForm />;
}
