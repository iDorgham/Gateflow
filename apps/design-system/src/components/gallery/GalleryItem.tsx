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
import { motion } from 'framer-motion';

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
  const { addToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    addToast({
      title: 'Code Copied',
      description: 'The component snippet has been copied to your clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      className="flex flex-col gap-6 mb-24 group/item scroll-mt-24"
      id={title.toLowerCase().replace(/\s+/g, '-')}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-[var(--ds-text)] group-hover/item:text-[var(--ds-text-brand)] transition-all duration-500">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[10px] uppercase font-black px-2 py-0 h-5 border-[var(--ds-border-subtle)] text-[var(--ds-text-subtlest)] bg-[var(--ds-background-neutral-subtle)]"
            >
              {packageName.split('/').pop()}
            </Badge>
            <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-[var(--ds-background-brand-bold)] to-blue-500 opacity-50 group-hover/item:opacity-100 group-hover/item:w-12 transition-all duration-500" />
          </div>
        </div>
        <p className="text-base text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-medium opacity-80 group-hover/item:opacity-100 transition-opacity">
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
          <div className="min-h-[400px] flex items-center justify-center p-12 rounded-[2.5rem] border border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)] dark:bg-[var(--ds-surface-glass)] relative overflow-hidden group/canvas shadow-inner">
            {/* Design Grid & Patterns */}
            <div
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none transition-transform duration-700 group-hover/canvas:scale-110"
              style={{
                backgroundImage: 'var(--gf-pattern-sentinel)',
                backgroundSize: '24px 24px',
              }}
            ></div>

            {/* Interactive Glow */}
            <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-[var(--ds-background-brand-bold)]/5 rounded-full blur-[80px] pointer-events-none group-hover/canvas:bg-[var(--ds-background-brand-bold)]/10 transition-all duration-1000" />

            <motion.div
              layout
              className="relative z-10 w-full flex items-center justify-center"
            >
              {children}
            </motion.div>
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
    </motion.div>
  );
}
