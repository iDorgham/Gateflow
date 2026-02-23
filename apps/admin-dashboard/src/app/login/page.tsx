'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  Button,
  Input,
  Label
} from '@gate-access/ui';
import { Shield, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Read from DOM ref to catch autofill/browser-filled values that bypass React onChange
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
        setError(json.message ?? 'Invalid access key.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] dark:bg-primary/10" />
        <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] dark:bg-indigo-500/10" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10 space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2563eb] text-white shadow-2xl shadow-blue-500/40 ring-4 ring-background transition-transform hover:scale-105 duration-300">
            <Shield className="h-9 w-9" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              GateFlow <span className="text-[#2563eb] font-medium opacity-90">Admin</span>
            </h1>
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-[0.3em] opacity-60">
              Security Control Center
            </p>
          </div>
        </div>

        <Card className="border-border/40 shadow-2xl shadow-slate-200/50 dark:shadow-black/60 backdrop-blur-xl bg-card/80">
          <CardHeader className="pb-6 pt-8 px-8">
            <CardTitle className="text-xl font-bold">Sign In</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter the admin authorization key to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="key" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/90">
                    Authorization Key
                  </Label>
                  <div className="relative group">
                    <Input
                      id="key"
                      ref={inputRef}
                      type={showKey ? 'text' : 'password'}
                      value={key}
                      onChange={(e) => { setKey(e.target.value); setError(''); }}
                      placeholder="••••••••••••••••"
                      className="h-12 bg-background/50 border-border/60 focus:ring-primary/20 focus:border-primary transition-all duration-300 pl-4 pr-12"
                      autoFocus
                    />

                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors focus:outline-none"
                    >
                      {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive font-semibold flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                    {error}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-300 hover:translate-y-[-1px]"
              >

                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Authorize Access
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center space-y-4">
          <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.3em] leading-relaxed max-w-[280px] mx-auto">
            Authorized personnel only. Sessions are encrypted and audited.
          </p>
          <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 dark:bg-orange-500/10 dark:border-orange-500/20">
            <p className="text-[10px] text-orange-600/60 dark:text-orange-400/50 font-bold uppercase tracking-widest mb-1.5 flex items-center justify-center gap-2">
              <span className="h-1 w-1 rounded-full bg-orange-500" />
              Developer Access
              <span className="h-1 w-1 rounded-full bg-orange-500" />
            </p>
            <code 
              className="text-xs font-mono text-orange-600 dark:text-orange-400 opacity-80 select-all cursor-pointer hover:opacity-100 transition-opacity"
              onClick={() => { setKey('dev-admin-key-change-in-production'); setError(''); }}
            >
              dev-admin-key-change-in-production
            </code>

          </div>
        </div>
      </div>
    </div>
  );
}
