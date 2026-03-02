'use client';

import { Link2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function CopyLinkButton() {
  const { t } = useTranslation('dashboard');

  async function onCopy() {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      toast.success(t('analytics.copyLinkSuccess', 'Dashboard link copied'));
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (ok) {
        toast.success(t('analytics.copyLinkSuccess', 'Dashboard link copied'));
      } else {
        toast.error(t('analytics.copyLinkFailed', 'Unable to copy dashboard link'));
      }
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="no-print inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
      aria-label={t('analytics.copyLink', 'Copy link')}
    >
      <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
      {t('analytics.copyLink', 'Copy link')}
    </button>
  );
}
