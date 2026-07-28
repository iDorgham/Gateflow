// QR Codes page skeleton
export default function QRCodesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-28 rounded-lg bg-muted" />
          <div className="mt-1.5 h-4 w-40 rounded bg-muted/60" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-36 rounded-lg bg-muted" />
          <div className="h-9 w-32 rounded-lg bg-muted/60" />
        </div>
      </div>

      {/* Search/filter bar */}
      <div className="h-10 w-72 max-w-full rounded-lg bg-muted/60" />

      {/* Table card */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Table header */}
        <div className="flex gap-6 border-b border-border/50 bg-muted/30 px-5 py-3">
          {[100, 70, 80, 60, 80, 60, 50].map((w, i) => (
            <div
              key={i}
              className="h-3 rounded bg-muted"
              style={{ width: w }}
            />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-6 border-b border-border/50 px-5 py-3.5 last:border-0"
          >
            <div className="h-3 w-48 rounded bg-muted/60 font-mono" />
            <div className="h-5 w-20 rounded-full bg-muted/60" />
            <div className="h-3 w-24 rounded bg-muted/60" />
            <div className="h-3 w-16 rounded bg-muted/60" />
            <div className="h-3 w-20 rounded bg-muted/60" />
            <div className="h-5 w-16 rounded-full bg-muted/60" />
            <div className="ml-auto flex gap-2">
              <div className="h-7 w-12 rounded bg-muted/60" />
              <div className="h-7 w-20 rounded bg-muted/60" />
              <div className="h-7 w-14 rounded bg-muted/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
