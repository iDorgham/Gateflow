import { PageHeader } from '@/components/layout/page-header';
import {
  HistoryContent,
  type ResidentHistoryItem,
} from '@/components/history/history-content';
import { PullToRefresh } from '@/components/common/pull-to-refresh';
import { fetchResidentJson } from '@/lib/resident-api-fetch';

export default async function HistoryPage() {
  const result =
    await fetchResidentJson<ResidentHistoryItem[]>('/resident/history');
  const scans = result.ok && Array.isArray(result.data) ? result.data : [];
  const errorMessage = result.ok
    ? null
    : result.error === 'Unauthorized'
      ? 'Sign in again to view access history.'
      : 'Could not load access history. Pull to retry.';

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Access History" backHref="/" />
      <PullToRefresh>
        <main className="mx-auto w-full max-w-md space-y-4 px-4 py-6 pb-24 md:max-w-5xl">
          {errorMessage ? (
            <div
              role="alert"
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            >
              {errorMessage}
            </div>
          ) : null}
          <HistoryContent scans={scans} />
        </main>
      </PullToRefresh>
    </div>
  );
}
