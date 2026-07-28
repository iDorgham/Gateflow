export default function ProjectDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-3xl border border-border bg-card h-40" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card h-24"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card h-64"
          />
        ))}
      </div>
    </div>
  );
}
