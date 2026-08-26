'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
} from '@gateflow/ui';
import { ShieldAlert, KeyRound, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StepUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (stepUpToken: string) => void;
  actionTitle?: string;
  actionCode: string;
}

export function StepUpModal({
  isOpen,
  onClose,
  onSuccess,
  actionTitle,
  actionCode,
}: StepUpModalProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/security/step-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          action: actionCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error ??
            (isArabic
              ? 'كلمة المرور غير صحيحة، يرجى إعادة المحاولة'
              : 'Invalid password, please try again')
        );
        return;
      }

      setPassword('');
      onSuccess(data.stepUpToken);
      onClose();
    } catch {
      setError(
        isArabic
          ? 'حدث خطأ أثناء التحقق، يرجى المحاولة لاحقاً'
          : 'Verification failed, please try again'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border border-border/80 shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-amber-500">
            <ShieldAlert className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold">
              {isArabic
                ? 'تأكيد الحماية الإضافية (Step-Up MFA)'
                : 'Security Step-Up Verification'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            {isArabic
              ? `يتطلب تنفيذ "${actionTitle ?? actionCode}" إعادة إدخال كلمة المرور لتأكيد هويتك وحماية بيانات المؤسسة.`
              : `Executing "${actionTitle ?? actionCode}" requires re-entering your account password to verify identity.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              {isArabic ? 'كلمة المرور' : 'Account Password'}
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder={isArabic ? '••••••••' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="pl-9 text-sm"
              />
            </div>
            {error && (
              <p className="text-xs font-medium text-destructive mt-1">
                {error}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={loading || !password}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isArabic ? 'تأكيد المتابعة' : 'Confirm & Proceed'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
