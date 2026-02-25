'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
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
import { csrfFetch } from '@/lib/csrf';
import { AlertCircle, ArrowRight, Building2, CheckCircle2, User } from 'lucide-react';

type Step = 1 | 2 | 3;

const STEPS = [
  { id: 1 as Step, label: 'Your profile', icon: User },
  { id: 2 as Step, label: 'Organization', icon: Building2 },
  { id: 3 as Step, label: 'Review', icon: CheckCircle2 },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function next() {
    setError(null);
    if (step === 1) {
      if (!name.trim()) return setError('Please enter your name.');
      setStep(2);
    } else if (step === 2) {
      if (!orgName.trim()) return setError('Please enter an organization name.');
      if (!orgEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orgEmail))
        return setError('Please enter a valid organization email.');
      setStep(3);
    } else {
      startTransition(async () => {
        try {
          const res = await csrfFetch('/api/onboarding/complete', {
            method: 'POST',
            body: JSON.stringify({ name, orgName, orgEmail }),
          });

          const json = await res.json().catch(() => null);

          if (res.ok) {
            router.push('/dashboard');
            router.refresh();
          } else {
            setError(json?.message || 'Something went wrong. Please try again.');
          }
        } catch (err) {
          console.error('Fetch error:', err);
          setError('Network error. Please try again.');
        }
      });
    }
  }

  const titles: Record<Step, string> = {
    1: 'Welcome to GateFlow',
    2: 'Your Organization',
    3: "You're all set!",
  };

  const descriptions: Record<Step, string> = {
    1: "Let's personalise your account. What should we call you?",
    2: 'Tell us about your organization so we can set up your workspace.',
    3: 'Review your details, then launch your dashboard.',
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-0">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${
                      done
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : active
                        ? 'border-blue-600 bg-white text-blue-600'
                        : 'border-slate-200 bg-white text-slate-400'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="h-4.5 w-4.5" aria-hidden="true" />
                    ) : (
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      active ? 'text-blue-600' : done ? 'text-slate-600' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`mx-2 mb-5 h-px w-12 transition-colors ${
                      step > s.id ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <Card className="shadow-xl shadow-slate-200/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">{titles[step]}</CardTitle>
            <CardDescription>{descriptions[step]}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {error === 'CSRF token missing' ? (
                    <>
                      {error} —{' '}
                      <button
                        onClick={() => (window.location.href = '/logout')}
                        className="underline"
                      >
                        log out and back in
                      </button>{' '}
                      to refresh your session.
                    </>
                  ) : (
                    error
                  )}
                </span>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Your full name</Label>
                <Input
                  id="name"
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && next()}
                  autoFocus
                  className="h-10"
                />
              </div>
            )}

            {step === 2 && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="orgName">Organization name</Label>
                  <Input
                    id="orgName"
                    placeholder="Acme Corp"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    autoFocus
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="orgEmail">Organization email</Label>
                  <Input
                    id="orgEmail"
                    type="email"
                    placeholder="admin@acme.com"
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && next()}
                    className="h-10"
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <div className="divide-y rounded-xl border border-slate-200 text-sm">
                {[
                  { label: 'Your name', value: name, icon: User },
                  { label: 'Organization', value: orgName, icon: Building2 },
                  { label: 'Org email', value: orgEmail, icon: Building2 },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {label}
                    </span>
                    <span className="font-medium text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  disabled={isPending}
                  className="px-5"
                >
                  Back
                </Button>
              )}
              <Button className="flex-1 gap-2" onClick={next} disabled={isPending}>
                {step === 3 ? (
                  isPending ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Setting up…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Launch Dashboard
                    </>
                  )
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
