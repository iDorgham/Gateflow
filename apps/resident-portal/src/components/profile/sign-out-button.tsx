'use client';

import { useTransition } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@gateflow/ui';
import { signOutAction } from '@/app/actions/sign-out';

export function SignOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          void signOutAction();
        });
      }}
    >
      <LogOut className="h-4 w-4" />
      {pending ? 'Signing out…' : 'Sign Out'}
    </Button>
  );
}
