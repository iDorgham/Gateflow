export default function ScansLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-8 w-32 rounded bg-slate-200" />
        <div className="mt-1 h-4 w-56 rounded bg-slate-100" />
      </div>

      {/* Filter bar skeleton */}
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 rounded-md bg-slate-200" />
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-9 rounded-md bg-slate-200" />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-48 rounded bg-slate-100" />
          <div className="h-4 w-24 rounded bg-slate-100" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Header row */}
        <div className="flex gap-4 border-b bg-slate-50 px-4 py-3">
          {[120, 160, 80, 80, 100, 70].map((w, i) => (
            <div key={i} className="h-3 rounded bg-slate-200" style={{ width: w }} />
          ))}
        </div>

        {/* Data rows */}
        {Array.from({ length: 8 }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="flex items-center gap-4 border-b px-4 py-3 last:border-0"
          >
            <div className="h-3 w-28 rounded bg-slate-100" />
            <div className="h-3 w-40 rounded bg-slate-100" />
            <div className="h-3 w-20 rounded bg-slate-100" />
            <div className="h-3 w-20 rounded bg-slate-100" />
            <div className="h-3 w-24 rounded bg-slate-100" />
            <div className="h-5 w-16 rounded bg-slate-100" />
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-40 rounded bg-slate-100" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-10 rounded border bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
