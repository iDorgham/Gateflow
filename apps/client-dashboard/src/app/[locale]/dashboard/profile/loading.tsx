export default function ProfileLoading() {
  return (
    <div className="max-w-2xl space-y-6 animate-pulse">
      <div className="h-7 w-20 rounded-lg bg-slate-200" />

      {/* Avatar + info card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-slate-200" />
          <div>
            <div className="h-5 w-36 rounded bg-slate-200" />
            <div className="mt-1.5 h-3 w-52 rounded bg-slate-100" />
            <div className="mt-2 h-5 w-20 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Edit form skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
        <div className="h-4 w-28 rounded bg-slate-200" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 w-20 rounded bg-slate-200 mb-2" />
            <div className="h-10 w-full rounded-lg bg-slate-100" />
          </div>
        ))}
        <div className="h-10 w-32 rounded-lg bg-slate-200" />
      </div>

      {/* Password section skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
        <div className="h-4 w-32 rounded bg-slate-200" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 w-28 rounded bg-slate-200 mb-2" />
            <div className="h-10 w-full rounded-lg bg-slate-100" />
          </div>
        ))}
        <div className="h-10 w-40 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}
