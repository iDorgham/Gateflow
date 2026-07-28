export default function CreateQrLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-muted" />
        <div className="h-7 w-40 rounded-lg bg-muted" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-24 rounded bg-muted/60" />
            <div className="h-10 rounded-lg bg-muted/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
