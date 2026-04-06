'use client';

import * as React from 'react';
import { Copy, Check, Code2, Eye } from 'lucide-react';
import {
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  useToast,
  Badge,
} from '@gateflow/ui';

interface Property {
  name: string;
  type: string;
  default?: string;
  description: string;
}

interface GalleryItemProps {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
  properties?: Property[];
  packageName?: string;
}

export function GalleryItem({
  title,
  description,
  code,
  children,
  properties,
  packageName = '@gateflow/ui',
}: GalleryItemProps) {
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: 'Code Copied',
      description: 'The component snippet has been copied to your clipboard.',
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="flex flex-col gap-4 mb-20 group/item scroll-mt-20"
      id={title.toLowerCase().replace(/\s+/g, '-')}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text)] group-hover/item:text-[var(--ds-text-brand)] transition-colors">
            {title}
          </h2>
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-black px-2 py-0 h-5 border-[var(--ds-border-subtle)] text-[var(--ds-text-subtlest)]"
          >
            {packageName}
          </Badge>
        </div>
        <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <div className="flex items-center justify-between mb-2">
          <TabsList className="bg-[var(--ds-background-neutral-subtle)] p-1 rounded-xl h-10 border border-[var(--ds-border-subtle)]">
            <TabsTrigger
              value="preview"
              className="rounded-lg px-4 text-[10px] font-black uppercase tracking-tight data-[state=active]:bg-white data-[state=active]:text-[var(--ds-text-selected)] data-[state=active]:shadow-sm flex gap-2 items-center"
            >
              <Eye size={12} /> Preview
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="rounded-lg px-4 text-[10px] font-black uppercase tracking-tight data-[state=active]:bg-white data-[state=active]:text-[var(--ds-text-selected)] data-[state=active]:shadow-sm flex gap-2 items-center"
            >
              <Code2 size={12} /> Code
            </TabsTrigger>
          </TabsList>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 rounded-lg text-[10px] font-black uppercase tracking-wider gap-2 bg-[var(--ds-background-neutral-subtle)] border border-[var(--ds-border-subtle)] hover:bg-[var(--ds-background-neutral-hovered)]"
          >
            {copied ? (
              <Check size={12} className="text-green-500" />
            ) : (
              <Copy size={12} />
            )}
            {copied ? 'Copied' : 'Copy Snippet'}
          </Button>
        </div>

        <TabsContent
          value="preview"
          className="mt-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="min-h-[300px] flex items-center justify-center p-8 rounded-3xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)] relative overflow-hidden group/canvas">
            {/* Grid background logic could go here */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(var(--ds-border-brand) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            ></div>
            <div className="relative z-10 w-full flex items-center justify-center">
              {children}
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="code"
          className="mt-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="rounded-3xl border border-[var(--ds-border-subtle)] bg-[#09090b] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                TSX Snippet
              </span>
            </div>
            <pre className="p-6 overflow-x-auto text-xs font-mono leading-relaxed text-blue-200">
              <code>{code}</code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>

      {properties && properties.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-pressed)]">
                <th className="px-4 py-3 font-black uppercase tracking-tight text-[var(--ds-text-subtle)]">
                  Property
                </th>
                <th className="px-4 py-3 font-black uppercase tracking-tight text-[var(--ds-text-subtle)]">
                  Type
                </th>
                <th className="px-4 py-3 font-black uppercase tracking-tight text-[var(--ds-text-subtle)]">
                  Default
                </th>
                <th className="px-4 py-3 font-black uppercase tracking-tight text-[var(--ds-text-subtle)]">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr
                  key={prop.name}
                  className="border-b border-[var(--ds-border-subtle)] last:border-0 hover:bg-white/50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono font-bold text-[var(--ds-text-brand)]">
                    {prop.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-[var(--ds-text-subtlest)] text-[10px]">
                    {prop.type}
                  </td>
                  <td className="px-4 py-3 font-mono text-[var(--ds-text-subtlest)] italic">
                    {prop.default || '-'}
                  </td>
                  <td className="px-4 py-3 text-[var(--ds-text-subtle)] leading-relaxed">
                    {prop.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
