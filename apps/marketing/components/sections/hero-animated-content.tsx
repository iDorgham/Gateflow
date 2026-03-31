'use client';

import * as React from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Button } from '@gate-access/ui';
import { IntentLink } from '../intent-link';
import type { Locale } from '../../i18n-config';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Home,
  Shield,
  UserCheck,
  LayoutDashboard,
  Activity,
  Lock,
} from 'lucide-react';
import { useTranslation } from '../../hooks/use-translation';

interface HeroSlide {
  id: string;
  artwork: React.ReactNode;
}

export function HeroAnimatedContent({ locale }: { locale: Locale }) {
  const { t } = useTranslation('landing');
  const isRtl = locale.startsWith('ar');
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const containerRef = React.useRef(null);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, -100]);

  const slides: HeroSlide[] = [
    {
      id: 'security',
      artwork: (
        <div className="relative z-20 w-[320px] sm:w-[380px] aspect-[4/5] bg-ds-surface border border-ds-border-bold shadow-[0_64px_128px_rgba(9,30,66,0.22)] rounded-3xl p-8 sm:p-10 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-8">
            <div className="flex flex-col">
              <div className="text-[12px] font-black uppercase tracking-[0.3em] text-ds-text-subtlest mb-2">
                System Core v.9.4
              </div>
              <div className="text-lg font-black text-ds-text-heading tracking-tight">
                GateFlow Digital Pass
              </div>
            </div>
            <div className="p-3 bg-ds-background-brand-subtle rounded-xl text-ds-text-brand">
              <ShieldCheck size={28} />
            </div>
          </div>

          <div className="w-full h-1.5 bg-ds-surface-sunken rounded-full mb-10 relative overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="absolute top-0 start-0 h-full bg-ds-background-brand-bold shadow-[0_0_12px_rgba(var(--ds-background-brand-bold),0.6)]" 
            />
          </div>

          <div className="w-full grid grid-cols-2 gap-5 mb-10">
            <div className="p-4 bg-ds-surface-sunken rounded-2xl border border-ds-border">
              <div className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle mb-2">Gate ID</div>
              <div className="text-[15px] font-black text-ds-text-heading">GH-904-B</div>
            </div>
            <div className="p-4 bg-ds-surface-sunken rounded-2xl border border-ds-border">
              <div className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle mb-2">Expiry</div>
              <div className="text-[15px] font-black text-ds-text-heading">24H 00M</div>
            </div>
          </div>

          <div className="w-full aspect-square bg-white rounded-2xl p-6 shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-ds-border mb-10 flex items-center justify-center relative group overflow-hidden">
            <QrCode className="w-full h-full text-ds-text-heading" strokeWidth={1} />
            <motion.div 
              className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-ds-background-brand-bold/10 to-transparent"
              animate={{ top: ['-50%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="w-full bg-ds-background-success-subtle/40 backdrop-blur-sm text-ds-text-success py-4 px-6 rounded-2xl flex justify-between items-center border border-ds-border-success">
            <div className="flex items-center gap-3 font-black text-[14px] uppercase tracking-[0.2em]">
              <CheckCircle2 className="w-5 h-5" />
              {isRtl ? 'تصريح ساري' : 'Verified'}
            </div>
            <div className="text-[11px] bg-ds-text-success text-white px-3 py-1 rounded-md font-black">
              ACTIVE
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'permission',
      artwork: (
        <div className="relative z-20 w-[320px] sm:w-[380px] aspect-[4/5] bg-ds-surface border border-ds-border-bold shadow-[0_64px_128px_rgba(9,30,66,0.22)] rounded-3xl p-10 flex flex-col">
          <div className="flex items-center gap-5 mb-12">
            <div className="w-16 h-16 rounded-2xl bg-ds-background-brand-subtle flex items-center justify-center text-ds-text-brand shadow-md">
              <UserCheck size={32} />
            </div>
            <div>
              <div className="text-xl font-black text-ds-text-heading">Resident Approval</div>
              <div className="text-[12px] uppercase font-black tracking-[0.2em] text-ds-text-subtlest mt-1">Real-time Auth</div>
            </div>
          </div>

          <div className="space-y-5 mb-12">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15, ease: "backOut" }}
                className="p-5 rounded-2xl bg-ds-surface-sunken border border-ds-border flex items-center justify-between group-hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-ds-success-bold shadow-[0_0_8px_rgba(var(--ds-background-success-bold),0.5)]' : 'bg-ds-border-bold'}`} />
                  <div className="text-[14px] font-black text-ds-text-subtle">
                    {i === 1 ? 'Verify Identity' : i === 2 ? 'Check Slot Quota' : 'Grant Permisson'}
                  </div>
                </div>
                {i === 1 && <CheckCircle2 size={20} className="text-ds-text-success" />}
              </motion.div>
            ))}
          </div>

          <Button className="w-full h-16 text-lg font-black uppercase tracking-[0.2em] bg-ds-background-brand-bold hover:bg-ds-background-brand-bold-hovered border-none shadow-[0_8px_24px_rgba(var(--ds-background-brand-bold),0.3)] mt-auto">
            Approve Access
          </Button>
        </div>
      )
    },
    {
      id: 'hub',
      artwork: (
        <div className="relative z-20 w-[340px] sm:w-[400px] aspect-[4/5] bg-ds-surface border border-ds-border-bold shadow-[0_64px_128px_rgba(9,30,66,0.22)] rounded-3xl p-6 sm:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8 p-3 bg-ds-surface-sunken rounded-2xl border border-ds-border">
            <div className="flex items-center gap-4">
              <LayoutDashboard size={22} className="text-ds-text-brand" />
              <span className="text-[14px] font-black uppercase tracking-[0.3em] text-ds-text-heading">Global Hub</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-1.5 bg-ds-background-success-subtle rounded-full border border-ds-border-success">
              <div className="w-2.5 h-2.5 rounded-full bg-ds-success-bold animate-pulse" />
              <span className="text-[11px] font-black text-ds-text-success tracking-widest leading-none">LIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { label: 'Today Scans', value: '1.2k', icon: Activity, color: 'text-ds-text-brand' },
              { label: 'Active Gates', value: '14/15', icon: Shield, color: 'text-ds-text-success' },
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-2xl bg-ds-surface-sunken border border-ds-border relative overflow-hidden group">
                <div className="absolute top-0 start-0 w-1 h-full bg-ds-background-brand-bold opacity-0 group-hover:opacity-100 transition-opacity" />
                <stat.icon size={22} className={`${stat.color} mb-3`} />
                <div className="text-[28px] font-black text-ds-text-heading tracking-tighter leading-none mb-2">{stat.value}</div>
                <div className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtlest">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-auto p-6 rounded-2xl bg-ds-text-heading text-white shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="flex justify-between items-center mb-5">
              <span className="text-[12px] font-black uppercase tracking-[0.3em] text-white/40">Latest Grant</span>
              <div className="p-2 bg-white/10 rounded-lg">
                <Lock size={16} className="text-ds-text-brand" />
              </div>
            </div>
            <div className="text-xl font-black mb-1.5 tracking-tight">Ahmed V-42</div>
            <div className="text-[12px] text-white/50 font-black uppercase tracking-widest">Main Gate • 2m ago</div>
            
            <div className="mt-6 flex gap-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={`h-1 flex-grow rounded-full ${i <= 5 ? 'bg-ds-success-bold' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section ref={containerRef} className="relative overflow-hidden pt-24 pb-32 lg:pt-48 lg:pb-64 bg-ds-surface min-h-screen flex flex-col justify-center">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(var(--ds-background-brand-bold),0.08),transparent)]" />
      <motion.div 
        style={{ y: yParallax }}
        className="absolute top-0 end-0 -z-10 w-[800px] h-[800px] bg-ds-selected/30 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 rtl:-translate-x-1/2" 
      />
      
      {/* Decorative Orbits */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="w-[600px] h-[600px] border border-ds-border/10 rounded-full" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="w-[800px] h-[800px] border border-ds-border/5 rounded-full" />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }} className="w-[1000px] h-[1000px] border border-ds-border/[0.02] rounded-full" />
      </div>

      <div className="container px-8 mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-20 lg:gap-32 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 flex flex-col text-center lg:text-left rtl:lg:text-right">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "backOut" }}
              className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-ds-background-brand-subtle text-ds-text-brand text-[14px] font-black tracking-[0.3em] uppercase mb-12 w-fit mx-auto lg:mx-0 shadow-sm border border-ds-border-brand/20"
            >
              <Shield size={18} fill="currentColor" fillOpacity={0.2} />
              <span>{t('trust.badge')}</span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: isRtl ? 60 : -60, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: isRtl ? -60 : 60, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="text-6xl font-black leading-[0.95] sm:text-8xl lg:text-[110px] mb-10 tracking-tighter text-ds-text-heading">
                  <span className="block mb-4">{t(`hero.slides.${slide.id}.title`)}</span>
                  <span className="text-ds-text-brand block">
                    {t(`hero.slides.${slide.id}.suffix`)}
                  </span>
                </h1>

                <p className="text-xl md:text-3xl text-ds-text-subtle font-medium leading-relaxed mb-16 max-w-2xl mx-auto lg:mx-0 h-[3.5em]">
                  {t(`hero.slides.${slide.id}.subHeadline`)}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 mb-20">
              <IntentLink locale={locale} href="/contact" intent="demo" surface="home_hero_primary">
                <Button variant="brand" size="lg" className="h-20 px-16 text-xl font-black uppercase tracking-[0.2em] min-w-[260px] group transition-all shadow-[0_20px_40px_rgba(var(--ds-background-brand-bold),0.4)] hover:-translate-y-1">
                  {t('hero.primaryCta')}
                  {isRtl ? (
                    <ArrowLeft className="ml-2 mr-4 h-7 w-7 group-hover:-translate-x-2 transition-transform" />
                  ) : (
                    <ArrowRight className="ml-4 mr-2 h-7 w-7 group-hover:translate-x-2 transition-transform" />
                  )}
                </Button>
              </IntentLink>
              <IntentLink locale={locale} href="/solutions" intent="consult" surface="home_hero_secondary">
                <Button variant="subtle" size="lg" className="h-20 px-16 text-xl font-black uppercase tracking-[0.2em] transition-all border-2 border-ds-border hover:border-ds-border-bold bg-white/5 backdrop-blur-md">
                  {t('hero.secondaryCta')}
                </Button>
              </IntentLink>
            </div>

            {/* Slide Navigation */}
            <div className="flex flex-col gap-6 lg:items-start items-center">
              <div className="flex gap-4">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(i)}
                    className="group relative flex flex-col gap-2 focus:outline-none"
                  >
                    <div className={`h-1.5 rounded-full transition-all duration-700 overflow-hidden ${
                      i === currentSlide ? 'w-24 bg-ds-background-brand-bold' : 'w-10 bg-ds-border-bold hover:bg-ds-border-brand'
                    }`}>
                      {i === currentSlide && (
                        <motion.div 
                          className="h-full bg-white/20"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 8, ease: "linear" }}
                        />
                      )}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest transition-opacity duration-500 ${
                      i === currentSlide ? 'opacity-100 text-ds-text-brand' : 'opacity-0'
                    }`}>
                      0{i + 1} • {s.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Artwork Content */}
          <div className="lg:col-span-5 relative h-[600px] lg:h-[800px] flex items-center justify-center mt-20 lg:mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.8, rotate: isRtl ? -10 : 10, y: 50 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, scale: 1.2, rotate: isRtl ? 10 : -10, y: -50 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-20"
              >
                {slide.artwork}

                {/* Advanced Parallax Elements */}
                <AnimatePresence>
                  {slide.id === 'security' && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0, y: 40, x: -40 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ delay: 0.5, duration: 1, ease: "backOut" }}
                        className="absolute -top-16 -start-24 z-40 bg-ds-surface border border-ds-border shadow-[0_32px_64px_rgba(0,0,0,0.1)] rounded-3xl p-6 flex gap-5 items-center backdrop-blur-xl bg-white/95"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-ds-background-information-subtle text-ds-text-information flex items-center justify-center shadow-inner">
                          <Home size={28} />
                        </div>
                        <div className="text-left rtl:text-right min-w-[120px]">
                          <p className="text-[15px] font-black text-ds-text-heading mb-0.5">Palm Hills</p>
                          <p className="text-[11px] font-black text-ds-text-subtlest uppercase tracking-[0.2em]">Compound Admin</p>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: -40, x: 40 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ delay: 0.7, duration: 1, ease: "backOut" }}
                        className="absolute -bottom-12 -end-20 z-40 bg-ds-text-heading text-white shadow-[0_48px_96px_rgba(var(--ds-background-brand-bold),0.25)] rounded-3xl p-6 flex gap-5 items-center border border-white/5"
                      >
                        <div className="w-12 h-12 rounded-full bg-ds-background-success-bold flex items-center justify-center shadow-lg shadow-ds-background-success-bold/50">
                          <CheckCircle2 size={24} className="text-white" />
                        </div>
                        <div className="text-start pr-4">
                          <p className="text-[16px] font-black leading-tight mb-1">Access Granted</p>
                          <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">Verified @ Gate B</p>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>

            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none -z-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--ds-background-brand-bold),0.05),transparent_70%)] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
