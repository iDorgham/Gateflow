'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
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
} from '@gate-access/ui';
import { AlertCircle, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

function SubmitButton() {
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
        <>
          Sign in to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] dark:bg-primary/10" />
        <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] dark:bg-blue-500/10" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10 space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-2xl shadow-primary/40 ring-4 ring-background transition-transform hover:scale-105 duration-300">
            <ShieldCheck className="h-9 w-9" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              GateFlow <span className="text-primary font-medium opacity-90">Client</span>
            </h1>
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-[0.3em] opacity-60">
              Access & Security Management
            </p>
          </div>
        </div>

        <Card className="border-border/40 shadow-2xl shadow-slate-200/50 dark:shadow-black/60 backdrop-blur-xl bg-card/80 transition-all duration-500">
          <CardHeader className="pb-6 pt-8 px-8">
            <CardTitle className="text-xl font-bold">Sign In</CardTitle>
            <CardDescription className="text-muted-foreground">
              Welcome back. Enter your credentials to access your dashboard.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form action={formAction} className="space-y-6">
              {state?.error && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive font-semibold flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                  {state.error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/90">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                    className="h-12 bg-background/50 border-border/60 focus:ring-primary/20 focus:border-primary transition-all duration-300 pl-4"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/90">
                      Password
                    </Label>
                    <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity">
                      Forgot?
                    </a>
                  </div>
                  <div className="relative group">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="h-12 bg-background/50 border-border/60 focus:ring-primary/20 focus:border-primary transition-all duration-300 pl-4 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center space-y-4">
          <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.3em] leading-relaxed max-w-[280px] mx-auto">
            Authorized personnel only. Sessions are encrypted and audited.
          </p>
          <p className="text-[10px] text-muted-foreground/20 font-medium">
            © {new Date().getFullYear()} GateFlow Ecosystem
          </p>
        </div>
      </div>
    </div>
  );
}
