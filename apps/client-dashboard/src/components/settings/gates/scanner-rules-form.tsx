'use client';

import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Switch,
  Label,
  Badge,
} from '@gate-access/ui';
import { Wifi, WifiOff, Volume2, Vibrate, ShieldCheck, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';

export interface ScannerConfig {
  offlineModeEnabled: boolean;
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  allowSupervisorOverride: boolean;
}

const DEFAULT_CONFIG: ScannerConfig = {
  offlineModeEnabled: true,
  vibrationEnabled: true,
  soundEnabled: true,
  allowSupervisorOverride: true,
};

interface ScannerRulesFormProps {
  initialConfig: ScannerConfig | null;
}

export function ScannerRulesForm({ initialConfig }: ScannerRulesFormProps) {
  const [config, setConfig] = useState<ScannerConfig>(initialConfig ?? DEFAULT_CONFIG);
  const [isDirty, setIsDirty] = useState(false);
  const [isPending, startTransition] = useTransition();

  const update = (key: keyof ScannerConfig, value: boolean) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await csrfFetch('/api/scanner-rules', {
        method: 'PUT',
        body: JSON.stringify(config),
      });
      if (res.ok) {
        toast.success('Scanner rules saved');
        setIsDirty(false);
      } else {
        toast.error('Failed to save scanner rules');
      }
    });
  };

  const rules: {
    key: keyof ScannerConfig;
    label: string;
    description: string;
    icon: React.ReactNode;
    isGlobal?: boolean;
  }[] = [
    {
      key: 'offlineModeEnabled',
      label: 'Offline Mode',
      description: 'Allow scanners to queue entries when network is unavailable. Syncs automatically when online.',
      icon: config.offlineModeEnabled ? (
        <Wifi className="h-5 w-5 text-success" />
      ) : (
        <WifiOff className="h-5 w-5 text-muted-foreground" />
      ),
    },
    {
      key: 'vibrationEnabled',
      label: 'Haptic Feedback',
      description: 'Scanners vibrate on successful or rejected scans for tactile confirmation.',
      icon: <Vibrate className="h-5 w-5 text-primary" />,
    },
    {
      key: 'soundEnabled',
      label: 'Audio Alerts',
      description: 'Scanners play a sound on scan events. Useful in noisy gate environments.',
      icon: <Volume2 className="h-5 w-5 text-primary" />,
    },
    {
      key: 'allowSupervisorOverride',
      label: 'Supervisor Override',
      description: 'Supervisors can force-approve a denied scan with PIN authentication and an audit log entry.',
      icon: <ShieldCheck className="h-5 w-5 text-warning" />,
      isGlobal: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-3 rounded-xl border border-primary/20 bg-primary/5 text-primary text-xs">
        <Settings2 className="h-4 w-4 shrink-0" />
        <p className="font-medium">
          These are <strong>global</strong> defaults. Individual scanner devices can override
          local preferences (haptics, sound) — but Offline Mode and Supervisor Override are
          enforced org-wide.
        </p>
      </div>

      <div className="grid gap-4">
        {rules.map((rule) => (
          <Card
            key={rule.key}
            className="rounded-2xl border-border hover:border-primary/20 transition-all"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
                    {rule.icon}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-black uppercase tracking-tight cursor-pointer">
                        {rule.label}
                      </Label>
                      {rule.isGlobal && (
                        <Badge
                          variant="outline"
                          className="text-[9px] font-black uppercase bg-warning/5 text-warning border-warning/20"
                        >
                          Enforced
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                      {rule.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={config[rule.key]}
                  onCheckedChange={(val) => update(rule.key, val)}
                  className="shrink-0 mt-1"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          disabled={isPending || !isDirty}
          className="h-11 px-8 rounded-xl font-black uppercase tracking-widest text-[11px] gap-2"
        >
          {isPending ? 'Saving...' : 'Save Rules'}
        </Button>
      </div>
    </div>
  );
}
