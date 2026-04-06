'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { useLocale } from '../../../components/providers/LocaleProvider';
import { Card, Badge } from '@gateflow/ui';
import { Shield, Sparkles, Zap, Globe, Cpu, Layout } from 'lucide-react';

export default function FoundationsPage() {
  const { isRTL } = useLocale();

  const values = [
    {
      icon: Shield,
      title: isRTL ? 'الأمان' : 'Security',
      desc: isRTL
        ? 'أهمية قصوى للأمان في جميع مكوناتنا ونماذجنا.'
        : 'Security-first architecture for compound management confidence.',
      color: 'bg-blue-500',
    },
    {
      icon: Sparkles,
      title: isRTL ? 'الجماليات الممتازة' : 'Premium Aesthetics',
      desc: isRTL
        ? 'تصميم عصري ونظيف يركز على سهولة الاستخدام.'
        : 'Clean, modern UI designed for high-end residential environments.',
      color: 'bg-purple-500',
    },
    {
      icon: Globe,
      title: isRTL ? 'دعم MENA' : 'MENA Localized',
      desc: isRTL
        ? 'دعم كامل للغة العربية والاتجاه من اليمين إلى اليسار.'
        : 'Native Arabic support and RTL parity across the whole system.',
      color: 'bg-emerald-500',
    },
  ];

  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title={isRTL ? 'الأساسات' : 'Foundations'}
        subtitle={
          isRTL
            ? 'المبادئ والقيم الجوهرية التي تبني تجربة GateFlow.'
            : 'The core principles and core values that define the GateFlow experience.'
        }
        breadcrumbs={[
          { label: 'Documentation', href: '/' },
          { label: isRTL ? 'الأساسات' : 'Foundations' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {values.map((v, i) => (
          <Card
            key={i}
            className="p-8 rounded-[2rem] border-[var(--ds-border-subtle)] bg-white shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col gap-6 group"
          >
            <div
              className={`h-12 w-12 rounded-2xl ${v.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
            >
              <v.icon size={24} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text)]">
                {v.title}
              </h3>
              <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed font-medium">
                {v.desc}
              </p>
            </div>
          </Card>
        ))}
      </section>

      <section className="mt-8 p-12 rounded-[3rem] bg-[var(--ds-background-brand-bold)] text-white flex flex-col items-center text-center gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-all duration-1000">
          <Cpu size={300} />
        </div>
        <div className="flex flex-col gap-4 relative z-10 max-w-2xl">
          <Badge className="w-fit self-center bg-white/20 text-white border-white/20 uppercase font-black tracking-widest text-[9px]">
            The Sentinel Code
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight">
            Built for the Future of <br /> Compound Resilience
          </h2>
          <p className="text-sm md:text-base font-medium text-white/70 leading-relaxed">
            GateFlow foundations bridge the gap between high-performance
            enterprise security and consumer-grade elegance. Every token, every
            primitive, and every pattern is battle-tested for speed,
            accessibility, and RTL readiness.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full mt-6 relative z-10">
          <div className="flex flex-col gap-2">
            <span className="text-3xl font-black tracking-tight">100%</span>
            <span className="text-[10px] uppercase font-black tracking-widest text-white/50">
              RTL Native
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-3xl font-black tracking-tight">&lt;50ms</span>
            <span className="text-[10px] uppercase font-black tracking-widest text-white/50">
              Runtime Overhead
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-3xl font-black tracking-tight">AA</span>
            <span className="text-[10px] uppercase font-black tracking-widest text-white/50">
              Accessibility
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-3xl font-black tracking-tight">ADS</span>
            <span className="text-[10px] uppercase font-black tracking-widest text-white/50">
              Compliant
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-6">
        <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text)]">
          {isRTL ? 'فلسفتنا' : 'Our Philosophy'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start gap-5 p-8 rounded-3xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)]">
            <div className="h-10 w-10 flex items-center justify-center text-[var(--ds-text-brand)] shrink-0">
              <Layout size={32} />
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text)]">
                Invisible Sentinel UI
              </h4>
              <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed font-medium">
                UI should be invisible until it&apos;s needed. We prioritize
                high-contrast actionable states over purely decorative
                flourishes, ensuring security guards can act instantly.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-5 p-8 rounded-3xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)]">
            <div className="h-10 w-10 flex items-center justify-center text-amber-500 shrink-0">
              <Zap size={32} />
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text)]">
                Performance as a Feature
              </h4>
              <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed font-medium">
                The design system uses zero heavy animation libraries by
                default. Pure CSS animations and logical properties ensure a
                frictionless experience on mobile field devices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
