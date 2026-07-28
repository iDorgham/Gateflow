export default function ContactsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 rounded-lg bg-muted" />
          <div className="h-4 w-56 rounded bg-muted/60" />
        </div>
        <div className="h-9 w-32 rounded-lg bg-muted" />
      </div>

      <div className="h-16 rounded-2xl border border-border bg-card" />

      <div className="overflow-hidden rounded-2xl border border-border bg-card min-h-[400px]">
        <div className="border-b border-border/50 bg-muted/30 px-5 py-3">
          <div className="h-3 w-40 rounded bg-muted" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-border/50 px-5 py-4 last:border-0"
          >
            <div className="h-4 w-48 rounded bg-muted/60" />
            <div className="h-4 w-24 rounded bg-muted/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
