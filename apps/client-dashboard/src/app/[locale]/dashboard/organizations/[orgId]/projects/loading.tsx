export default function ProjectsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 rounded-lg bg-muted" />
          <div className="h-4 w-56 rounded bg-muted/60" />
        </div>
        <div className="h-9 w-32 rounded-lg bg-muted" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-border bg-card p-5 space-y-3"
          >
            <div className="h-4 w-32 rounded bg-muted/60" />
            <div className="h-3 w-full rounded bg-muted/40" />
            <div className="h-3 w-2/3 rounded bg-muted/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
