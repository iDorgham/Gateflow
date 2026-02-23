"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@gate-access/ui';
import { AlertCircle } from 'lucide-react';
import enErrors from '../../locales/en/errors.json';
import arErrors from '../../locales/ar-EG/errors.json';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const dict = locale === 'ar-EG' ? arErrors : enErrors;
  const t = dict['500'];

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <AlertCircle className="w-24 h-24 mx-auto text-destructive/40 mb-8" />
      <h1 className="text-8xl font-black text-primary/5 mb-4">{t.title}</h1>
      <h2 className="text-4xl font-bold mb-6">{t.headline}</h2>
      <p className="text-xl text-muted-foreground max-w-lg mb-10">
        {t.description}
      </p>
      <Button 
        size="lg" 
        className="rounded-xl h-14 px-8 font-bold" 
        onClick={() => reset()}
      >
        {t.cta}
      </Button>
    </div>
  );
}
