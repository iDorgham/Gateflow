import Link from 'next/link';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { VisitorForm } from '@/components/visitor-form';

export default async function NewVisitorPage() {
  const claims = await getSessionClaims();
  const userId = claims?.sub || 'dev-resident-id';

  const unit = await prisma.unit.findFirst({
    where: { userId, deletedAt: null },
  });

  if (!unit) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/visitors" className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Add Visitor</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 pb-12">
        <div className="mb-6 flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">New Guest Pass</p>
            <p className="text-xs text-slate-600 leading-tight">
              A temporary QR code will be generated for your visitor. You can share it via WhatsApp
              or Email.
            </p>
          </div>
        </div>

        <VisitorForm unitId={unit.id} />
      </main>
    </div>
  );
}
