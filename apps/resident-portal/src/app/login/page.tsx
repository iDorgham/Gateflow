import Link from 'next/link';

export default function ResidentLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            GateFlow Resident Portal
          </h1>
          <p className="text-sm text-slate-600">
            Sign in from your main GateFlow account, then return here.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <p className="text-sm text-slate-700">
            The resident portal currently reuses your existing GateFlow login session.
            Please sign in via the main dashboard, then refresh this page.
          </p>
          <Link
            href="https://app.gateflow.io/login"
            className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            Go to main login
          </Link>
        </div>
      </div>
    </main>
  );
}

