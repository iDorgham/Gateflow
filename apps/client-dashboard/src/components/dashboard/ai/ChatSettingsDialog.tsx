'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from '@gateflow/ui';
import { useTranslation } from 'react-i18next';

interface ChatSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatTitle: string;
}

const PREDEFINED_RULES = [
  'Always respond in Arabic.',
  'Keep responses under 2 paragraphs.',
  'Format all data as Markdown tables.',
  'Act as a strict security auditor.',
];

export function ChatSettingsDialog({
  open,
  onOpenChange,
  chatTitle,
}: ChatSettingsDialogProps) {
  const { t } = useTranslation('dashboard');
  const [selectedRules, setSelectedRules] = React.useState<string[]>([]);
  const [customRule, setCustomRule] = React.useState('');

  const toggleRule = (rule: string) => {
    setSelectedRules((prev) =>
      prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule]
    );
  };

  const handleSave = () => {
    // In a real implementation, this would save to the chat context/database
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('ai.chatSettings', 'Chat Settings')}</DialogTitle>
          <DialogDescription>
            {t('ai.chatSettingsDesc', 'Set custom rules or instructions for "')}{' '}
            {chatTitle}
            {t('ai.chatSettingsDescEnd', '".')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground dark:text-zinc-100">
              {t('ai.predefinedRules', 'Select Rules')}
            </label>
            <div className="flex flex-col gap-2">
              {PREDEFINED_RULES.map((rule, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 text-sm text-muted-foreground dark:text-zinc-400 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedRules.includes(rule)}
                    onChange={() => toggleRule(rule)}
                    className="rounded border-border text-primary focus:ring-primary/40"
                  />
                  {rule}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground dark:text-zinc-100">
              {t('ai.customRule', 'Custom Instructions')}
            </label>
            <textarea
              className="min-h-[100px] w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              placeholder={t(
                'ai.customRulePlaceholder',
                'E.g., "Only use data from the North Gate..."'
              )}
              value={customRule}
              onChange={(e) => setCustomRule(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button onClick={handleSave}>
            {t('common.save', 'Save Changes')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
