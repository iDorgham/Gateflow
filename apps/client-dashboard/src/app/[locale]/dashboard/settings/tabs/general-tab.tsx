'use client';

import React, { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Label,
  Select,
} from '@gate-access/ui';
import { 
  Monitor, 
  Moon, 
  Sun, 
  Languages, 
  Clock, 
  Palette,
  Save,
  Settings2,
  Info
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function GeneralTab() {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation('dashboard');
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      // simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success(t('settings.general.success.saved', 'General settings saved successfully.'));
    });
  }

  const THEMES = [
    { id: 'light', label: t('settings.general.themes.light', 'Light'), icon: Sun },
    { id: 'dark', label: t('settings.general.themes.dark', 'Dark'), icon: Moon },
    { id: 'system', label: t('settings.general.themes.system', 'System'), icon: Monitor },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-border/50">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-primary/5">
                <Settings2 className="h-10 w-10 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">{t('settings.general.title', 'General Settings')}</h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                {t('settings.general.description', 'Configure the base operational interface of the system.')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={handleSave} disabled={isPending} className="px-8 h-11 rounded-xl bg-primary shadow-lg shadow-primary/10 hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-widest gap-2">
            {isPending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save className="h-4 w-4" />}
            {t('common.save', 'Save')}
          </Button>
        </div>
      </div>

      {/* Visual Identity Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Palette className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">{t('settings.general.sections.appearance', 'Appearance & Interface')}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {THEMES.map((item) => {
            const Icon = item.icon;
            const isActive = theme === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTheme(item.id)}
                className={cn(
                  "relative flex flex-col items-center gap-4 p-6 rounded-2xl border transition-all duration-300 group",
                  isActive 
                    ? "border-primary bg-primary/5 ring-4 ring-primary/5 shadow-lg shadow-primary/5" 
                    : "border-border bg-card hover:border-primary/20 hover:bg-muted/30"
                )}
              >
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:scale-110"
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={cn(
                  "text-xs font-bold uppercase tracking-widest",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Localization Section */}
      <Card className="rounded-2xl border border-border shadow-sm overflow-hidden bg-card">
        <CardHeader className="pb-4 pt-6 px-8 border-b border-border/50 bg-muted/5">
          <CardTitle className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
            <Languages className="h-4 w-4 text-primary" />
            {t('settings.general.sections.localization', 'Regional & Language')}
          </CardTitle>
          <CardDescription className="text-xs">{t('settings.general.localizationDesc', 'Configure how dates, times, and languages are displayed.')}</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{t('settings.general.language', 'Preferred Language')}</Label>
              <div className="relative group">
                <Languages className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <Select 
                  defaultValue={i18n.language}
                  className="pl-11 h-11 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20"
                >
                  <option value="en-US">English (United States)</option>
                  <option value="ar-EG">العربية (Egypt)</option>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{t('settings.general.timezone', 'System Timezone')}</Label>
              <div className="relative group">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <Select 
                  defaultValue="UTC+2"
                  className="pl-11 h-11 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20"
                >
                  <option value="UTC">UTC (London)</option>
                  <option value="UTC+2">UTC+2 (Cairo)</option>
                  <option value="UTC+3">UTC+3 (Riyadh)</option>
                  <option value="UTC-5">UTC-5 (New York)</option>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
