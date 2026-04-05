'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Zap,
  RefreshCcw,
  Settings2,
  AlertCircle,
  Activity,
  Database,
  Key,
  Globe,
  Smartphone,
  Monitor,
  Server,
  Fingerprint,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Switch,
  Label,
  cn,
  Separator,
  RadioGroup,
  RadioGroupItem,
} from '@gateflow/ui';
import { toast } from 'sonner';

/**
 * Platform Hardening & Resilience Controls
 * Administrative cockpit for API rate limiting, cache TTL, and Auth session security.
 */
export function HardeningSettings() {
  const [rateLimit, setRateLimit] = React.useState([60]);
  const [activeProfiles, setActiveProfiles] = React.useState(['STRICT']);

  const handleApplyHardening = () => {
    toast.success(
      'Platform hardening profiles applied across global edge locations.',
      {
        description: 'Cache revalidated on 124 routes. Rate limits active.',
        icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />,
      }
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] w-full gap-8 animate-in fade-in slide-in-from-right-4 duration-1000 overflow-y-auto pr-4 pb-12">
      {/* HEADER: GLOBAL OPS STATUS */}
      <div className="flex items-center justify-between bg-emerald-500/5 p-6 border border-emerald-500/20 rounded-3xl shadow-sm shrink-0">
        <div className="flex items-center gap-6">
          <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-xl shadow-emerald-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black uppercase tracking-tighter text-emerald-500">
              Security Resilience Cockpit
            </h1>
            <p className="text-[10px] font-bold text-emerald-500 opacity-70">
              Global Firewall & Edge Configuration Active (202 nodes • All
              Regions Green)
            </p>
          </div>
        </div>
        <Button
          className="h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] px-10 rounded-2xl shadow-lg shadow-emerald-500/20"
          onClick={handleApplyHardening}
        >
          Force Deployment
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* API RATE LIMITING PANEL */}
          <Card className="border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden border-l-4 border-l-primary">
            <CardHeader className="pb-8 border-b border-border/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                  <Zap className="h-4 w-4 text-primary" /> API Rate Limit
                  Hardening
                </CardTitle>
                <Switch defaultChecked />
              </div>
              <CardDescription className="text-[10px] font-bold text-ds-text-subtle pt-2">
                Prevent brute-force and scraping across core endpoints via
                Edge-based limiting.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              <div className="space-y-6">
                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-ds-text-subtler">
                  <span>Marketing & Public Routes (CMS)</span>
                  <Badge
                    variant="secondary"
                    className="h-6 px-4 bg-muted text-[10px]"
                  >
                    {rateLimit[0]} REQ / MIN
                  </Badge>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={rateLimit[0]}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  onChange={(e) => setRateLimit([parseInt(e.target.value)])}
                />
                <p className="text-[9px] font-bold text-ds-text-subtler opacity-60 leading-relaxed uppercase">
                  Current: Very strict. Blocks 99% of bots while allowing normal
                  human navigation.
                </p>
              </div>

              <Separator className="bg-border/20" />

              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtler">
                    Admin API Access
                  </Label>
                  <RadioGroup defaultValue="strict" className="gap-3">
                    <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/30">
                      <RadioGroupItem value="strict" id="r1" />
                      <Label
                        htmlFor="r1"
                        className="text-[10px] font-bold uppercase cursor-pointer"
                      >
                        Strict (40/min)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/30">
                      <RadioGroupItem value="relaxed" id="r2" />
                      <Label
                        htmlFor="r2"
                        className="text-[10px] font-bold uppercase cursor-pointer"
                      >
                        Standard (200/min)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtler">
                    Cache Strategy
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-14 font-black uppercase tracking-tighter text-[10px] rounded-2xl flex-col gap-1 items-start px-4 active:scale-95 transition-all"
                    >
                      <RefreshCcw className="h-3.5 w-3.5 opacity-50 mb-1" />{' '}
                      Force ISR
                    </Button>
                    <Button
                      variant="outline"
                      className="h-14 font-black uppercase tracking-tighter text-[10px] rounded-2xl flex-col gap-1 items-start px-4 active:scale-95 transition-all"
                    >
                      <Database className="h-3.5 w-3.5 opacity-50 mb-1" /> Purge
                      DB
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* IDENTITY & SESSIONS */}
          <Card className="border-border/40 bg-card/40 backdrop-blur-sm border-l-4 border-l-amber-500">
            <CardHeader className="pb-8">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                <Lock className="h-4 w-4 text-amber-500" /> Identity Retention &
                Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-3 p-6 bg-muted/20 rounded-3xl border border-border/30 hover:border-amber-500/30 transition-all group">
                  <p className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler opacity-70">
                    Session TTL
                  </p>
                  <h4 className="text-3xl font-black uppercase tracking-tighter text-ds-text group-hover:text-amber-500 transition-colors">
                    1H
                  </h4>
                  <p className="text-[9px] font-bold text-ds-text-subtler uppercase">
                    High Security
                  </p>
                </div>
                <div className="space-y-3 p-6 bg-muted/20 rounded-3xl border border-border/30 hover:border-amber-500/30 transition-all group">
                  <p className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler opacity-70">
                    Log Retention
                  </p>
                  <h4 className="text-3xl font-black uppercase tracking-tighter text-ds-text group-hover:text-amber-500 transition-colors">
                    7Y
                  </h4>
                  <p className="text-[9px] font-bold text-ds-text-subtler uppercase">
                    Legal Standard
                  </p>
                </div>
                <div className="space-y-3 p-6 bg-muted/20 rounded-3xl border border-border/30 hover:border-amber-500/30 transition-all group">
                  <p className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler opacity-70">
                    Identity Scrub
                  </p>
                  <h4 className="text-3xl font-black uppercase tracking-tighter text-ds-text group-hover:text-amber-500 transition-colors">
                    30D
                  </h4>
                  <p className="text-[9px] font-bold text-ds-text-subtler uppercase">
                    PII Anonymization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SIDEPANEL: STATUS GAUGE */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <Card className="border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden border-r-4 border-r-emerald-500">
            <CardContent className="p-8 space-y-12 text-center flex flex-col items-center">
              <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500">
                Security Score v7
              </Label>

              {/* CSS GAUGE STUB */}
              <div className="h-40 w-40 rounded-full border-[12px] border-emerald-500/10 border-t-emerald-500 flex flex-col items-center justify-center relative shadow-2xl shadow-emerald-500/10 animate-pulse">
                <span className="text-4xl font-black tracking-tighter text-ds-text">
                  98%
                </span>
                <span className="text-[10px] font-black uppercase text-emerald-500">
                  HARDENED
                </span>
              </div>

              <div className="space-y-6 w-full pt-4">
                {[
                  { label: 'Cloudflare WAF', status: 'ACTIVE', icon: Globe },
                  { label: 'RBAC Enforcement', status: 'ENFORCED', icon: Key },
                  { label: 'TLS v1.3 Only', status: 'STRICT', icon: Server },
                  {
                    label: 'Biometric Root',
                    status: 'WAITING',
                    icon: Fingerprint,
                    delay: true,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-ds-text-subtler opacity-40" />
                      <span className="text-[11px] font-bold text-ds-text-subtle uppercase">
                        {item.label}
                      </span>
                    </div>
                    <Badge
                      className={cn(
                        'text-[8px] font-black uppercase tracking-widest',
                        item.delay
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-emerald-500/10 text-emerald-500'
                      )}
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>

              <Separator className="bg-border/20 pt-4" />

              <div className="w-full space-y-3 py-4">
                <div className="flex items-center gap-2 text-rose-500 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-[10px] font-black uppercase tracking-tight">
                    Active Warning (1)
                  </p>
                </div>
                <p className="text-[9px] font-bold text-ds-text-subtler leading-relaxed uppercase text-left">
                  Rate limit bursts detected in Asia/Riyadh region. Edge
                  firewall successfully throttled. No impact observed.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-primary/5 shadow-none border-r-4 border-r-primary">
            <CardContent className="p-6 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> Multi-Tenant Drift
              </h4>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-ds-text-subtle opacity-70">
                  12 organizations are using custom session TTL profiles. Drift
                  is within acceptable compliance boundaries.
                </p>
              </div>
              <Button
                variant="ghost"
                className="w-full h-10 font-black uppercase tracking-widest text-[9px] gap-2"
              >
                Auditing Drift Detail <ChevronRightIcon className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
