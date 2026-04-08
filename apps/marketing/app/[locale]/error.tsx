'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import enErrors from '../../locales/en/errors.json';
import arErrors from '../../locales/ar-EG/errors.json';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const dict = locale === 'ar-EG' ? arErrors : enErrors;
  const t = ((dict as Record<string, Record<string, string>>)?.[
    '500'
  ] as Record<string, string>) || {
    title: '500',
    headline: 'Error',
    description: 'Something went wrong',
    cta: 'Try Again',
  };

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <AlertCircle className="w-24 h-24 mx-auto text-ds-text-danger/40 mb-8" />
      <h1 className="text-8xl font-black text-ds-text-brand/5 mb-4">
        {t.title}
      </h1>
      <h2 className="text-4xl font-black text-ds-text-heading mb-6 tracking-tight">
        {t.headline}
      </h2>
      <p className="text-xl text-ds-text-subtle max-w-lg mb-10 font-medium leading-relaxed">
        {t.description}
      </p>
      <button
        className="rounded-xl h-14 px-8 font-black uppercase tracking-widest text-xs bg-ds-background-brand-bold text-ds-text-inverse hover:brightness-110 transition-all shadow-lg shadow-ds-background-brand-bold/20"
        onClick={() => reset()}
      >
        {t.cta}
      </button>
    </div>
  );
}
