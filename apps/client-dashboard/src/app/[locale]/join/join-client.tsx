'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { acceptInvitation } from './actions';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  LoginShell,
  cn,
} from '@gate-access/ui';
import {
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Building,
} from 'lucide-react';
import { toast } from 'sonner';

interface JoinClientProps {
  token: string;
  email: string;
  orgName: string;
  locale: string;
}

export function JoinClient({ token, email, orgName, locale }: JoinClientProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isRtl = locale === 'ar-EG';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const res = await acceptInvitation({ token, name, password });
    if (res.success) {
      setIsSuccess(true);
      toast.success('Joined team successfully!');
      setTimeout(() => {
        router.push(`/${locale}/dashboard`);
      }, 2000);
    } else {
      setError(res.error || 'Failed to join team.');
      setIsPending(false);
    }
  };

  return (
    <LoginShell
      variant="client"
      appName="GateFlow"
      heading="Welcome to GateFlow"
      subtitle={`You've been invited to join ${orgName}. Finish setting up your account to get started.`}
      isSuccess={isSuccess}
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

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-4 mb-2">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Team</span>
                  <span className="text-sm font-bold text-foreground">{orgName}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-[#42526E] dark:text-[#97A0AF]">
                  Email Address
                </Label>
                <Input
                  value={email}
                  disabled
                  className="h-10 bg-muted/50 border-border opacity-70 grayscale"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="join-name" className="text-xs font-semibold text-[#42526E] dark:text-[#97A0AF]">
                  Your Full Name
                </Label>
                <Input
                  id="join-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Miller"
                  required
                  className="h-10 focus:ring-0 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="join-password" className="text-xs font-semibold text-[#42526E] dark:text-[#97A0AF]">
                  Set Password
                </Label>
                <div className="relative">
                  <Input
                    id="join-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 characters"
                    required
                    className={cn(
                      'h-10 focus:ring-0 focus:border-primary',
                      isRtl ? 'pl-10 pr-3' : 'pr-10 pl-3'
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

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 font-bold text-xs uppercase tracking-widest transition-all duration-200 gap-2"
              variant="default"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Accept Invitation & Join
                  <ArrowRight className={cn('h-4 w-4', isRtl && 'rotate-180')} />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </LoginShell>
  );
}
