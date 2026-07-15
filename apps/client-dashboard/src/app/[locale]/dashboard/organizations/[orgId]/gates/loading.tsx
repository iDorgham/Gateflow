// Gates page skeleton
export default function GatesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-7 w-20 rounded-lg bg-slate-200" />
        <div className="mt-1.5 h-4 w-72 rounded bg-slate-100" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="mt-1.5 h-3 w-52 rounded bg-slate-100" />
        </div>
        <div className="h-9 w-28 rounded-lg bg-slate-200" />
      </div>

      {/* Gate cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Card header */}
            <div className="flex items-start justify-between p-5 pb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <div className="h-4 w-32 rounded bg-slate-200" />
                </div>
                <div className="mt-1.5 h-3 w-40 rounded bg-slate-100" />
              </div>
              <div className="h-8 w-8 rounded-md bg-slate-100" />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-px border-y border-slate-100 bg-slate-100">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex flex-col items-center bg-white py-3">
                  <div className="h-5 w-10 rounded bg-slate-200" />
                  <div className="mt-1 h-3 w-14 rounded bg-slate-100" />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3">
              <div className="h-5 w-16 rounded-full bg-slate-200" />
              <div className="h-3 w-28 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
