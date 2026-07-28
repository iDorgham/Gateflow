export default function AiHubLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-32 rounded-lg bg-muted" />
        <div className="h-4 w-64 rounded bg-muted/60" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card h-32"
          />
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card h-72" />
    </div>
  );
}
