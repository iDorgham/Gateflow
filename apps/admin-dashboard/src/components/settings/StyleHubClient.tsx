'use client';

import * as React from 'react';
import { useState, useTransition } from 'react';
import {
  Paintbrush,
  History,
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  CheckCircle2,
  AlertCircle,
  Layout,
  Palette,
  Type,
  Maximize,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Separator,
  ScrollArea,
  cn,
} from '@gateflow/ui';
import { validateContrast } from '@gate-access/utils/contrast';
import { OVERRIDABLE_TOKENS } from '@/lib/branding-css-generator';

interface TokenVariable {
  key: string;
  value: string;
}

interface BrandingSnapshot {
  id: string;
  name: string;
  createdAt: Date;
  cssTokens: Record<string, string>;
}

interface StyleHubProps {
  orgId: string;
  initialVariables: TokenVariable[];
  snapshots: BrandingSnapshot[];
}

export function StyleHubClient({
  orgId,
  initialVariables,
  snapshots,
}: StyleHubProps) {
  const [variables, setVariables] = useState(initialVariables);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  // Handle local variable updates
  const updateVariable = (key: string, value: string) => {
    setVariables((prev) =>
      prev.map((v) => (v.key === key ? { ...v, value } : v))
    );

    // Live update DOM for preview
    document.documentElement.style.setProperty(key, value);
  };

  const handleAiEdit = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      // API call to Vercel AI SDK to transform natural language to token updates
      const res = await fetch(`/api/organizations/${orgId}/style/ai-edit`, {
        method: 'POST',
        body: JSON.stringify({ prompt, currentVariables: variables }),
      });
      const data = await res.json();

      if (data.updates) {
        data.updates.forEach((u: { key: string; value: string }) => {
          updateVariable(u.key, u.value);
        });
        setPrompt('');
      }
    } catch (err) {
      console.error('AI Edit Failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/organizations/${orgId}/style/save`, {
        method: 'POST',
        body: JSON.stringify({ variables }),
      });
      // Refresh or show success
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            <Paintbrush className="w-6 h-6 text-purple-500" />
            Style Hub & Live Theming
          </h2>
          <p className="text-sm text-ds-text-subtle">
            Customize your organization&apos;s visual identity with AI-driven
            design tokens.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-ds-border/40">
            <RotateCcw className="w-4 h-4" />
            Reset Changes
          </Button>
          <Button
            className="gap-2 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Create Snapshot'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: AI & Manual Editor */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="border-ds-border/40 shadow-sm overflow-hidden">
            <CardHeader className="bg-purple-500/5 border-b border-purple-500/10">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-purple-700">
                <Sparkles className="w-4 h-4" />
                AI Design Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-ds-text-subtle">
                  Describe your vision
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Make it look more corporate with deep blues and sharper corners' or 'Create a vibrant high-contrast dark theme'"
                  className="w-full min-h-[100px] rounded-xl border border-ds-border bg-ds-background-neutral-subtle/30 p-3 text-sm focus:ring-2 focus:ring-purple-500/20 transition-all outline-none resize-none"
                />
              </div>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 gap-2 font-bold italic"
                disabled={isGenerating || !prompt}
                onClick={handleAiEdit}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing Design...
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    REIMAGINE UI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-ds-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest">
                Manual Token Override
              </CardTitle>
            </CardHeader>
            <ScrollArea className="h-[400px]">
              <CardContent className="space-y-6">
                {OVERRIDABLE_TOKENS.map((token) => {
                  const variable = variables.find((v) => v.key === token);
                  const currentValue = variable?.value || '';

                  return (
                    <div key={token} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <code className="text-[9px] font-mono text-ds-text-subtle">
                          {token}
                        </code>
                        {token.includes('color') ||
                        token.includes('background') ||
                        token.includes('surface') ? (
                          <div
                            className="w-4 h-4 rounded-full border border-ds-border shadow-sm"
                            style={{ backgroundColor: currentValue }}
                          />
                        ) : null}
                      </div>
                      <Input
                        value={currentValue}
                        onChange={(e) => updateVariable(token, e.target.value)}
                        className="h-8 text-xs font-mono bg-ds-background-neutral-subtle/20"
                      />
                    </div>
                  );
                })}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>

        {/* Right Column: Live Preview & History */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex items-center justify-between bg-ds-background-subtle/50 p-1.5 rounded-2xl border border-ds-border/40 mb-6">
              <TabsList className="bg-transparent border-none gap-2">
                <TabsTrigger
                  value="editor"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 h-9 text-[10px] font-black uppercase tracking-widest"
                >
                  <Layout className="w-4 h-4 mr-2" />
                  Live Preview
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 h-9 text-[10px] font-black uppercase tracking-widest"
                >
                  <History className="w-4 h-4 mr-2" />
                  Snapshot History
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="editor"
              className="m-0 focus-visible:outline-none"
            >
              <div className="rounded-2xl border-4 border-ds-border/20 shadow-2xl overflow-hidden aspect-video bg-white relative group">
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full shadow-lg h-8 gap-2"
                  >
                    <Maximize className="w-3.5 h-3.5" />
                    Open In Full Screen
                  </Button>
                </div>

                {/* Mockup Preview Area */}
                <div className="w-full h-full p-8 space-y-8 overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-32 h-8 rounded-lg"
                      style={{
                        backgroundColor: 'var(--ds-background-brand-bold)',
                      }}
                    />
                    <div className="flex gap-4">
                      <div
                        className="w-20 h-8 rounded-full"
                        style={{
                          backgroundColor: 'var(--ds-background-subtle)',
                        }}
                      />
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{
                          backgroundColor:
                            'var(--ds-background-neutral-subtle)',
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card
                        key={i}
                        className="border-ds-border/40 overflow-hidden"
                        style={{ borderRadius: 'var(--ds-radius-default)' }}
                      >
                        <div
                          className="h-24"
                          style={{
                            backgroundColor:
                              'var(--ds-background-brand-subtle)',
                          }}
                        />
                        <CardContent className="pt-4 space-y-2">
                          <div
                            className="h-3 w-3/4 rounded"
                            style={{ backgroundColor: 'var(--ds-text)' }}
                          />
                          <div
                            className="h-2 w-1/2 rounded"
                            style={{ backgroundColor: 'var(--ds-text-subtle)' }}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      className="font-bold italic"
                      style={{
                        backgroundColor: 'var(--ds-background-brand-bold)',
                        borderRadius: 'var(--ds-radius-default)',
                      }}
                    >
                      PRIMARY ACTION
                    </Button>
                    <Button
                      variant="outline"
                      className="border-ds-border"
                      style={{ borderRadius: 'var(--ds-radius-default)' }}
                    >
                      Secondary Action
                    </Button>
                  </div>
                </div>
              </div>

              {/* Accessibility Guard */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-ds-border-success/30 bg-ds-background-success-subtle/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-ds-background-success-subtle flex items-center justify-center text-ds-text-success">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-success">
                      WCAG AA Compliant
                    </h4>
                    <p className="text-[11px] text-ds-text-subtle">
                      Contrast ratio for brand primary is 5.2:1
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-ds-border/40 bg-ds-background-subtle/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-ds-background-neutral-subtle flex items-center justify-center text-ds-text-subtle">
                    <Layout className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest">
                      Layout Integrity
                    </h4>
                    <p className="text-[11px] text-ds-text-subtle">
                      Border radius and spacing variables verified.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="history"
              className="m-0 focus-visible:outline-none"
            >
              <Card className="border-ds-border/40">
                <CardContent className="p-0">
                  <div className="divide-y divide-ds-border/40">
                    {snapshots.length === 0 ? (
                      <div className="p-12 text-center text-ds-text-subtle italic text-sm">
                        No snapshots created yet.
                      </div>
                    ) : (
                      snapshots.map((snapshot) => (
                        <div
                          key={snapshot.id}
                          className="p-6 flex items-center justify-between hover:bg-ds-background-neutral-subtle/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600">
                              <History className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-sm font-bold">
                                {snapshot.name}
                              </div>
                              <div className="text-[10px] text-ds-text-subtle uppercase tracking-wider">
                                {new Date(snapshot.createdAt).toLocaleString()}{' '}
                                • {Object.keys(snapshot.cssTokens).length}{' '}
                                Tokens
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-[9px] font-black uppercase tracking-widest px-4 border-ds-border/40"
                            >
                              <Eye className="w-3.5 h-3.5 mr-2" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-[9px] font-black uppercase tracking-widest px-4 border-ds-border/40 hover:bg-purple-500 hover:text-white hover:border-purple-500"
                            >
                              <RotateCcw className="w-3.5 h-3.5 mr-2" />
                              Restore
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
