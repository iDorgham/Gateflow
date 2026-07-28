export default function CrmLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-lg bg-muted" />
        <div className="h-4 w-64 rounded bg-muted/60" />
      </div>

      <div className="flex gap-2">
        <div className="h-9 w-24 rounded-lg bg-muted" />
        <div className="h-9 w-24 rounded-lg bg-muted/60" />
        <div className="h-9 w-24 rounded-lg bg-muted/60" />
      </div>

      <div className="rounded-3xl border border-border bg-card h-96" />
    </div>
  );
}
