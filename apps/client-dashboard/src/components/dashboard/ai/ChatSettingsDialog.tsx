'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';

interface ChatSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatTitle: string;
}

const PREDEFINED_RULES = [
  "Always respond in Arabic.",
  "Keep responses under 2 paragraphs.",
  "Format all data as Markdown tables.",
  "Act as a strict security auditor.",
];

export function ChatSettingsDialog({ open, onOpenChange, chatTitle }: ChatSettingsDialogProps) {
  const { t } = useTranslation('dashboard');
  const [selectedRules, setSelectedRules] = React.useState<string[]>([]);
  const [customRule, setCustomRule] = React.useState('');

  const toggleRule = (rule: string) => {
    setSelectedRules(prev => 
      prev.includes(rule) ? prev.filter(r => r !== rule) : [...prev, rule]
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
            {t('ai.chatSettingsDesc', 'Set custom rules or instructions for "')} {chatTitle}{t('ai.chatSettingsDescEnd', '".')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[var(--ds-text,#172B4D)] dark:text-[#F4F5F7]">
              {t('ai.predefinedRules', 'Select Rules')}
            </label>
            <div className="flex flex-col gap-2">
              {PREDEFINED_RULES.map((rule, idx) => (
                <label key={idx} className="flex items-center gap-2 text-sm text-[var(--ds-text-subtle,#42526E)] dark:text-[#A5ADBA] cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedRules.includes(rule)}
                    onChange={() => toggleRule(rule)}
                    className="rounded border-[var(--ds-border,#DFE1E6)] text-[var(--ds-background-selected-bold,#0052CC)] focus:ring-[var(--ds-border-focused,#4C9AFF)]"
                  />
                  {rule}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[var(--ds-text,#172B4D)] dark:text-[#F4F5F7]">
              {t('ai.customRule', 'Custom Instructions')}
            </label>
            <textarea
              className="min-h-[100px] w-full bg-white dark:bg-[#1C2126] border border-[var(--ds-border-input,#DFE1E6)] dark:border-[#2C333A] rounded-[3px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC] transition-all resize-none"
              placeholder={t('ai.customRulePlaceholder', 'E.g., "Only use data from the North Gate..."')}
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
