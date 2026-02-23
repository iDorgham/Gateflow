import * as React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@gate-access/ui';
import { I18nLink } from '../i18n-link';
import type { Locale } from '../../i18n-config';

interface SolutionLayoutProps {
  locale: Locale;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  ctaText: string;
  imagePlaceholder?: React.ReactNode;
  benefits: { title: string; desc: string }[];
}

export function SolutionLayout({
  locale,
  title,
  subtitle,
  description,
  icon,
  features,
  ctaText,
  imagePlaceholder,
  benefits,
}: SolutionLayoutProps) {
  return (
    <div className="flex flex-col w-full pb-24">
      {/* Hero */}
      <section className="pt-20 pb-16 container px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 opacity-10">
           {React.cloneElement(icon as React.ReactElement, { size: 400 })}
        </div>
        
        <div className="max-w-3xl">
          <p className="text-primary font-bold uppercase tracking-widest mb-4">{subtitle}</p>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-6">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-10">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-4">
             <Button size="lg" className="h-14 px-8 rounded-xl font-bold" asChild>
                <I18nLink locale={locale} href="/contact">
                   {ctaText}
                   <ArrowRight className="ml-2 h-4 w-4" />
                </I18nLink>
             </Button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container px-6 grid lg:grid-cols-2 gap-16 items-center mb-24">
         <div className="space-y-8">
            <h2 className="text-3xl font-black">Tailored for your specific workflows</h2>
            <div className="grid gap-6">
               {benefits.map((b, i) => (
                  <div key={i} className="flex gap-4 p-6 rounded-2xl border bg-card hover:bg-muted/50 transition-colors">
                     <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <CheckCircle2 size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-lg mb-1">{b.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-[3rem] bg-muted border overflow-hidden flex items-center justify-center">
            {imagePlaceholder || (
               <div className="text-center opacity-20">
                  {React.cloneElement(icon as React.ReactElement, { size: 120 })}
               </div>
            )}
            <div className="absolute inset-x-8 bottom-8 p-6 bg-background/80 backdrop-blur rounded-2xl border shadow-xl">
                <div className="flex items-center justify-between mb-4">
                   <div className="h-2 w-24 bg-primary rounded-full" />
                   <div className="h-2 w-12 bg-muted rounded-full" />
                </div>
                <div className="space-y-2">
                   <div className="h-4 w-full bg-muted rounded-md" />
                   <div className="h-4 w-2/3 bg-muted rounded-md" />
                </div>
            </div>
         </div>
      </section>

      {/* Features Bar */}
      <section className="bg-slate-900 py-16 text-white border-y border-white/10">
         <div className="container px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <div className="h-2 w-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),1)]" />
                     <span className="font-bold uppercase tracking-widest text-xs">{f}</span>
                  </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
