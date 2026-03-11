'use client';

import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Badge,
} from '@gate-access/ui';
import { Save, CheckCircle2, Globe, BarChart3, MessageSquare, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';

export interface IntegrationConfig {
  gtmId?: string | null;
  googleAnalyticsId?: string | null;
  hubspotPortalId?: string | null;
  facebookPixelId?: string | null;
}

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  fieldKey: keyof IntegrationConfig;
  placeholder: string;
  docsUrl?: string;
  value: string;
  onChange: (v: string) => void;
  isSaved?: boolean;
}

function IntegrationCard({
  title,
  description,
  icon,
  fieldKey,
  placeholder,
  value,
  onChange,
  isSaved,
}: IntegrationCardProps) {
  return (
    <Card className="rounded-2xl border-border hover:border-primary/20 transition-all overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="h-11 w-11 rounded-xl bg-muted/60 flex items-center justify-center">
            {icon}
          </div>
          {isSaved ? (
            <Badge className="bg-success/10 text-success border-success/20 text-[10px] font-black uppercase gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] font-black uppercase text-muted-foreground/50 border-dashed">
              Not connected
            </Badge>
          )}
        </div>
        <CardTitle className="text-sm font-black uppercase tracking-tight mt-3">{title}</CardTitle>
        <CardDescription className="text-xs leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <Label
            htmlFor={`int-${fieldKey}`}
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"
          >
            {title} ID
          </Label>
          <Input
            id={`int-${fieldKey}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-10 rounded-xl font-mono text-xs"
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface IntegrationCardsProps {
  initialConfig: IntegrationConfig;
  domain: string | null;
}

export function IntegrationCards({ initialConfig, domain }: IntegrationCardsProps) {
  const [config, setConfig] = useState<IntegrationConfig>(initialConfig);
  const [isDirty, setIsDirty] = useState(false);
  const [isPending, startTransition] = useTransition();

  const update = (key: keyof IntegrationConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value || null }));
    setIsDirty(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await csrfFetch('/api/integrations', {
        method: 'PUT',
        body: JSON.stringify(config),
      });
      if (res.ok) {
        toast.success('Integrations saved');
        setIsDirty(false);
      } else {
        toast.error('Failed to save integrations');
      }
    });
  };

  const integrations: Omit<IntegrationCardProps, 'value' | 'onChange' | 'isSaved'>[] = [
    {
      title: 'Google Tag Manager',
      description: 'Fire marketing events and conversion tracking tags via GTM containers.',
      icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
      fieldKey: 'gtmId',
      placeholder: 'GTM-XXXXXXX',
    },
    {
      title: 'Google Analytics',
      description: 'Track user engagement and scan events in your GA4 property.',
      icon: <BarChart3 className="h-5 w-5 text-orange-500" />,
      fieldKey: 'googleAnalyticsId',
      placeholder: 'G-XXXXXXXXXX',
    },
    {
      title: 'HubSpot CRM',
      description: 'Sync visitor and contact data with your HubSpot marketing portal.',
      icon: <MessageSquare className="h-5 w-5 text-orange-600" />,
      fieldKey: 'hubspotPortalId',
      placeholder: '12345678',
    },
    {
      title: 'Meta Pixel',
      description: 'Track conversions and retarget visitors via Facebook/Instagram ads.',
      icon: <Share2 className="h-5 w-5 text-blue-600" />,
      fieldKey: 'facebookPixelId',
      placeholder: '1234567890123456',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Integration Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-tight">Marketing Integrations</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Connect marketing platforms to track visitor journeys.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isPending || !isDirty}
            className="gap-2 rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[11px]"
          >
            <Save className="h-4 w-4" />
            {isPending ? 'Saving...' : 'Save All'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((int) => (
            <IntegrationCard
              key={int.fieldKey}
              {...int}
              value={config[int.fieldKey] ?? ''}
              onChange={(v) => update(int.fieldKey, v)}
              isSaved={!!(config[int.fieldKey])}
            />
          ))}
        </div>
      </div>

      {/* Custom Domain */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-black uppercase tracking-tight">Custom Domain</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Use your own domain for guest-facing QR landing pages and scanner redirects.
        </p>

        <div className="p-5 rounded-2xl border border-border bg-card/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-tight">Current Domain</p>
              <code className="text-sm font-mono text-foreground">
                {domain ?? 'Not configured'}
              </code>
            </div>
            {domain ? (
              <Badge className="bg-success/10 text-success border-success/20 text-[10px] font-black uppercase gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] font-black uppercase text-muted-foreground/50 border-dashed">
                Not set
              </Badge>
            )}
          </div>

          {!domain && (
            <div className="p-4 rounded-xl bg-muted/30 border border-border text-xs text-muted-foreground space-y-2">
              <p className="font-bold text-foreground">To use a custom domain:</p>
              <ol className="list-decimal list-inside space-y-1 leading-relaxed">
                <li>Set your domain in Workspace Settings.</li>
                <li>Add a CNAME record pointing to <code className="font-mono bg-muted px-1 py-0.5 rounded">gateway.gateflow.io</code>.</li>
                <li>DNS propagation typically takes 5–30 minutes.</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
