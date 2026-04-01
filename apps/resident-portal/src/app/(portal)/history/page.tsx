import { PageHeader } from '@/components/layout/page-header';
import {
  HistoryContent,
  type ResidentHistoryItem,
} from '@/components/history/history-content';
import { PullToRefresh } from '@/components/common/pull-to-refresh';

async function fetchHistory(): Promise<ResidentHistoryItem[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? ''}/resident/history`,
    {
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    return [];
  }
  const json = await res.json();
  if (!json?.success || !Array.isArray(json.data)) {
    return [];
  }
  return json.data as ResidentHistoryItem[];
}

export default async function HistoryPage() {
  const scans = await fetchHistory();

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Access History" backHref="/" />
      <PullToRefresh>
        <main className="mx-auto w-full max-w-md space-y-4 px-4 py-6 pb-24 md:max-w-5xl">
          <HistoryContent scans={scans} />
        </main>
      </PullToRefresh>
    </div>
  );
}
