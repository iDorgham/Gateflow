'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { loginAction } from './actions';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LoginShell,
  cn,
} from '@gate-access/ui';
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
} from 'lucide-react';
import type { Locale } from '@/lib/i18n-config';

// ─── Locale helpers ────────────────────────────────────────────────────────────

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
    <div className="flex items-center gap-1">
      {/* Language picker */}
      <div className="relative">
        <button
          onClick={() => setLangOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Switch language"
        >
          <Globe className="h-3.5 w-3.5" />
          {LOCALE_LABELS[locale] ?? locale}
        </button>
        {langOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setLangOpen(false)}
            />
            <div className="absolute end-0 top-full mt-1 z-20 min-w-[120px] rounded-xl border border-border bg-card shadow-xl py-1 overflow-hidden">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-xs font-medium hover:bg-accent transition-colors"
                >
                  {LOCALE_LABELS[l]}
                  {l === locale && <Check className="h-3 w-3 text-primary" />}
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
        className="rounded-lg p-2 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Toggle theme"
      >
        {mounted && theme === 'dark' ? (
          <Sun className="h-3.5 w-3.5" />
        ) : (
          <Moon className="h-3.5 w-3.5" />
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
      className="w-full h-12 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-300 hover:translate-y-[-1px]"
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <span className={cn('flex items-center gap-2', isRtl && 'flex-row-reverse')}>
          Sign In
          <ArrowRight className={cn('h-4 w-4', isRtl && 'rotate-180')} />
        </span>
      )}
    </Button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorKey, setErrorKey] = useState(0);

  const pathname = usePathname();
  const locale = (pathname.split('/')[1] ?? 'en') as Locale;
  const isRtl = locale === 'ar-EG';

  // Increment errorKey whenever a new error appears so shake fires
  const prevError = useState(state?.error)[0];
  useEffect(() => {
    if (state?.error && state.error !== prevError) {
      setErrorKey((k) => k + 1);
    }
  }, [state?.error]);

  return (
    <LoginShell
      variant="client"
      topRight={<LoginControls locale={locale} />}
      errorKey={errorKey}
      footerExtra={
        <p className="text-[10px] text-muted-foreground/40 font-medium">
          Don&apos;t have an account?{' '}
          <a
            href="mailto:support@gateflow.io"
            className="underline underline-offset-2 hover:text-muted-foreground/70 transition-colors"
          >
            Contact support
          </a>
        </p>
      }
    >
      <Card className="border-border/40 shadow-2xl shadow-slate-200/50 dark:shadow-black/60 backdrop-blur-xl bg-card/80 transition-all duration-500">
        <CardHeader className="pb-6 pt-8 px-8">
          <CardTitle className="text-xl font-bold">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form action={formAction} className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
            {state?.error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {state.error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground/90"
                >
                  {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={isRtl ? 'you@company.com' : 'you@company.com'}
                  autoComplete="email"
                  required
                  className="h-12 bg-background/50 border-border/60 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs font-bold uppercase tracking-widest text-muted-foreground/90"
                  >
                    {isRtl ? 'كلمة المرور' : 'Password'}
                  </Label>
                  <a
                    href="#"
                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
                    tabIndex={-1}
                  >
                    {isRtl ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className={cn(
                      'h-12 bg-background/50 border-border/60 focus:ring-primary/20 focus:border-primary transition-all duration-300',
                      isRtl ? 'pl-12 pr-4' : 'pr-12 pl-4'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors focus:outline-none',
                      isRtl ? 'left-3' : 'right-3'
                    )}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <SubmitButton isRtl={isRtl} />
          </form>
        </CardContent>
      </Card>
    </LoginShell>
  );
}
