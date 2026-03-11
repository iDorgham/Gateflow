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
import { Mail, MessageSquare, Smartphone, Bell, ShieldAlert, QrCode, UserPlus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';
import type { NotificationConfig } from '@/lib/notifications/types';

interface NotificationPrefsFormProps {
  initialConfig: NotificationConfig;
}

export function NotificationPrefsForm({ initialConfig }: NotificationPrefsFormProps) {
  const [config, setConfig] = useState<NotificationConfig>(initialConfig);
  const [isDirty, setIsDirty] = useState(false);
  const [isPending, startTransition] = useTransition();

  const updateChannel = (key: keyof NotificationConfig['channels'], val: boolean) => {
    setConfig((prev) => ({ ...prev, channels: { ...prev.channels, [key]: val } }));
    setIsDirty(true);
  };

  const updateEvent = (key: keyof NotificationConfig['events'], val: boolean) => {
    setConfig((prev) => ({ ...prev, events: { ...prev.events, [key]: val } }));
    setIsDirty(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await csrfFetch('/api/notification-prefs', {
        method: 'PUT',
        body: JSON.stringify(config),
      });
      if (res.ok) {
        toast.success('Notification preferences saved');
        setIsDirty(false);
      } else {
        toast.error('Failed to save preferences');
      }
    });
  };

  const channels: { key: keyof NotificationConfig['channels']; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: 'email', label: 'Email', icon: <Mail className="h-4 w-4 text-blue-500" />, desc: 'Receive notifications via email' },
    { key: 'sms', label: 'SMS', icon: <MessageSquare className="h-4 w-4 text-green-500" />, desc: 'Text message alerts (carrier rates may apply)' },
    { key: 'push', label: 'Push Notifications', icon: <Smartphone className="h-4 w-4 text-purple-500" />, desc: 'In-browser and mobile app push alerts' },
  ];

  const events: { key: keyof NotificationConfig['events']; label: string; icon: React.ReactNode; desc: string; severity?: 'high' | 'medium' }[] = [
    { key: 'scanSuccess', label: 'Scan Approved', icon: <CheckCircle2 className="h-4 w-4 text-success" />, desc: 'Notify when a visitor is successfully admitted' },
    { key: 'scanFailed', label: 'Scan Denied', icon: <ShieldAlert className="h-4 w-4 text-destructive" />, desc: 'Alert when a scan attempt is rejected or invalid', severity: 'high' },
    { key: 'qrExpired', label: 'QR Expired', icon: <QrCode className="h-4 w-4 text-warning" />, desc: 'Notify when active QR codes reach their expiry', severity: 'medium' },
    { key: 'newMember', label: 'New Team Member', icon: <UserPlus className="h-4 w-4 text-primary" />, desc: 'Notify admins when a team invitation is accepted' },
    { key: 'systemAlerts', label: 'System Alerts', icon: <Bell className="h-4 w-4 text-orange-500" />, desc: 'Security advisories and platform maintenance notices', severity: 'high' },
  ];

  return (
    <div className="space-y-8">
      {/* Channels */}
      <Card className="rounded-2xl border-border shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-black uppercase tracking-tight">Delivery Channels</CardTitle>
          <CardDescription>Choose how you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {channels.map((ch) => (
            <div
              key={ch.key}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:border-primary/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-muted/60 flex items-center justify-center">
                  {ch.icon}
                </div>
                <div>
                  <Label className="text-sm font-bold cursor-pointer">{ch.label}</Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{ch.desc}</p>
                </div>
              </div>
              <Switch
                checked={config.channels[ch.key]}
                onCheckedChange={(val) => updateChannel(ch.key, val)}
                aria-label={`Enable ${ch.label} notifications`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Events */}
      <Card className="rounded-2xl border-border shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-black uppercase tracking-tight">Event Triggers</CardTitle>
          <CardDescription>Select which events generate notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {events.map((ev) => (
            <div
              key={ev.key}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:border-primary/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-muted/60 flex items-center justify-center">
                  {ev.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-bold cursor-pointer">{ev.label}</Label>
                    {ev.severity === 'high' && (
                      <Badge variant="outline" className="text-[9px] font-black uppercase bg-destructive/5 text-destructive border-destructive/20 py-0 px-1.5">
                        Critical
                      </Badge>
                    )}
                    {ev.severity === 'medium' && (
                      <Badge variant="outline" className="text-[9px] font-black uppercase bg-warning/5 text-warning border-warning/20 py-0 px-1.5">
                        Important
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{ev.desc}</p>
                </div>
              </div>
              <Switch
                checked={config.events[ev.key]}
                onCheckedChange={(val) => updateEvent(ev.key, val)}
                aria-label={`Enable ${ev.label} notifications`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isPending || !isDirty}
          className="h-11 px-8 rounded-xl font-black uppercase tracking-widest text-[11px]"
        >
          {isPending ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}
