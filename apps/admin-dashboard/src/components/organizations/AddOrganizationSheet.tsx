'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  Button,
  Input,
  NativeSelect,
  ScrollArea,
} from '@gate-access/ui';
import {
  Building2,
  Loader2,
  X,
  Plus,
  ShieldCheck,
  Building,
  Mail,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

interface AddOrganizationSheetProps {
  open: boolean;
  onClose: () => void;
  translations: {
    title: string;
    subtitle: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    planLabel: string;
    planHelper: string;
    notice: string;
    submitLabel: string;
    cancelLabel: string;
    success: string;
    error: string;
  };
}

export function AddOrganizationSheet({
  open,
  onClose,
  translations,
}: AddOrganizationSheetProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    plan: 'FREE',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name) return toast.error('Organization name is required');

    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/organizations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (data.success) {
          toast.success(translations.success);
          router.refresh();
          onClose();
          setFormData({ name: '', email: '', plan: 'FREE' });
        } else {
          toast.error(data.message || translations.error);
        }
      } catch (error) {
        toast.error('An error occurred');
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full bg-ds-background-default border-l border-ds-border shadow-2xl">
        {/* Header Section */}
        <div className="p-6 border-b border-ds-border bg-ds-background-neutral-subtle/30 shrink-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ds-background-brand-bold text-ds-text-inverse font-black text-lg shadow-lg shadow-ds-background-brand-bold/20">
                <Plus className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h2 className="text-ds-text text-xl font-black uppercase tracking-tight truncate leading-tight">
                  {translations.title}
                </h2>
                <p className="text-[10px] font-bold text-ds-text-subtle uppercase tracking-tighter flex items-center gap-1 mt-1">
                  <ShieldCheck className="h-3 w-3 text-ds-text-success" />{' '}
                  {translations.subtitle}
                </p>
              </div>
            </div>
            <Button
              variant="subtle"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-8">
              {/* Form Fields */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Building className="h-3.5 w-3.5 text-ds-text-subtle" />
                    <label className="text-[11px] font-black text-ds-text-subtle uppercase tracking-widest">
                      {translations.nameLabel}
                    </label>
                  </div>
                  <Input
                    placeholder={translations.namePlaceholder}
                    className="h-11 rounded-xl bg-ds-background-neutral-subtle border-ds-border focus:bg-ds-background-default transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Mail className="h-3.5 w-3.5 text-ds-text-subtle" />
                    <label className="text-[11px] font-black text-ds-text-subtle uppercase tracking-widest">
                      {translations.emailLabel}
                    </label>
                  </div>
                  <Input
                    type="email"
                    placeholder={translations.emailPlaceholder}
                    className="h-11 rounded-xl bg-ds-background-neutral-subtle border-ds-border focus:bg-ds-background-default transition-all"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Zap className="h-3.5 w-3.5 text-ds-text-brand" />
                    <label className="text-[11px] font-black text-ds-text-subtle uppercase tracking-widest">
                      {translations.planLabel}
                    </label>
                  </div>
                  <NativeSelect
                    className="h-11 rounded-xl bg-ds-background-neutral-subtle border-ds-border focus:bg-ds-background-default transition-all"
                    value={formData.plan}
                    onChange={(e) =>
                      setFormData({ ...formData, plan: e.target.value })
                    }
                  >
                    <option value="FREE">FREE (Standard)</option>
                    <option value="PRO">PRO (Enterprise)</option>
                  </NativeSelect>
                  <p className="text-[10px] text-ds-text-subtlest mt-1 italic">
                    {translations.planHelper}
                  </p>
                </div>
              </div>

              {/* Notice */}
              <div className="p-4 rounded-xl bg-ds-background-brand-subtle/50 border border-ds-border-brand/10">
                <p className="text-[10px] font-bold text-ds-text-brand uppercase tracking-tight leading-relaxed">
                  {translations.notice}
                </p>
              </div>
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="p-6 border-t border-ds-border bg-ds-background-default shrink-0 space-y-3">
            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-black bg-ds-background-brand-bold hover:bg-ds-background-brand-bold-hovered text-ds-text-inverse shadow-lg shadow-ds-background-brand-bold/20"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Building2 className="h-4 w-4 mr-2" />
              )}
              {translations.submitLabel}
            </Button>
            <Button
              type="button"
              variant="subtle"
              className="w-full h-10 rounded-xl text-ds-text-subtle font-bold"
              onClick={onClose}
            >
              {translations.cancelLabel}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
