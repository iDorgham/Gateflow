'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import {
  ShieldCheck,
  Palette,
  LayoutTemplate,
  Info,
  Laptop,
  Monitor,
  Mail,
  Lock,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { cn } from '@gateflow/ui/utils';
import { Button, Input, Label, Badge } from '@gateflow/ui';

const authPrinciples = [
  {
    title: 'Tenant-Bound Accents',
    description:
      'Auth pages are primary brand touchpoints. They automatically inherit the Tenant Profile (Kimchi/Cobalt/Emerald) to provide instant visual verification.',
    icon: Palette,
  },
  {
    title: 'Cine-Entrance Protocol',
    description:
      'Auth forms use staggered sequence animation (0.05s delay per field) to create a premium, orchestrated experience for users.',
    icon: LayoutTemplate,
  },
  {
    title: 'Visual Security Proof',
    description:
      'Authentication succeeds with the "Institutional Green" bloom effect, providing a positive physiological feedback loop for secure access.',
    icon: ShieldCheck,
  },
];

export default function AuthBrandingPatternsPage() {
  const [profile, setProfile] = React.useState('kimchi');

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto py-10 px-6">
      <PageHeader
        title="Auth & Tenant Branding"
        subtitle="Gateway patterns that establish trust, security, and institutional identity from the very first interaction."
        breadcrumbs={[
          { label: 'Patterns', href: '/patterns' },
          { label: 'Auth & Branding' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {authPrinciples.map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-4 p-6 rounded-2xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-2 w-fit rounded-lg bg-[var(--ds-background-brand-bold)] text-white shadow-lg transition-transform group-hover:rotate-6">
              <p.icon size={22} strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--ds-text-primary)]">
              {p.title}
            </h3>
            <p className="text-xs text-[var(--ds-text-subtle)] leading-relaxed font-medium">
              {p.description}
            </p>
          </div>
        ))}
      </section>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
            Auth Profile Switcher
          </h2>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-60">
            Switch the tenant profile to see how the login experience adapts its
            institutional accent.
          </p>
        </div>

        <AuthProfileLab profile={profile} onProfileChange={setProfile} />
      </div>

      <section className="p-8 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] relative overflow-hidden group">
        <div className="absolute top-2 right-2 p-2 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-all duration-700">
          <Globe size={120} className="text-[var(--ds-primary-accent)]" />
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="p-2 w-fit rounded-lg bg-[var(--ds-background-brand-bold)] text-white shadow-md">
            <div className="p-2 w-fit rounded-lg bg-[var(--ds-background-brand-bold)] text-white shadow-md">
              <Info size={18} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              The &quot;Satin-Charcoal&quot; Guard
            </h4>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-medium">
              Regardless of the tenant accent, auth pages always maintain the{' '}
              <strong>Satin-Charcoal</strong> base (--gf-color-neutral-10). This
              creates a consistent &quot;GateFlow Guardian&quot; feel across the
              entire monorepo, reinforcing professional security standards.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function AuthProfileLab({
  profile,
  onProfileChange,
}: {
  profile: string;
  onProfileChange: (p: string) => void;
}) {
  const getProfileColors = (p: string) => {
    switch (p) {
      case 'kimchi':
        return { accent: 'oklch(62% 0.22 35)', label: 'Kimchi Energy' };
      case 'cobalt':
        return { accent: 'oklch(50% 0.18 250)', label: 'Cobalt Finance' };
      case 'emerald':
        return { accent: 'oklch(65% 0.15 155)', label: 'Emerald Health' };
      default:
        return { accent: 'oklch(62% 0.22 35)', label: 'Kimchi Energy' };
    }
  };

  const colors = getProfileColors(profile);

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex gap-3 justify-center">
        {['kimchi', 'cobalt', 'emerald'].map((p) => (
          <Button
            key={p}
            onClick={() => onProfileChange(p)}
            variant={profile === p ? 'default' : 'outline'}
            className={cn(
              'rounded-full px-6 h-10 text-[9px] font-black uppercase tracking-widest gap-2 transition-all',
              profile === p
                ? 'bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)] border-[var(--ds-border-brand)] ring-1'
                : 'bg-transparent border-[var(--ds-border-subtle)]'
            )}
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: getProfileColors(p).accent }}
            />
            {getProfileColors(p).label}
          </Button>
        ))}
      </div>

      <div className="w-full max-w-4xl mx-auto rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-background-default)] shadow-2xl p-1 relative overflow-hidden h-[600px] flex group">
        {/* Mock OS Frame */}
        <div className="flex-1 rounded-[22px] overflow-hidden bg-background flex flex-col shadow-inner border border-white/5">
          <div className="h-8 bg-[var(--ds-surface-subtle)] flex items-center px-4 gap-1.5 border-b border-black/20">
            <div className="h-2 w-2 rounded-full bg-red-500/20" />
            <div className="h-2 w-2 rounded-full bg-yellow-500/20" />
            <div className="h-2 w-2 rounded-full bg-green-500/20" />
          </div>

          {/* Auth Content Mock */}
          <div
            className="flex-1 flex"
            style={{ '--current-accent': colors.accent } as React.CSSProperties}
          >
            {/* Visual Left Side */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[var(--ds-surface-subtle)] border-e border-black/20 p-12 flex-col justify-between">
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage: 'var(--gf-pattern-sentinel)',
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-[var(--current-accent)]/10 to-transparent" />

              <div className="flex items-center gap-2 group cursor-pointer relative z-10">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[var(--current-accent)] text-white shadow-xl transition-all group-hover:scale-105">
                  <ShieldCheck size={24} />
                </div>
                <span className="text-2xl font-black tracking-tight text-white">
                  GateFlow
                </span>
              </div>

              <div className="relative z-10 flex flex-col gap-4">
                <Badge className="w-fit bg-[var(--current-accent)]/20 text-[var(--current-accent)] border-[var(--current-accent)]/40 rounded-full font-black text-[9px] uppercase tracking-widest px-3">
                  {colors.label} ACTIVE
                </Badge>
                <h2 className="text-3xl font-black tracking-tighter text-white leading-none">
                  Institutional Security,
                  <br />
                  Refined.
                </h2>
                <p className="text-sm font-medium text-[var(--ds-text-subtle)] max-w-sm">
                  Secure access for enterprise tenants utilizing advanced OKLCH
                  biometric logic.
                </p>
              </div>

              <div className="relative z-10 flex gap-6 opacity-40">
                <Monitor size={16} className="text-white" />
                <Laptop size={16} className="text-white" />
                <Globe size={16} className="text-white" />
              </div>
            </div>

            {/* Form Right Side */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[var(--ds-background-default)]">
              <div className="w-full max-w-xs flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">
                    Welcome Back
                  </h3>
                  <p className="text-[10px] font-bold text-[var(--ds-text-subtle)] uppercase tracking-widest">
                    Sign in to your secure workspace
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--ds-text-subtlest)]">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ds-text-subtlest)]" />
                      <Input
                        defaultValue="admin@tenant.corp"
                        className="bg-[var(--ds-surface-subtle)] border-white/5 pl-10 h-12 focus-visible:ring-[var(--current-accent)] text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--ds-text-subtlest)]">
                      Security Key
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ds-text-subtlest)]" />
                      <Input
                        type="password"
                        defaultValue="********"
                        className="bg-[var(--ds-surface-subtle)] border-white/5 pl-10 h-12 focus-visible:ring-[var(--current-accent)]"
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full h-12 bg-[var(--current-accent)] text-white font-black uppercase tracking-widest text-[10px] shadow-[var(--current-accent)]/20 gap-2 group rounded-xl">
                  Initialize Session
                  <ChevronRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>

                <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ds-text-subtlest)]">
                    Advanced Guardian Protection Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
