'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Trash2,
  RefreshCw,
  Sliders,
  Clock,
  Lock,
  Globe,
  Loader2,
  Settings2,
} from 'lucide-react';
import { Button, Badge, Switch } from '@gateflow/ui';
import { toast } from 'sonner';

function Slider({
  value,
  onValueChange,
  onValueCommit,
  max,
  step,
  className,
}: {
  value: number[];
  onValueChange: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  max: number;
  step: number;
  className?: string;
}) {
  return (
    <input
      type="range"
      role="slider"
      min={0}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      onMouseUp={(e) => onValueCommit?.([Number(e.currentTarget.value)])}
      onTouchEnd={(e) => onValueCommit?.([Number(e.currentTarget.value)])}
      className={className}
    />
  );
}

export function HardeningPanel() {
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [rateLimit, setRateLimit] = useState([60]);
  const [ttl, setTtl] = useState([3600]);

  const handleAction = async (action: string, value?: any) => {
    if (action === 'REVALIDATE_ALL') setIsRevalidating(true);
    if (action === 'PURGE_CACHE') setIsPurging(true);

    try {
      const res = await fetch('/api/monitoring/hardening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, value }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Connection failed');
    } finally {
      setIsRevalidating(false);
      setIsPurging(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Infrastructure Maintenance */}
      <div className="bg-white p-8 rounded-[40px] border border-ds-border/40 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-black italic uppercase tracking-tighter text-lg">
              Live Maintenance
            </h3>
          </div>
          <Badge
            variant="outline"
            className="text-[9px] font-bold uppercase tracking-widest text-blue-600 border-blue-100 bg-blue-50"
          >
            Immortal Stack
          </Badge>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 bg-ds-background-neutral-subtle/40 rounded-3xl border border-ds-border/10 group hover:border-blue-500/30 transition-colors">
            <div className="space-y-1">
              <p className="text-sm font-bold">Global ISR Sync</p>
              <p className="text-[10px] text-ds-text-subtle font-medium uppercase tracking-widest">
                Rebuild all marketing tags
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 h-10 px-6 border-ds-border/60 hover:bg-blue-600 hover:text-white transition-all"
              onClick={() => handleAction('REVALIDATE_ALL')}
              disabled={isRevalidating}
            >
              {isRevalidating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Force Revalidate
            </Button>
          </div>

          <div className="flex items-center justify-between p-6 bg-ds-background-neutral-subtle/40 rounded-3xl border border-ds-border/10 group hover:border-red-500/30 transition-colors">
            <div className="space-y-1">
              <p className="text-sm font-bold">Edge Cache Purge</p>
              <p className="text-[10px] text-ds-text-subtle font-medium uppercase tracking-widest">
                Clear Vercel/Cloudflare caches
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 h-10 px-6 border-ds-border/60 hover:bg-red-600 hover:text-white transition-all"
              onClick={() => handleAction('PURGE_CACHE')}
              disabled={isPurging}
            >
              {isPurging ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Wipe Cache
            </Button>
          </div>
        </div>
      </div>

      {/* Threshold Controls */}
      <div className="bg-white p-8 rounded-[40px] border border-ds-border/40 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-black italic uppercase tracking-tighter text-lg">
              Hardening Profiles
            </h3>
          </div>
          <Badge className="bg-indigo-600 text-[8px] font-black uppercase tracking-widest">
            Level 4 Active
          </Badge>
        </div>

        <div className="space-y-10 py-2">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" /> Rate Limiting
                </p>
                <p className="text-xs font-bold">Global API Threshold</p>
              </div>
              <span className="font-black text-blue-600 text-sm italic">
                {rateLimit[0]} REQ/MIN
              </span>
            </div>
            <Slider
              value={rateLimit}
              onValueChange={setRateLimit}
              onValueCommit={(v) => handleAction('UPDATE_RATE_LIMIT', v[0])}
              max={500}
              step={10}
              className="[&_[role=slider]]:bg-blue-600"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Session TTL
                </p>
                <p className="text-xs font-bold">Auth Persistence Life</p>
              </div>
              <span className="font-black text-indigo-600 text-sm italic">
                {Math.floor(ttl[0] / 3600)} HOURS
              </span>
            </div>
            <Slider
              value={ttl}
              onValueChange={setTtl}
              max={86400}
              step={3600}
              className="[&_[role=slider]]:bg-indigo-600"
            />
          </div>

          <div className="pt-2 flex items-center justify-between p-4 bg-ds-background-neutral-subtle/40 rounded-2xl border border-ds-border/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-ds-border/10 shadow-sm">
                <Globe className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">
                Global DDOS Protection
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}
