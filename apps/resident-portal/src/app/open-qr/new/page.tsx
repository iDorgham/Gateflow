import Link from 'next/link';
import { ArrowLeft, Users, ShieldCheck } from 'lucide-react';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { OpenQRForm } from '@/components/open-qr-form';

export default async function NewOpenQRPage() {
  const claims = await getSessionClaims();
  const userId = claims?.sub || 'dev-resident-id';

  const unit = await prisma.unit.findFirst({
    where: { userId, deletedAt: null },
  });

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-slate-500">No unit assigned to your account.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Open Access QR</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 pb-12">
        <div className="mb-6 flex items-center gap-4 bg-slate-100 border border-slate-200 rounded-xl p-4">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
            <Users className="h-6 w-6 text-slate-900" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Reusable Guest Pass</p>
            <p className="text-xs text-slate-600 leading-tight">
              Create a single QR code that works for multiple visitors (e.g. for a party).
            </p>
          </div>
        </div>

        <OpenQRForm unitId={unit.id} />
      </main>
    </div>
  );
}
