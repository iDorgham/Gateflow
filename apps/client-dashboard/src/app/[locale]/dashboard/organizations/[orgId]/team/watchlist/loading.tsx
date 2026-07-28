export default function WatchlistLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-40 rounded-lg bg-muted" />
        <div className="h-4 w-64 rounded bg-muted/60" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-5 space-y-2"
          >
            <div className="h-3 w-20 rounded bg-muted/60" />
            <div className="h-7 w-12 rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="h-10 w-full max-w-sm rounded-lg bg-muted/60" />

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-border/50 px-5 py-4 last:border-0"
          >
            <div className="h-4 w-56 rounded bg-muted/60" />
            <div className="h-6 w-20 rounded-full bg-muted/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
