// Analytics page skeleton
export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-7 w-28 rounded-lg bg-slate-200" />
        <div className="mt-1.5 h-4 w-72 rounded bg-slate-100" />
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="h-3.5 w-32 rounded bg-slate-200" />
            <div className="mt-3 h-8 w-20 rounded bg-slate-200" />
            <div className="mt-3 h-2 w-full rounded-full bg-slate-100" />
            <div className="mt-2 h-3 w-24 rounded bg-slate-100" />
          </div>
        ))}
      </div>

      {/* Bar chart card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="h-4 w-52 rounded bg-slate-200" />
          <div className="mt-1.5 h-3 w-40 rounded bg-slate-100" />
        </div>
        <div className="flex h-48 items-end gap-3 p-5 pt-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div
                className="w-full rounded-t bg-slate-200"
                style={{ height: `${30 + Math.random() * 60}%` }}
              />
              <div className="h-3 w-8 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom two cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1].map((card) => (
          <div key={card} className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="h-4 w-44 rounded bg-slate-200" />
            </div>
            <div className="space-y-4 p-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="h-3 w-28 rounded bg-slate-200" />
                    <div className="h-3 w-16 rounded bg-slate-100" />
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-200"
                      style={{ width: `${40 + Math.random() * 50}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
