'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@gateflow/ui';
import { X, Cookie, ShieldCheck } from 'lucide-react';
import type { Locale } from '../i18n-config';

export function CookieConsent({ locale }: { locale: Locale }) {
  const [isVisible, setIsVisible] = React.useState(false);
  const isRtl = locale.startsWith('ar');

  React.useEffect(() => {
    const consent = localStorage.getItem('gateflow-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gateflow-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('gateflow-cookie-consent', 'declined');
    setIsVisible(false);
  };

  const content = {
    en: {
      title: 'Cookie Policy',
      description:
        'We use cookies to enhance your security experience and analyze our traffic. No PII is ever sold or shared.',
      accept: 'Accept All',
      decline: 'Decline',
    },
    ar: {
      title: 'سياسة ملفات الارتباط',
      description:
        'نستخدم ملفات الارتباط لتحسين تجربة الأمان الخاصة بك وتحليل حركة المرور لدينا. لا يتم بيع أو مشاركة أي بيانات شخصية.',
      accept: 'قبول الكل',
      decline: 'رفض',
    },
  };

  const t = locale.startsWith('ar') ? content.ar : content.en;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-8 inset-x-8 z-[100] flex justify-center pointer-events-none"
        >
          <div className="pointer-events-auto max-w-4xl w-full bg-ds-surface/80 backdrop-blur-2xl border border-ds-border-bold shadow-[0_32px_64px_rgba(0,0,0,0.2)] rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="flex items-center gap-6 flex-grow">
              <div className="h-16 w-16 rounded-2xl bg-ds-background-brand-subtle flex items-center justify-center text-ds-text-brand flex-shrink-0 shadow-inner">
                <Cookie size={32} />
              </div>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[14px] font-black uppercase tracking-[0.2em] text-ds-text-brand">
                    {t.title}
                  </span>
                  <ShieldCheck size={14} className="text-ds-text-success" />
                </div>
                <p className="text-ds-text-subtle text-[15px] font-medium leading-relaxed max-w-xl">
                  {t.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <Button
                variant="subtle"
                onClick={handleDecline}
                className="flex-grow md:flex-none h-12 px-8 font-black uppercase tracking-widest text-[11px] border border-ds-border hover:border-ds-border-bold transition-all"
              >
                {t.decline}
              </Button>
              <Button
                variant="brand"
                onClick={handleAccept}
                className="flex-grow md:flex-none h-12 px-10 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-ds-background-brand-bold/20 hover:-translate-y-0.5 transition-all"
              >
                {t.accept}
              </Button>
              <button
                onClick={() => setIsVisible(false)}
                className="hidden md:flex p-2 text-ds-text-subtlest hover:text-ds-text-heading transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
