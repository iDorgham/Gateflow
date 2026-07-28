export default function IncidentsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-32 rounded-lg bg-muted" />
        <div className="h-4 w-56 rounded bg-muted/60" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-5 space-y-2"
          >
            <div className="h-4 w-48 rounded bg-muted/60" />
            <div className="h-3 w-full max-w-md rounded bg-muted/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
