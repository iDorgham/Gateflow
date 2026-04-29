'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@gate-access/ui';
import { 
  Slack, 
  Zap, 
  MessageSquare, 
  Database, 
  Globe, 
  Bot, 
  ShieldCheck, 
  ExternalLink,
  Plus,
  Blocks,
  Info
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function IntegrationsTab() {
  const { t } = useTranslation('dashboard');

  const INTEGRATIONS = [
    {
      id: 'slack',
      name: 'Slack',
      description: 'Stream scan alerts and daily gate summaries to your Slack channels.',
      icon: Slack,
      category: 'Messaging',
      status: 'Connected',
      accent: 'emerald'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect GateFlow with 5,000+ apps to automate your entire security workflow.',
      icon: Zap,
      category: 'Automation',
      status: 'Connect',
      accent: 'orange'
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Receive real-time notifications and gate check-in logs directly in Discord.',
      icon: MessageSquare,
      category: 'Messaging',
      status: 'Connect',
      accent: 'indigo'
    },
    {
      id: 'airtable',
      name: 'Airtable',
      description: 'Automatically sync guest logs and QR code data to your Airtable bases.',
      icon: Database,
      category: 'Database',
      status: 'Connect',
      accent: 'blue'
    },
    {
      id: 'webhooks-pro',
      name: 'Webhooks Pro',
      description: 'Advanced payload signing and retry logic for enterprise-grade integrations.',
      icon: Globe,
      category: 'Developer',
      status: 'Active',
      accent: 'violet'
    },
    {
      id: 'ai-security',
      name: 'AI Analytics',
      description: 'Leverage machine learning to detect anomalous access patterns and potential leaks.',
      icon: Bot,
      category: 'Security',
      status: 'Coming Soon',
      accent: 'slate'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-border/50">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-primary/5">
                <Blocks className="h-10 w-10 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">{t('settings.integrations.title', 'Ecosystem & Extensions')}</h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                {t('settings.integrations.description', 'Extend the capabilities of GateFlow by connecting to external services.')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="w-full sm:w-auto gap-2 rounded-xl border-border border-2 font-bold uppercase tracking-widest text-[10px] h-11 px-6 shadow-sm">
            <ExternalLink className="h-4 w-4" />
            {t('settings.integrations.apiDocumentation', 'API Documentation')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INTEGRATIONS.map((app) => {
          const Icon = app.icon;
          const isConnected = app.status === 'Connected' || app.status === 'Active';
          const isComingSoon = app.status === 'Coming Soon';

          return (
            <Card key={app.id} className="group relative flex flex-col rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:border-primary/20 overflow-hidden">
              <CardHeader className="pb-4 pt-6 px-6">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110",
                    isConnected ? "bg-primary/5 border-primary/20 text-primary" : "bg-muted border-border text-muted-foreground/40"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="rounded-full px-2 py-0 text-[10px] font-bold uppercase tracking-widest border-border text-muted-foreground/60 bg-muted/5">
                    {app.category}
                  </Badge>
                </div>
                <div className="mt-4 space-y-1">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2 uppercase tracking-tight">
                    {app.name}
                    {isConnected && <ShieldCheck className="h-3.5 w-3.5 text-primary" />}
                  </CardTitle>
                  <CardDescription className="text-[11px] leading-relaxed line-clamp-2">
                    {app.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-2 flex-grow flex items-end">
                <Button 
                  variant={isConnected ? "outline" : "default"} 
                  disabled={isComingSoon}
                  className={cn(
                    "w-full rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 transition-all",
                    isConnected 
                      ? "border-primary/20 text-primary hover:bg-primary/5" 
                      : isComingSoon 
                        ? "bg-muted text-muted-foreground/40 border-none"
                        : "bg-primary shadow-lg shadow-primary/10 hover:shadow-primary/20"
                  )}
                >
                  {isComingSoon ? t('common.comingSoon', 'Coming Soon') : isConnected ? t('common.manage', 'Manage') : t('common.connect', 'Connect')}
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {/* Custom Integration Placeholder */}
        <button className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-8 transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-border shadow-sm group-hover:scale-110 group-hover:shadow-primary/10 transition-all">
            <Plus className="h-6 w-6 text-muted-foreground/30 group-hover:text-primary transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 group-hover:text-primary transition-colors">{t('settings.integrations.requestBridge', 'Request Bridge')}</p>
            <p className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-tighter mt-1">{t('settings.integrations.bespokeDesc', 'Need a bespoke connection?')}</p>
          </div>
        </button>
      </div>
    </div>
  );
}
