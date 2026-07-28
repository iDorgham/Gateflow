// Dashboard home skeleton
export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-32 rounded-lg bg-muted" />
          <div className="mt-1.5 h-4 w-52 rounded bg-muted/60" />
        </div>
        <div className="h-9 w-36 rounded-lg bg-muted" />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-3.5 w-28 rounded bg-muted" />
              <div className="h-9 w-9 rounded-lg bg-muted/60" />
            </div>
            <div className="h-8 w-16 rounded bg-muted" />
            <div className="mt-2 h-3 w-24 rounded bg-muted/60" />
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-12 rounded-lg border border-border bg-card"
          />
        ))}
      </div>

      {/* Recent activity card */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
          <div className="h-4 w-40 rounded bg-muted" />
          <div className="h-4 w-16 rounded bg-muted/60" />
        </div>
        <div className="divide-y divide-border/50 px-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-muted" />
                <div className="h-5 w-20 rounded-full bg-muted" />
                <div className="h-3 w-32 rounded bg-muted/60" />
                <div className="hidden h-3 w-24 rounded bg-muted/60 sm:block" />
              </div>
              <div className="h-3 w-14 rounded bg-muted/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
