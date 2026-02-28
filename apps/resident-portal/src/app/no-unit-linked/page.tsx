import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { Button } from '@gate-access/ui';

export default function NoUnitLinkedPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">No unit linked to your account</h1>
          <p className="mt-2 text-muted-foreground">
            Your account has the Resident role but is not linked to any unit yet. Please contact your
            organization administrator to link your account to a unit from the Units page.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
