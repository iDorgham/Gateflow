// Gates page skeleton
export default function GatesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-7 w-20 rounded-lg bg-muted" />
        <div className="mt-1.5 h-4 w-72 rounded bg-muted/60" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="mt-1.5 h-3 w-52 rounded bg-muted/60" />
        </div>
        <div className="h-9 w-28 rounded-lg bg-muted" />
      </div>

      {/* Gate cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card shadow-sm"
          >
            {/* Card header */}
            <div className="flex items-start justify-between p-5 pb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-muted" />
                  <div className="h-4 w-32 rounded bg-muted" />
                </div>
                <div className="mt-1.5 h-3 w-40 rounded bg-muted/60" />
              </div>
              <div className="h-8 w-8 rounded-md bg-muted/60" />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-px border-y border-border/50 bg-muted/60">
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
                  className="flex flex-col items-center bg-card py-3"
                >
                  <div className="h-5 w-10 rounded bg-muted" />
                  <div className="mt-1 h-3 w-14 rounded bg-muted/60" />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3">
              <div className="h-5 w-16 rounded-full bg-muted" />
              <div className="h-3 w-28 rounded bg-muted/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
