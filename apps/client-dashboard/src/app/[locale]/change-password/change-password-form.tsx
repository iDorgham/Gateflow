'use client';

import { useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@gateflow/ui/button';
import { Card, CardContent } from '@gateflow/ui/card';
import { Input } from '@gateflow/ui/input';
import { Label } from '@gateflow/ui/label';
import { LoginShell } from '@gateflow/ui/login-shell';
import { cn } from '@gateflow/ui/cn';
import { AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import type { Locale } from '@/lib/i18n-config';
import { completeForcedPasswordChange } from './actions';

export function ChangePasswordForm() {
  const { t } = useTranslation('login');
  const router = useRouter();
  const pathname = usePathname();
  const locale = (pathname.split('/')[1] ?? 'en') as Locale;
  const isRtl = locale === 'ar-EG';
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await completeForcedPasswordChange(
        password,
        confirmPassword
      );
      if (!result.success) {
        setError(result.error || 'Could not update password.');
        return;
      }
      toast.success(
        t('passwordUpdated', 'Password updated. Welcome to GateFlow.')
      );
      router.replace(`/${locale}/dashboard`);
    });
  };

  return (
    <LoginShell
      variant="client"
      appName="GateFlow"
      heading={t('resetHeading', 'Choose a new password')}
      subtitle={t(
        'resetSubtitle',
        'Your administrator asked you to set your own password before continuing.'
      )}
    >
      <Card className="border-none bg-transparent shadow-none">
        <CardContent className="p-0">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {error ? (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs font-semibold text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            ) : null}

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="new-password"
                  className="text-xs font-semibold text-foreground/90"
                >
                  {isRtl ? 'كلمة المرور الجديدة' : 'New password'}
                </Label>
                <div className="relative">
                  <KeyRound
                    className={cn(
                      'absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60',
                      isRtl ? 'right-3' : 'left-3'
                    )}
                  />
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-10 rounded-xl px-9 text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground',
                      isRtl ? 'left-3' : 'right-3'
                    )}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="confirm-password"
                  className="text-xs font-semibold text-foreground/90"
                >
                  {isRtl ? 'تأكيد كلمة المرور' : 'Confirm password'}
                </Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="h-10 rounded-xl text-sm font-medium"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-xl text-xs font-black uppercase tracking-widest"
            >
              {isPending
                ? t('saving', 'Saving...')
                : t('savePassword', 'Save and continue')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </LoginShell>
  );
}
