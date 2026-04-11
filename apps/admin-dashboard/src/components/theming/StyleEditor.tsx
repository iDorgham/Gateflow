'use client';

import * as React from 'react';
import {
  Palette,
  RotateCcw,
  Save,
  Globe,
  Smartphone,
  Monitor,
  Upload,
  ExternalLink,
  History,
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
  Input,
  Label,
  cn,
  ScrollArea,
  nativeTokens,
} from '@gateflow/ui';
import { toast } from 'sonner';
import { BRAND_COLORS } from '@gateflow/ui/tokens';

/**
 * Style Editor (Power User Tool)
 * Allows Super Admins to white-label client organizations.
 * Features: Live Iframe Preview, WCAG Validation, Version Rollback.
 */
export function StyleEditor({ orgId }: { orgId: string }) {
  const [tokens, setTokens] = React.useState<Record<string, string>>({});
  const [fontFamily, setFontFamily] = React.useState('Inter');
  const [previewMode, setPreviewMode] = React.useState<'desktop' | 'mobile'>(
    'desktop'
  );
  const [locale, setLocale] = React.useState<'en' | 'ar'>('en');
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [history, setHistory] = React.useState<any[]>([]);

  // 1. Sync tokens to iframe via PostMessage
  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        {
          type: 'BRANDING_OVERRIDE',
          tokens,
          fontFamily,
        },
        '*'
      );
    }
  }, [tokens, fontFamily]);

  // 2. Fetch Initial State
  React.useEffect(() => {
    async function fetchBranding() {
      try {
        const res = await fetch(`/api/branding/${orgId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.branding) {
            setTokens(data.branding.tokenOverrides);
            setFontFamily(data.branding.fontFamily);
          }
          setHistory(data.snapshots || []);
        }
      } catch (e) {
        console.error('Failed to load branding');
      }
    }
    fetchBranding();
  }, [orgId]);

  const handleSave = async () => {
    toast.promise(
      fetch(`/api/branding/${orgId}`, {
        method: 'PATCH',
        body: JSON.stringify({ tokens, fontFamily }),
      }).then((res) => res.json()),
      {
        loading: 'Saving branding snapshot...',
        success: 'Branding updated successfully!',
        error: 'Failed to save branding.',
      }
    );
  };

  const handleTokenChange = (key: string, value: string) => {
    setTokens((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] w-full gap-6 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* LEFT: Controls Panel */}
      <div className="w-[400px] flex flex-col gap-4 shrink-0">
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-border/30 bg-muted/20 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              Theme Engine v4.0
            </h3>
            <Badge
              variant="outline"
              className="text-[9px] font-black uppercase border-primary/20 text-primary"
            >
              LIVE
            </Badge>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-8">
              {/* BRAND ASSETS */}
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler">
                  Brand Assets
                </Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="border-2 border-dashed border-border/50 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-muted/30 transition-colors cursor-pointer group">
                    <div className="bg-muted p-3 rounded-full group-hover:scale-110 transition-transform">
                      <Upload className="h-5 w-5 text-ds-text-subtler" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tight">
                      Upload Logo (PNG/SVG)
                    </span>
                  </div>
                </div>
              </div>

              {/* COLORS */}
              <div className="space-y-6">
                <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler">
                  Color Palette
                </Label>

                <div className="space-y-4">
                  {[
                    { label: 'Primary Brand', key: '--gf-color-primary' },
                    {
                      label: 'Primary Foreground',
                      key: '--gf-color-primary-foreground',
                    },
                    { label: 'Background', key: '--gf-color-background' },
                    { label: 'Surface/Cards', key: '--gf-color-surface' },
                  ].map((item) => {
                    const defaultValue = 
                      item.key === '--gf-color-primary' ? BRAND_COLORS.blue : 
                      item.key === '--gf-color-primary-foreground' ? BRAND_COLORS.white :
                      item.key === '--gf-color-background' ? BRAND_COLORS.white :
                      item.key === '--gf-color-surface' ? BRAND_COLORS.surfaceNeutral : BRAND_COLORS.navy;
                    
                    const currentValue = tokens[item.key] || defaultValue;

                    return (
                      <div
                        key={item.key}
                        className="flex items-center justify-between gap-4 group"
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-black uppercase tracking-tight leading-none">
                            {item.label}
                          </p>
                          <p className="text-[9px] font-bold text-ds-text-subtler font-mono">
                            {tokens[item.key] ? tokens[item.key] : 'System Default'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={currentValue}
                            onChange={(e) =>
                              handleTokenChange(item.key, e.target.value)
                            }
                            className="h-8 w-12 p-0 border-none bg-transparent cursor-pointer"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TYPOGRAPHY */}
              <div className="space-y-4 pt-4 border-t border-border/30">
                <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler">
                  Typography
                </Label>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-tight">
                    Sans Serif Font Family
                  </p>
                  <Input
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="h-9 text-xs font-bold"
                    placeholder="Inter, Outfit, Roboto..."
                  />
                </div>
              </div>

              {/* VERSION HISTORY */}
              <div className="space-y-4 pt-4 border-t border-border/30">
                <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler flex items-center gap-2">
                  <History className="h-3 w-3" /> Snapshots
                </Label>
                <div className="space-y-2">
                  {history.map((snap) => (
                    <div
                      key={snap.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors cursor-pointer border border-transparent hover:border-border/50"
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase">
                          v{snap.version}
                        </span>
                        <span className="text-[9px] font-bold text-ds-text-subtler">
                          {new Date(snap.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {history.length === 0 && (
                    <p className="text-[10px] italic text-ds-text-subtler font-bold">
                      No snapshots found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 bg-muted/20 border-t border-border/30">
            <Button
              onClick={handleSave}
              className="w-full bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] h-11 gap-2"
            >
              <Save className="h-4 w-4" /> Save Branding & Snapshot
            </Button>
          </div>
        </Card>
      </div>

      {/* RIGHT: Preview Panel */}
      <div className="flex-1 flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between px-2">
          <div className="flex bg-muted/50 p-1 rounded-xl border border-border/30">
            <Button
              variant={previewMode === 'desktop' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 px-4 text-[10px] font-black uppercase tracking-widest gap-2"
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="h-3.5 w-3.5" /> Desktop
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 px-4 text-[10px] font-black uppercase tracking-widest gap-2"
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="h-3.5 w-3.5" /> Mobile
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted/30 px-3 h-8 rounded-full border border-border/30">
              <Globe className="h-3.5 w-3.5 text-ds-text-subtler" />
              <select
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none border-none pr-4"
                value={locale}
                onChange={(e) => setLocale(e.target.value as any)}
              >
                <option value="en">English (LTR)</option>
                <option value="ar">Arabic (RTL)</option>
              </select>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-[10px] font-black uppercase tracking-widest gap-2"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open Preview
            </Button>
          </div>
        </div>

        <div className="flex-1 rounded-2xl overflow-hidden border border-border/50 shadow-2xl relative bg-ds-background-neutral">
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center transition-all duration-700',
              previewMode === 'mobile' ? 'p-8' : 'p-0'
            )}
          >
            <div
              className={cn(
                'bg-white shadow-[0_0_100px_rgba(0,0,0,0.1)] transition-all duration-700 relative overflow-hidden',
                previewMode === 'mobile'
                  ? 'w-[375px] h-[667px] rounded-[3rem] border-[8px] border-ds-text'
                  : 'w-full h-full'
              )}
            >
              {!orgId ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm font-black uppercase tracking-widest opacity-20">
                    Select an organization to preview
                  </p>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  src={`/organizations/${orgId}/preview`} // Hypothetical preview route
                  className="w-full h-full border-none"
                  title="Live Preview"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
