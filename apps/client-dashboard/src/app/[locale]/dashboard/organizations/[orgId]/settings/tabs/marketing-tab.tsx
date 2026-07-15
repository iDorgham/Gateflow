'use client';

import { useState, useTransition } from 'react';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from '@gateflow/ui';
import { updateMarketingSettingsAction } from '../../workspace/settings/actions';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Target,
  Save,
  MousePointer2,
  ArrowRight,
  CheckCircle2,
  Users,
  Code2,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrgData {
  id: string;
  pixelMetaId?: string | null;
  pixelGtmId?: string | null;
}

export function MarketingTab({ org }: { org: OrgData }) {
  const { t } = useTranslation('dashboard');
  const [pixelMetaId, setPixelMetaId] = useState(org.pixelMetaId || '');
  const [pixelGtmId, setPixelGtmId] = useState(org.pixelGtmId || '');
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const res = await updateMarketingSettingsAction({
        pixelMetaId: pixelMetaId.trim() || null,
        pixelGtmId: pixelGtmId.trim() || null,
      });

      if (res.success) {
        toast.success(
          t(
            'settings.marketing.success.saved',
            'Marketing attribution parameters updated.'
          )
        );
      } else {
        toast.error(
          res.message || t('common.errors.generic', 'Operation failed.')
        );
      }
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border/50 mb-6">
            <div className="space-y-1">
              <h2 className="text-xl font-black tracking-tight text-foreground uppercase flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Marketing Attribution
              </h2>
              <p className="text-xs text-muted-foreground">
                Bridge digital marketing campaigns with physical gate arrival
                events.
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isPending}
              className="px-8 h-11 rounded-xl bg-primary shadow-lg shadow-primary/10 hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-widest gap-2"
            >
              {isPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {t('common.save', 'Save Configuration')}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="pb-4 pt-6 px-8 border-b border-border/50 bg-muted/5">
              <CardTitle className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                Retargeting & Conversion Pixels
              </CardTitle>
              <CardDescription className="text-xs">
                Configure tracking scripts to fire on visitor landing pages.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                    Meta Pixel ID
                  </Label>
                  <Input
                    value={pixelMetaId}
                    onChange={(e) => setPixelMetaId(e.target.value)}
                    placeholder="e.g. 1234567890123"
                    className="h-11 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20 font-bold"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Fires a &apos;PageView&apos; event on visitor landing pages.
                  </p>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                    Google Tag Manager ID
                  </Label>
                  <Input
                    value={pixelGtmId}
                    onChange={(e) => setPixelGtmId(e.target.value)}
                    placeholder="GTM-XXXXXXX"
                    className="h-11 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20 font-bold"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Injects GTM container for flexible event tracking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funnel Preview Illustration */}
          <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="pb-4 pt-6 px-8 border-b border-border/50 bg-muted/5">
              <CardTitle className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Attribution Flow Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 py-8">
                <div className="flex flex-col items-center gap-3 text-center z-10 w-full md:w-1/4">
                  <div className="h-14 w-14 rounded-2xl bg-[var(--ds-background-selected)] flex items-center justify-center text-primary shadow-sm border border-primary/10">
                    <MousePointer2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-tight">
                      Ad Click
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      Digital Intent
                    </p>
                  </div>
                </div>

                <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground/20" />

                <div className="flex flex-col items-center gap-3 text-center z-10 w-full md:w-1/4">
                  <div className="h-14 w-14 rounded-2xl bg-[var(--ds-background-neutral)] flex items-center justify-center text-[var(--ds-icon-brand)] shadow-sm border border-border">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-tight">
                      QR Generated
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      Session Sync
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[8px] font-black tracking-widest border-primary/20 text-primary uppercase bg-primary/5"
                  >
                    UTM Captured
                  </Badge>
                </div>

                <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground/20" />

                <div className="flex flex-col items-center gap-3 text-center z-10 w-full md:w-1/4">
                  <div className="h-14 w-14 rounded-2xl bg-[var(--ds-background-success-bold)] flex items-center justify-center text-white shadow-xl shadow-success/20 animate-pulse">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-tight text-success">
                      Arrival
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      Physical Event
                    </p>
                  </div>
                  <Badge className="bg-success text-white text-[8px] font-black tracking-widest uppercase">
                    Verified ROI
                  </Badge>
                </div>

                {/* Connecting line for mobile */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/50 md:hidden -translate-x-1/2 -z-10" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-2xl border border-primary/20 bg-primary/5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-black uppercase tracking-tight text-primary">
                  Conversion Logic
                </p>
                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                  How it works
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <p className="text-xs leading-relaxed text-primary/80 font-medium lowercase first-letter:uppercase">
                  When pixel IDs are set, GateFlow automatically injects the
                  official tracking scripts into every{' '}
                  <strong>visitor landing page</strong> for this workspace.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <p className="text-xs leading-relaxed text-primary/80 font-medium lowercase first-letter:uppercase">
                  UTM parameters are synchronized between the guest&apos;s
                  browser session and their physical QR record.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <p className="text-xs leading-relaxed text-primary/80 font-medium lowercase first-letter:uppercase">
                  Reporting on &quot;Cost per Arrival&quot; and Campaign
                  Performance will be available in the{' '}
                  <strong>Analytics Hub</strong>.
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full text-primary hover:bg-white/50 text-[10px] font-black uppercase tracking-widest border border-primary/10 bg-white/30"
            >
              Marketing Setup Guide
            </Button>
          </div>

          <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="p-6 pb-4 border-b border-border/50 bg-muted/5 font-black uppercase tracking-widest">
              <CardTitle className="text-[10px] font-bold text-muted-foreground/60">
                Ecosystem Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-muted-foreground/60">Pixel Engine</span>
                <span className="text-success flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-muted-foreground/60">
                  UTM Session Sync
                </span>
                <span className="text-success flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  Active
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
