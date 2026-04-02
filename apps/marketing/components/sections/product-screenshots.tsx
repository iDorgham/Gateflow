'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  DashboardIllustration,
  ScannerIllustration,
  PortalIllustration,
} from './app-illustrations';
import {
  Monitor,
  Smartphone,
  LayoutDashboard,
  ExternalLink,
} from 'lucide-react';
import type { Locale } from '../../i18n-config';
import { useTranslation } from '../../hooks/use-translation';

interface MockupPanelProps {
  caption: string;
  desc: string;
  icon: React.ReactElement;
  illustration: React.ReactNode;
  isMobile?: boolean;
}

function MockupPanel({
  caption,
  desc,
  icon,
  illustration,
  isMobile,
}: MockupPanelProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="flex flex-col items-center gap-8 group h-full"
    >
      {/* Device frame */}
      <div
        className={`relative w-full overflow-hidden transition-all duration-500 bg-[#0B0C0E] shadow-[0_48px_96px_rgba(0,0,0,0.12)] group-hover:shadow-[0_64px_128px_rgba(var(--ds-background-brand-bold),0.12)] border border-ds-border-bold group-hover:border-ds-border-brand/40 ${
          isMobile
            ? 'aspect-[9/19.5] max-w-[280px] mx-auto rounded-[52px] border-[10px] border-black'
            : 'aspect-[2/1] rounded-[24px]'
        }`}
      >
        {/* Mobile Dynamic Island */}
        {isMobile && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-ds-background-brand-bold animate-pulse opacity-40 ml-auto mr-4" />
          </div>
        )}

        {/* Window Status Bar (Desktop) */}
        {!isMobile && (
          <div className="bg-[#141517] px-5 py-3 flex items-center justify-between border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-ds-background-danger-bold/30" />
              <div className="w-2 h-2 rounded-full bg-ds-background-warning-bold/30" />
              <div className="w-2 h-2 rounded-full bg-ds-background-success-bold/30" />
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-ds-text-subtlest opacity-50">
              GF-CLOUD v9
            </div>
            <ExternalLink
              size={12}
              className="text-ds-text-subtlest opacity-40"
            />
          </div>
        )}

        {/* Illustration Area */}
        <div className="relative w-full h-full">
          {illustration}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Caption & Description */}
      <div className="text-center px-4">
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-ds-background-brand-subtle rounded-lg text-ds-text-brand mb-4 border border-ds-border-brand/10">
          {icon}
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            {caption}
          </span>
        </div>
        <p className="text-base text-ds-text-subtle font-medium leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

export function ProductScreenshots({ _locale }: { _locale?: Locale }) {
  const { t } = useTranslation('landing');

  // Define panels for clean mapping
  const panels = {
    dashboard: {
      caption: t('screenshots.dashboard.caption') || 'Admin Dashboard',
      desc:
        t('screenshots.dashboard.desc') ||
        'The central nervous system for your security team.',
      icon: <Monitor size={16} />,
      illustration: <DashboardIllustration />,
      isMobile: false,
    },
    scanner: {
      caption: t('screenshots.scanner.caption') || 'Scanner Pro',
      desc:
        t('screenshots.scanner.desc') ||
        'The heavy-duty tool for gate guards. Lightning-fast offline QR decryption.',
      icon: <Smartphone size={16} />,
      illustration: <ScannerIllustration />,
      isMobile: true,
    },
    portal: {
      caption: t('screenshots.portal.caption') || 'Resident Hub',
      desc:
        t('screenshots.portal.desc') ||
        'Empower your community. Residents can generate passes and track arrival logs.',
      icon: <LayoutDashboard size={16} />,
      illustration: <PortalIllustration />,
      isMobile: false,
    },
  };

  return (
    <section className="py-20 lg:py-32 bg-ds-surface-sunken border-y border-ds-border relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 start-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-ds-border-brand/40 to-transparent" />
      <div className="absolute bottom-0 start-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-ds-border-brand/40 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 max-w-7xl mx-auto items-start">
          {/* Column 1: Title Area (Replaces Admin Dashboard) */}
          <div className="flex flex-col pt-10 h-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-space-100 px-space-200 py-space-075 bg-ds-background-brand-subtle rounded-full border border-ds-border-brand/30 text-ds-text-brand text-[9px] font-black uppercase tracking-[0.5em] mb-8 w-fit"
            >
              <div className="w-1 h-1 rounded-full bg-ds-background-brand-bold animate-pulse" />
              {t('screenshots.badge') || 'Unified Infrastructure'}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-black tracking-tight text-ds-text-heading leading-[1.05] mb-8"
            >
              {t('screenshots.title') || 'One platform. Three powerful apps.'}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base text-ds-text-subtle font-medium leading-relaxed max-w-[280px]"
            >
              A precision-engineered ecosystem designed for the most demanding
              security perimeters in the Middle East.
            </motion.p>
          </div>

          {/* Column 2: Scanner Pro */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-full pt-10"
          >
            <MockupPanel {...panels.scanner} />
          </motion.div>

          {/* Column 3: Resident Hub + Admin Dashboard (Stacked) */}
          <div className="flex flex-col gap-12 lg:gap-16 pt-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <MockupPanel {...panels.portal} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative group p-px rounded-[26px] bg-gradient-to-br from-ds-border-brand/40 to-transparent"
            >
              {/* Individual Glow Aura for Dash */}
              <div className="absolute inset-x-0 -top-8 h-40 bg-ds-background-brand-bold/10 blur-[60px] rounded-full scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <MockupPanel {...panels.dashboard} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
