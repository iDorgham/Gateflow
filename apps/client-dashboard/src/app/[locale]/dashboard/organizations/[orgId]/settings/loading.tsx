export default function SettingsSectionLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex gap-2">
        <div className="h-9 w-24 rounded-lg bg-muted" />
        <div className="h-9 w-24 rounded-lg bg-muted/60" />
        <div className="h-9 w-24 rounded-lg bg-muted/60" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-3 w-full max-w-md rounded bg-muted/60" />
        <div className="h-3 w-full max-w-sm rounded bg-muted/60" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border/50 bg-muted/30 px-5 py-3">
          <div className="h-3 w-32 rounded bg-muted" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-border/50 px-5 py-4 last:border-0"
          >
            <div className="h-4 w-48 rounded bg-muted/60" />
            <div className="h-8 w-20 rounded-lg bg-muted/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
