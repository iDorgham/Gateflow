'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Separator,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  cn
} from '@gate-access/ui';
import { 
  Palette, 
  Eye, 
  Save, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  Smartphone, 
  Monitor, 
  Type, 
  Image as ImageIcon,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { validateContrast } from '@gate-access/utils/contrast';

interface BrandingData {
  tokenOverrides: Record<string, string>;
  fontFamily: string;
  fontFamilyArabic: string;
  logoUrl?: string;
}

interface StyleEditorProps {
  organizationId: string;
  initialBranding: BrandingData;
  clientDashboardUrl: string;
}

/**
 * Style Hub & Live Theming Engine
 * 
 * A professional design tool for white-labeling client dashboards.
 * Features real-time OKLCH-aware color editing, WCAG contrast auditing,
 * and live iframe preview via PostMessage.
 */
export function StyleEditor({ organizationId, initialBranding, clientDashboardUrl }: StyleEditorProps) {
  const [branding, setBranding] = useState<BrandingData>(initialBranding);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState('colors');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync with iframe on change
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'BRANDING_OVERRIDE',
        tokens: branding.tokenOverrides
      }, '*');
    }
  }, [branding]);

  const updateToken = (token: string, value: string) => {
    setBranding(prev => ({
      ...prev,
      tokenOverrides: {
        ...prev.tokenOverrides,
        [token]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/branding/${organizationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branding),
      });

      if (!res.ok) throw new Error('Failed to save branding');
      toast.success('Branding updated successfully. Snapshots created for rollback.');
    } catch (err) {
      toast.error('Failed to save branding overrides.');
    }
  };

  const primaryContrast = validateContrast(
    branding.tokenOverrides['--ds-background-brand-bold'] || 'var(--ds-background-information-bold)',
    'var(--ds-text-inverse)'
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
      {/* Left Panel: Controls */}
      <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <Palette className="h-6 w-6 text-ds-text-brand" />
            Style Hub
          </h1>
          <p className="text-ds-text-subtle text-xs">Configure organization-level branding overrides.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-ds-background-neutral-subtle/30 p-1">
            <TabsTrigger value="colors" className="flex-1 font-bold text-[10px] uppercase tracking-widest gap-2">
              <Palette className="h-3 w-3" /> Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex-1 font-bold text-[10px] uppercase tracking-widest gap-2">
              <Type className="h-3 w-3" /> Type
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex-1 font-bold text-[10px] uppercase tracking-widest gap-2">
              <ImageIcon className="h-3 w-3" /> Assets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="mt-6 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">Primary Brand Color</span>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[8px] font-black tracking-widest px-2 py-0.5",
                    primaryContrast.passesAA ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  )}
                >
                  {primaryContrast.passesAA ? '✅ WCAG AA PASSED' : '⚠️ LOW CONTRAST'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold">Brand Bold (Primary)</label>
                    <span className="text-[10px] font-mono text-ds-text-subtle">
                      {branding.tokenOverrides['--ds-background-brand-bold'] || 'var(--ds-background-information-bold)'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      className="w-12 h-10 p-1 cursor-pointer" 
                      value={branding.tokenOverrides['--ds-background-brand-bold'] || 'var(--ds-background-information-bold)'}
                      onChange={(e) => updateToken('--ds-background-brand-bold', e.target.value)}
                    />
                    <Input 
                      type="text" 
                      className="flex-1 font-mono text-xs" 
                      value={branding.tokenOverrides['--ds-background-brand-bold'] || 'var(--ds-background-information-bold)'}
                      onChange={(e) => updateToken('--ds-background-brand-bold', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2 opacity-60">
                  <label className="text-xs font-bold">Brand Subtle (Backgrounds)</label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      className="w-12 h-10 p-1 cursor-pointer" 
                      value={branding.tokenOverrides['--ds-background-brand-subtle'] || 'var(--ds-background-brand-subtle)'}
                      onChange={(e) => updateToken('--ds-background-brand-subtle', e.target.value)}
                    />
                    <Input 
                      type="text" 
                      className="flex-1 font-mono text-xs" 
                      value={branding.tokenOverrides['--ds-background-brand-subtle'] || 'var(--ds-background-brand-subtle)'}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">Surface & Background</span>
              <div className="p-4 rounded-xl border border-ds-border/30 bg-ds-background-neutral-subtle/20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Global Radius</span>
                  <Input 
                    type="range" min="0" max="24" className="w-32" 
                    value={parseInt(branding.tokenOverrides['--ds-radius-default'] || '8')}
                    onChange={(e) => updateToken('--ds-radius-default', `${e.target.value}px`)}
                  />
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>

        <div className="mt-auto pt-6 border-t border-ds-border/20 flex gap-3">
          <Button variant="outline" className="flex-1 font-bold uppercase tracking-widest text-[10px] h-11" onClick={() => setBranding(initialBranding)}>
            <RotateCcw className="h-3 w-3 mr-2" /> Reset
          </Button>
          <Button className="flex-1 bg-ds-background-brand-bold hover:bg-ds-background-brand-bold-hover font-bold uppercase tracking-widest text-[10px] h-11" onClick={handleSave}>
            <Save className="h-3 w-3 mr-2" /> Save & Apply
          </Button>
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="flex items-center justify-between bg-ds-background-neutral-subtle/30 p-2 rounded-xl border border-ds-border/20">
          <div className="flex items-center gap-2 px-2">
            <Eye className="h-4 w-4 text-ds-text-subtle" />
            <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">Live Preview Canvas</span>
          </div>
          <div className="flex gap-1">
            <Button 
              variant={viewMode === 'desktop' ? 'secondary' : 'ghost'} 
              size="sm" className="h-8 w-8 p-0"
              onClick={() => setViewMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'mobile' ? 'secondary' : 'ghost'} 
              size="sm" className="h-8 w-8 p-0"
              onClick={() => setViewMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className={cn(
          "flex-1 bg-ds-background-neutral-subtle/10 rounded-2xl border-2 border-dashed border-ds-border/40 p-4 transition-all duration-500 overflow-hidden flex items-center justify-center",
          viewMode === 'mobile' ? "max-w-[375px] mx-auto" : "w-full"
        )}>
          <iframe 
            ref={iframeRef}
            src={clientDashboardUrl}
            className="w-full h-full rounded-lg bg-white shadow-2xl"
            title="Live Theme Preview"
          />
        </div>
      </div>
    </div>
  );
}
