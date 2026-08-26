'use client';

import { useActionState, useState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { loginAction } from './actions';
import { Button } from '@gateflow/ui/button';
import { Card, CardContent } from '@gateflow/ui/card';
import { cn } from '@gateflow/ui/cn';
import { Input } from '@gateflow/ui/input';
import { Label } from '@gateflow/ui/label';
import { LoginShell } from '@gateflow/ui/login-shell';
import {
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sun,
  Moon,
  Globe,
  Check,
  Mail,
  Lock,
} from 'lucide-react';
import type { Locale } from '@/lib/i18n-config';

// ─── Locale & Theme helpers ──────────────────────────────────────────────────

const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  'ar-EG': 'العربية',
};

const LOCALES = ['en', 'ar-EG'] as const;

function LoginControls({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const switchLocale = (next: string) => {
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/'));
    setLangOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Language picker */}
      <div className="relative">
        <button
          onClick={() => setLangOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none shadow-sm"
          aria-label="Switch language"
        >
          <Globe className="h-3.5 w-3.5 text-primary" />
          {LOCALE_LABELS[locale] ?? locale}
        </button>
        {langOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setLangOpen(false)}
            />
            <div className="absolute end-0 top-full mt-2 z-20 min-w-[130px] rounded-xl border border-border bg-popover shadow-xl py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className="flex w-full items-center justify-between gap-2 px-3.5 py-2 text-xs font-medium hover:bg-muted transition-colors"
                >
                  {LOCALE_LABELS[l]}
                  {l === locale && (
                    <Check className="h-3.5 w-3.5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => {
          if (!mounted) return;
          document.documentElement.classList.add('transitioning');
          setTheme(theme === 'dark' ? 'light' : 'dark');
          setTimeout(
            () => document.documentElement.classList.remove('transitioning'),
            350
          );
        }}
        className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none shadow-sm"
        aria-label="Toggle theme"
      >
        {mounted && theme === 'dark' ? (
          <Sun className="h-3.5 w-3.5 text-warning" />
        ) : (
          <Moon className="h-3.5 w-3.5 text-foreground" />
        )}
      </button>
    </div>
  );
}

// ─── Submit button ─────────────────────────────────────────────────────────────

function SubmitButton({ isRtl }: { isRtl: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg active:scale-[0.99] transition-all duration-200"
    >
      {pending ? (
        <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary-foreground" />
      ) : (
        <span
          className={cn(
            'flex items-center justify-center gap-2 text-sm font-semibold',
            isRtl && 'flex-row-reverse'
          )}
        >
          {isRtl ? 'تسجيل الدخول' : 'Sign in to Dashboard'}
          <ArrowRight className={cn('h-4 w-4', isRtl && 'rotate-180')} />
        </span>
      )}
    </Button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { t } = useTranslation('login');
  const [state, formAction] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorKey, setErrorKey] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const previousErrorRef = useRef<string | undefined>(undefined);

  const pathname = usePathname();
  const locale = (pathname.split('/')[1] ?? 'en') as Locale;
  const isRtl = locale === 'ar-EG';

  // Watch for success
  useEffect(() => {
    if (state?.success) {
      setIsSuccess(true);
      // Wait for animation, then redirect
      const timer = setTimeout(() => {
        router.push(
          state.mustChangePassword
            ? `/${state.locale || locale}/change-password`
            : `/${state.locale || locale}/dashboard`
        );
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [
    state?.success,
    state?.locale,
    state?.mustChangePassword,
    locale,
    router,
  ]);

  // Increment errorKey whenever a new error appears so shake fires
  useEffect(() => {
    if (state?.error && state.error !== previousErrorRef.current) {
      setErrorKey((k) => k + 1);
    }
    previousErrorRef.current = state?.error;
  }, [state?.error]);

  return (
    <LoginShell
      variant="client"
      appName="GateFlow"
      heading={t('heading', 'Welcome back')}
      subtitle={t(
        'subtitle',
        'Enter your credentials to access your organization dashboard.'
      )}
      topRight={<LoginControls locale={locale} />}
      errorKey={errorKey}
      isSuccess={isSuccess}
    >
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <form
            action={formAction}
            className="space-y-4"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {state?.error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs font-semibold text-destructive flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {state.error}
              </div>
            )}

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold text-foreground/90"
                >
                  {isRtl ? 'البريد الإلكتروني' : 'Email address'}
                </Label>
                <div className="relative" suppressHydrationWarning>
                  <Mail
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60',
                      isRtl ? 'right-3' : 'left-3'
                    )}
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    defaultValue={state?.email ?? ''}
                    autoComplete="email"
                    required
                    className={cn(
                      'h-10 rounded-xl border-input bg-background/50 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all',
                      isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
                    )}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs font-semibold text-foreground/90"
                  >
                    {isRtl ? 'كلمة المرور' : 'Password'}
                  </Label>
                  <a
                    href="mailto:support@gateflow.site?subject=Password%20Reset%20Request"
                    className="text-xs font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
                  >
                    {isRtl ? 'نسيت كلمة المرور؟' : "Can't log in?"}
                  </a>
                </div>
                <div className="relative" suppressHydrationWarning>
                  <Lock
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60',
                      isRtl ? 'right-3' : 'left-3'
                    )}
                  />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className={cn(
                      'h-10 rounded-xl border-input bg-background/50 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all',
                      isRtl ? 'pr-9 pl-9' : 'pl-9 pr-9'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors focus:outline-none',
                      isRtl ? 'left-3' : 'right-3'
                    )}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <SubmitButton isRtl={isRtl} />

            <div className="pt-4 border-t border-border/60 text-center">
              <p className="text-xs text-muted-foreground font-medium">
                {isRtl ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                <a
                  href="mailto:support@gateflow.site"
                  className="text-primary font-semibold hover:underline transition-opacity"
                >
                  {isRtl ? 'اتصل بالدعم' : 'Contact Support'}
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </LoginShell>
  );
}
