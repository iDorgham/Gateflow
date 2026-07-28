export default function TeamLoading() {
  return (
    <div className="max-w-4xl space-y-6 animate-pulse">
      <div className="h-7 w-16 rounded-lg bg-muted" />

      {/* Invite banner skeleton */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="mt-3 flex gap-3">
          <div className="h-10 flex-1 rounded-lg bg-muted/60" />
          <div className="h-10 w-24 rounded-lg bg-muted" />
        </div>
      </div>

      {/* Members list skeleton */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b bg-muted/30 px-5 py-3">
          <div className="h-4 w-32 rounded bg-muted" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b px-5 py-4 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-muted" />
              <div>
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="mt-1.5 h-3 w-48 rounded bg-muted/60" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-16 rounded-full bg-muted/60" />
              <div className="h-8 w-8 rounded-md bg-muted/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
