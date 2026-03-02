'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Button,
  Input,
  Label,
  LoginShell,
  cn,
} from '@gate-access/ui';
import {
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  Sun,
  Moon,
  Globe,
  Check,
  Copy,
} from 'lucide-react';
import type { Locale } from '@/lib/i18n/i18n-config';

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
            <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminLoginPage() {
  const { t } = useTranslation('login');
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const DEV_KEY = 'dev-admin-key-change-in-production';

  async function handleCopyDevKey() {
    try {
      await navigator.clipboard.writeText(DEV_KEY);
      setKey(DEV_KEY);
      setError('');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback: fill input
      setKey(DEV_KEY);
      setError('');
    }
  }

  const pathname = usePathname();
  const locale = (pathname.split('/')[1] ?? 'en') as Locale;
  const isRtl = locale === 'ar-EG';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const currentKey = inputRef.current?.value ?? key;
    if (!currentKey.trim()) return;

    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: currentKey }),
      });
      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const json = await res.json().catch(() => ({}));
        const msg = json.message ?? 'Invalid access key.';
        setError(msg);
        setErrorKey((k) => k + 1);
      }
    } catch {
      setError('Network error. Please try again.');
      setErrorKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginShell
      variant="admin"
      appName="Admin"
      heading={t('adminHeading', 'Admin Portal')}
      subtitle={t('adminSubtitle', 'Secure access for platform operators. Use your organization access key.')}
      topRight={
        <div className="flex items-center gap-1">
          {process.env.NODE_ENV !== 'production' && (
            <div
              className={cn(
                'group flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors',
                'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground',
                isRtl && 'flex-row-reverse'
              )}
            >
              <button
                type="button"
                onClick={handleCopyDevKey}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={copied ? t('copied', 'Copied') : t('copyKey', 'Copy key')}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-success" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
              <span className="max-w-0 overflow-hidden opacity-0 text-xs font-medium whitespace-nowrap transition-all duration-200 group-hover:max-w-[120px] group-hover:opacity-100">
                {copied ? t('copied', 'Copied') : t('copyKey', 'Copy key')}
              </span>
            </div>
          )}
          <LoginControls locale={locale} />
        </div>
      }
      errorKey={errorKey}
    >
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="px-0 pb-0">
          <form onSubmit={handleSubmit} className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="key"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground/90"
              >
                {isRtl ? 'مفتاح التفويض' : 'Authorization Key'}
              </Label>
              <div className="relative">
                <Input
                  id="key"
                  ref={inputRef}
                  type={showKey ? 'text' : 'password'}
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••••••••••"
                  className={cn(
                    'h-12 bg-background/50 border-border/60 focus:ring-primary/20 focus:border-primary transition-all duration-300',
                    isRtl ? 'pl-12 pr-4' : 'pr-12 pl-4'
                  )}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors focus:outline-none',
                    isRtl ? 'left-3' : 'right-3'
                  )}
                >
                  {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {process.env.NODE_ENV !== 'production' && (
              <p className="text-xs text-muted-foreground/80 whitespace-pre-line">
                {t('adminDevKeyHint', 'Need the dev key?\nHover over the copy icon in the top-right corner.')}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-300 hover:translate-y-[-1px]"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className={cn('flex items-center gap-2', isRtl && 'flex-row-reverse')}>
                  {isRtl ? 'تفويض الوصول' : 'Authorize Access'}
                  <ArrowRight className={cn('h-4 w-4', isRtl && 'rotate-180')} />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </LoginShell>
  );
}
