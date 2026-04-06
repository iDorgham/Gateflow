'use client';

import * as React from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import { Button, cn } from '@gateflow/ui';
import { motion, AnimatePresence } from 'framer-motion';

export interface InstallGuideProps {
  packageName?: string;
  command?: string;
  className?: string;
}

export function InstallGuide({
  packageName,
  command,
  className,
}: InstallGuideProps) {
  const [copied, setCopied] = React.useState(false);

  if (!packageName && !command) return null;

  const finalCommand = command || `pnpm add ${packageName}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group relative flex items-center gap-3 px-4 py-2 bg-[var(--ds-background-neutral-subtle)] dark:bg-[var(--ds-surface-glass)] border border-[var(--ds-border-subtle)] rounded-xl overflow-hidden backdrop-blur-md shadow-sm transition-all hover:shadow-md hover:border-[var(--ds-border-brand)]/50',
        className
      )}
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-[var(--ds-background-brand-bold)] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center gap-2 text-[var(--ds-text-subtle)] shrink-0">
        <Terminal
          size={14}
          className="group-hover:text-[var(--ds-text-brand)] transition-colors"
        />
        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">
          Install
        </span>
      </div>

      <code className="text-xs font-mono text-[var(--ds-text)] truncate flex-1 selection:bg-[var(--ds-background-brand-bold)] selection:text-white">
        {finalCommand}
      </code>

      <Button
        variant="ghost"
        size="icon"
        onClick={copyToClipboard}
        className="h-8 w-8 rounded-lg hover:bg-[var(--ds-background-neutral-pressed)] transition-all shrink-0"
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-green-500"
            >
              <Check size={14} strokeWidth={3} />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-[var(--ds-text-subtlest)] group-hover:text-[var(--ds-text)]"
            >
              <Copy size={14} />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 h-12 w-12 bg-[var(--ds-background-brand-bold)]/5 rounded-full blur-2xl group-hover:bg-[var(--ds-background-brand-bold)]/10 transition-colors" />
    </motion.div>
  );
}
