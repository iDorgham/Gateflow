// Analytics page skeleton — matches 6-col KPI grid + section-divided chart layout
export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="h-6 w-28 rounded-xl bg-muted" />
          <div className="mt-2 h-3.5 w-72 rounded bg-muted/60" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 rounded-xl bg-muted" />
          <div className="h-9 w-9 rounded-xl bg-muted" />
          <div className="h-9 w-9 rounded-xl bg-muted" />
        </div>
      </div>

      {/* Filter bar */}
      <div className="h-[52px] rounded-2xl border border-border bg-card" />

      {/* 6 KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-20 rounded bg-muted" />
              <div className="h-8 w-8 rounded-xl bg-muted/70" />
            </div>
            <div className="h-8 w-16 rounded-lg bg-muted" />
          </div>
        ))}
      </div>

      {/* Section divider */}
      <div className="flex items-center gap-3">
        <div className="h-2.5 w-28 rounded bg-muted/50" />
        <div className="flex-1 h-px bg-border/50" />
      </div>

      {/* Full-width area chart */}
      <div className="rounded-2xl border border-border bg-card h-[260px]" />

      {/* Section divider */}
      <div className="flex items-center gap-3">
        <div className="h-2.5 w-40 rounded bg-muted/50" />
        <div className="flex-1 h-px bg-border/50" />
      </div>

      {/* 3-col chart grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card h-[280px]" />
        ))}
      </div>

      {/* Section divider */}
      <div className="flex items-center gap-3">
        <div className="h-2.5 w-32 rounded bg-muted/50" />
        <div className="flex-1 h-px bg-border/50" />
      </div>

      {/* Mixed chart row */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-3 rounded-2xl border border-border bg-card h-[280px]" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card h-[280px]" />
        ))}
      </div>
    </div>
  );
}
