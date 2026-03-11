import Link from 'next/link';
import { ArrowLeft, History, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ResidentHistoryItem {
  id: string;
  status: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'MAX_USES_REACHED' | 'INACTIVE' | 'DENIED';
  scannedAt: string;
  gateName: string;
  visitorName: string;
}

async function fetchHistory(): Promise<ResidentHistoryItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ''}/resident/history`, {
    cache: 'no-store',
  });
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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Access History</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4 pb-12">
        <div className="space-y-3">
          {scans.length > 0 ? (
            scans.map((scan) => (
              <div
                key={scan.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-start gap-3"
              >
                <div
                  className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    scan.status === 'SUCCESS' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {scan.status === 'SUCCESS' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-slate-900">
                      {scan.visitorName}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400 uppercase">
                      {format(new Date(scan.scannedAt), 'HH:mm')}
                    </span>
                  </div>
                    <p className="text-sm text-slate-600">
                      Entered through{' '}
                      <span className="font-medium text-slate-900">{scan.gateName}</span>
                    </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(scan.scannedAt), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No access logs yet</p>
              <p className="text-slate-400 text-sm mt-1">
                Logs will appear here once visitors scan their QR codes.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
