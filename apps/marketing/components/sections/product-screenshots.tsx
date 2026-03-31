'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Locale } from '../../i18n-config';
import { useTranslation } from '../../hooks/use-translation';
import { Monitor, Smartphone, LayoutDashboard, ExternalLink } from 'lucide-react';

interface MockupPanelProps {
  caption: string;
  desc: string;
  icon: React.ReactElement;
  imageSrc: string;
  isMobile?: boolean;
}

function MockupPanel({ caption, desc, icon, imageSrc, isMobile }: MockupPanelProps) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="flex flex-col items-center gap-10 group"
    >
      {/* Device frame */}
      <div className={`relative w-full overflow-hidden transition-all duration-500 rounded-[40px] border border-ds-border-bold bg-ds-surface-sunken shadow-[0_64px_128px_rgba(0,0,0,0.15)] group-hover:shadow-[0_80px_160px_rgba(var(--ds-background-brand-bold),0.12)] group-hover:border-ds-border-brand/40 ${isMobile ? 'aspect-[9/16] max-w-[340px] mx-auto' : 'aspect-video'}`}>
        {/* Window/Mobile Status Bar */}
        {!isMobile && (
          <div className="bg-ds-surface px-6 py-4 flex items-center justify-between border-b border-ds-border-bold">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-ds-background-danger-bold/40" />
              <div className="w-3 h-3 rounded-full bg-ds-background-warning-bold/40" />
              <div className="w-3 h-3 rounded-full bg-ds-background-success-bold/40" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-ds-text-subtlest">
              gateflow-cloud-os v.9.4
            </div>
            <ExternalLink size={14} className="text-ds-text-subtlest" />
          </div>
        )}
        
        {/* Real Screenshot Area */}
        <div className="relative w-full h-full bg-ds-surface">
           <Image 
             src={imageSrc} 
             alt={caption}
             fill
             className="object-cover transition-transform duration-1000 group-hover:scale-105"
             placeholder="blur"
             blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
           />
           {/* Glass overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-ds-text-heading/10 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Caption */}
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-ds-background-brand-subtle rounded-xl text-ds-text-brand mb-5 shadow-sm">
            {icon}
            <span className="text-[12px] font-black uppercase tracking-widest leading-none">{caption}</span>
        </div>
        <p className="text-lg md:text-xl text-ds-text-subtle font-medium leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

export function ProductScreenshots({ _locale }: { _locale: Locale }) {
  const { t } = useTranslation('landing');

  const panels = [
    {
      caption: t('screenshots.dashboard.caption'),
      desc: t('screenshots.dashboard.desc'),
      icon: <Monitor size={18} />,
      imageSrc: '/dashboard-mockup.png',
      isMobile: false,
    },
    {
      caption: t('screenshots.scanner.caption'),
      desc: t('screenshots.scanner.desc'),
      icon: <Smartphone size={18} />,
      imageSrc: '/scanner-mockup.png',
      isMobile: true,
    },
    {
      caption: t('screenshots.portal.caption'),
      desc: t('screenshots.portal.desc'),
      icon: <LayoutDashboard size={18} />,
      imageSrc: '/dashboard-mockup.png', // Reusing dashboard for tablet/portal for now or generate another
      isMobile: false,
    },
  ];

  return (
    <section className="py-32 md:py-64 bg-ds-surface border-y border-ds-border relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 start-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-ds-border-brand/40 to-transparent" />
      
      <div className="container mx-auto px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-24 lg:mb-40">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[13px] font-black uppercase tracking-[0.4em] text-ds-text-brand mb-8"
          >
            {t('screenshots.badge')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-8xl font-black tracking-tight text-ds-text-heading leading-[1.05]"
          >
            {t('screenshots.title')}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-16 lg:gap-24 items-start">
          {panels.map((panel, i) => (
            <motion.div
              key={panel.caption}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <MockupPanel {...panel} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
