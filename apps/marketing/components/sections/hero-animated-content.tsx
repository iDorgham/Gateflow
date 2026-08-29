'use client';

import * as React from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Button } from '@gateflow/ui';
import { IntentLink } from '../intent-link';
import type { Locale } from '../../i18n-config';
import {
  ArrowRight,
  Shield,
  ShieldCheck,
  Wifi,
  CheckCircle2,
  UserCheck,
  LayoutDashboard,
  Activity,
  Lock,
  Home,
  TrendingUp,
  QrCode,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { useTranslation } from '../../hooks/use-translation';
import { AntigravityBackground } from '../antigravity-background';

/* ─── Constants ───────────────────────────────────────────────────────────── */
const SPRING = {
  type: 'spring',
  stiffness: 170,
  damping: 22,
  mass: 1.0,
} as const;

/* ─── Reusable Device Frames ──────────────────────────────────────────────── */

function PhoneFrame({
  children,
  width = 300,
  className = '',
  style = {},
}: {
  children: React.ReactNode;
  width?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const h = Math.round(width * 2.08);
  const r = Math.round(width * 0.14);

  return (
    <div
      className={`relative flex-shrink-0 select-none ${className}`}
      style={{ width, height: h, ...style }}
    >
      {/* SVG bezel hardware */}
      <svg
        viewBox={`0 0 ${width} ${h}`}
        className="absolute inset-0 w-full h-full drop-shadow-2xl"
        fill="none"
      >
        {/* Outer Phone Border & Glass */}
        <rect
          x="1"
          y="1"
          width={width - 2}
          height={h - 2}
          rx={r}
          fill="var(--ds-surface-overlay, #16181D)"
          stroke="var(--ds-border-bold, #2E333D)"
          strokeWidth="2"
        />
        {/* Inner Screen Bezel */}
        <rect
          x="6"
          y="6"
          width={width - 12}
          height={h - 12}
          rx={r - 4}
          fill="var(--ds-surface-sunken, #0E1015)"
        />
        {/* Dynamic Island / Notch */}
        <rect
          x={width / 2 - 28}
          y="14"
          width="56"
          height="13"
          rx="6.5"
          fill="var(--ds-surface-overlay, #1B1E26)"
        />
        {/* Hardware side buttons */}
        <rect
          x="0"
          y={h * 0.2}
          width="3.5"
          height={h * 0.055}
          rx="1.5"
          fill="var(--ds-border-bold, #3A3F4D)"
        />
        <rect
          x="0"
          y={h * 0.28}
          width="3.5"
          height={h * 0.055}
          rx="1.5"
          fill="var(--ds-border-bold, #3A3F4D)"
        />
        <rect
          x={width - 3.5}
          y={h * 0.24}
          width="3.5"
          height={h * 0.08}
          rx="1.5"
          fill="var(--ds-border-bold, #3A3F4D)"
        />
        {/* Bottom Home Indicator */}
        <rect
          x={width / 2 - 28}
          y={h - 14}
          width="56"
          height="4"
          rx="2"
          fill="var(--ds-text, #FFFFFF)"
          opacity="0.25"
        />
      </svg>

      {/* Screen Content Area */}
      <div className="absolute inset-[8px] overflow-hidden rounded-[34px] bg-ds-surface flex flex-col justify-between">
        {/* Status Bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 bg-ds-surface-sunken/90 backdrop-blur-sm z-20">
          <span className="text-ds-text font-bold text-[10px] tracking-tight">
            9:41
          </span>
          <div className="flex items-center gap-1.5">
            <Wifi size={10} className="text-ds-text-subtle" />
            <div className="flex gap-[1.5px] items-end">
              {[4, 6, 8, 10].map((barH, i) => (
                <div
                  key={i}
                  className={`w-[2.5px] rounded-full ${i < 3 ? 'bg-ds-text' : 'bg-ds-border-bold'}`}
                  style={{ height: barH }}
                />
              ))}
            </div>
            <div className="w-5 h-2.5 rounded-[3px] border border-ds-border-bold flex items-center p-[1px] ms-1">
              <div className="w-3/4 h-full rounded-[1.5px] bg-ds-background-success-bold" />
            </div>
          </div>
        </div>

        {/* Child Mockup Body */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
}

function LaptopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full select-none max-w-[720px] mx-auto">
      {/* Screen bezel */}
      <div
        className="relative rounded-t-2xl overflow-hidden border-2 border-ds-border-bold bg-ds-surface-sunken"
        style={{
          boxShadow: 'var(--ds-shadow-deep, 0 20px 40px rgba(0,0,0,0.4))',
        }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-ds-border bg-ds-surface-raised">
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-ds-background-danger-bold opacity-80 hover:opacity-100" />
            <div className="w-3 h-3 rounded-full bg-ds-background-warning-bold opacity-80 hover:opacity-100" />
            <div className="w-3 h-3 rounded-full bg-ds-background-success-bold opacity-80 hover:opacity-100" />
          </div>
          {/* URL bar */}
          <div className="flex-1 mx-2 overflow-hidden px-3 py-1 rounded-lg text-ds-text-subtle text-[10px] font-medium flex items-center gap-2 border border-ds-border bg-ds-surface">
            <div className="w-4 h-4 flex-shrink-0 rounded-[4px] bg-ds-background-brand-bold text-white flex items-center justify-center text-[8px] font-black leading-none shadow-sm">
              G
            </div>
            <Lock size={9} className="text-ds-text-success flex-shrink-0" />
            <span
              dir="ltr"
              className="truncate tracking-tight font-mono text-[9px] select-all"
            >
              https://app.gateflow.site/admin
            </span>
          </div>
          {/* Refresh icon */}
          <div className="w-4 h-4 rounded-sm border border-ds-border flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 border border-ds-border-bold rounded-full border-t-transparent animate-spin" />
          </div>
        </div>
        {children}
      </div>
      {/* Laptop hinge */}
      <div className="h-2.5 rounded-b-lg border-2 border-t-0 border-ds-border-bold bg-ds-surface-sunken" />
      {/* Laptop base */}
      <div className="mx-8 h-2 rounded-b-2xl shadow-2xl bg-ds-surface-overlay" />
    </div>
  );
}

/* ─── Artwork 1: Gate Scanner (Phone + floating badges) ───────────────────── */
function ScannerArtwork({ isRtl }: { isRtl: boolean }) {
  const { t } = useTranslation('landing');
  const [granted, setGranted] = React.useState(false);

  React.useEffect(() => {
    const t1 = setTimeout(() => setGranted(true), 2800);
    const t2 = setTimeout(() => setGranted(false), 5600);
    const loop = setInterval(() => {
      setGranted(false);
      setTimeout(() => setGranted(true), 2800);
    }, 6000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(loop);
    };
  }, []);

  const log = [
    {
      name: t('hero.mockups.scanner.log1Name'),
      gate: t('hero.mockups.scanner.log1Gate'),
      ok: true,
      time: isRtl ? '٢ ث' : '2s',
    },
    {
      name: t('hero.mockups.scanner.log2Name'),
      gate: t('hero.mockups.scanner.log2Gate'),
      ok: true,
      time: isRtl ? '١ د' : '1m',
    },
    {
      name: t('hero.mockups.scanner.log3Name'),
      gate: t('hero.mockups.scanner.log3Gate'),
      ok: false,
      time: isRtl ? '٣ د' : '3m',
    },
  ];

  return (
    <div className="relative mx-auto flex items-center justify-center py-2">
      <PhoneFrame
        width={290}
        className="relative z-20"
        style={{
          boxShadow: 'var(--ds-shadow-overlay, 0 16px 32px rgba(0,0,0,0.35))',
        }}
      >
        {/* App Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ds-border bg-ds-surface">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-ds-background-brand-subtle flex items-center justify-center">
              <QrCode size={13} className="text-ds-text-brand" />
            </div>
            <span className="text-ds-text-heading text-[11px] font-black uppercase tracking-wider">
              {t('hero.mockups.scanner.appName')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-ds-background-success-subtle border border-ds-border-success">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-ds-background-success-bold"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span className="text-ds-text-success text-[8px] font-black tracking-wider">
              {t('hero.mockups.scanner.live')}
            </span>
          </div>
        </div>

        {/* Viewfinder Area */}
        <div
          className="relative mx-3.5 mt-3 rounded-2xl overflow-hidden flex-shrink-0 bg-ds-surface-sunken border border-ds-border-bold"
          style={{ aspectRatio: '1.05' }}
        >
          <AnimatePresence mode="wait">
            {!granted ? (
              <motion.div
                key="scan"
                className="absolute inset-0 flex flex-col items-center justify-center bg-ds-surface-sunken"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Corner guide brackets */}
                {[
                  'top-3 start-3 border-t-2 border-s-2',
                  'top-3 end-3 border-t-2 border-e-2',
                  'bottom-3 start-3 border-b-2 border-s-2',
                  'bottom-3 end-3 border-b-2 border-e-2',
                ].map((cls, i) => (
                  <div
                    key={i}
                    className={`absolute w-6 h-6 rounded-sm ${cls} border-ds-border-brand`}
                  />
                ))}

                {/* Laser scan beam */}
                <motion.div
                  className="absolute inset-x-6 h-0.5 rounded-full bg-ds-background-brand-bold shadow-[0_0_12px_var(--ds-background-brand-bold)]"
                  animate={{ y: [-36, 36, -36] }}
                  transition={{
                    duration: 2.0,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Simulated QR block matrix */}
                <div className="grid grid-cols-3 gap-1.5 opacity-25 w-16 h-16">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-[3px] bg-ds-text-heading"
                      style={{
                        opacity: [0, 2, 6, 8].includes(i)
                          ? 1
                          : i === 4
                            ? 0.2
                            : 0.5,
                      }}
                    />
                  ))}
                </div>

                <p className="text-ds-text-subtle text-[9px] font-bold mt-3.5 uppercase tracking-wider text-center px-4">
                  {t('hero.mockups.scanner.alignQr')}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="ok"
                className="absolute inset-0 flex flex-col items-center justify-center bg-ds-background-success-subtle/80"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -25 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ ...SPRING, delay: 0.05 }}
                >
                  <CheckCircle2
                    size={46}
                    className="text-ds-text-success mb-2 drop-shadow-md"
                  />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-ds-text-success text-[14px] font-black uppercase tracking-wider"
                >
                  {t('hero.mockups.scanner.granted')}
                </motion.p>
                <p className="text-ds-text-success text-[9.5px] font-bold mt-1 opacity-80 text-center px-4">
                  {t('hero.mockups.scanner.gateLocation')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scan Activity Log */}
        <div className="px-3.5 py-3 space-y-2 flex-1 bg-ds-surface">
          {log.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="flex items-center justify-between px-3 py-2 rounded-xl border border-ds-border bg-ds-surface-raised shadow-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    item.ok
                      ? 'bg-ds-background-success-bold'
                      : 'bg-ds-background-danger-bold'
                  }`}
                />
                <span className="text-ds-text-heading text-[10px] font-bold truncate">
                  {item.name}
                </span>
                <span className="text-ds-text-subtle text-[9px] flex-shrink-0">
                  · {item.gate}
                </span>
              </div>
              <span
                className={`text-[8.5px] font-black px-2 py-0.5 rounded-md flex-shrink-0 ${
                  item.ok
                    ? 'text-ds-text-success bg-ds-background-success-subtle border border-ds-border-success'
                    : 'text-ds-text-danger bg-ds-background-danger-subtle border border-ds-border-danger'
                }`}
              >
                {item.ok
                  ? t('hero.mockups.scanner.statusGranted')
                  : t('hero.mockups.scanner.statusBlocked')}
              </span>
            </motion.div>
          ))}
        </div>
      </PhoneFrame>

      {/* Floating Compound Badge (Top-Start) */}
      <motion.div
        initial={{ opacity: 0, y: -16, x: isRtl ? 20 : -20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 0.6, ...SPRING }}
        className="absolute top-6 -start-4 sm:-start-8 z-30 rounded-2xl px-4 py-3 flex items-center gap-3 border border-ds-border-bold bg-ds-surface-raised/95 backdrop-blur-md shadow-xl"
      >
        <div className="w-8 h-8 rounded-xl bg-ds-background-brand-subtle flex items-center justify-center text-ds-text-brand border border-ds-border-brand/30">
          <Home size={15} />
        </div>
        <div>
          <p className="text-[13px] font-black text-ds-text-heading leading-tight">
            {t('hero.mockups.scanner.compoundName')}
          </p>
          <p className="text-[8.5px] font-bold text-ds-text-subtle uppercase tracking-wider">
            {t('hero.mockups.scanner.compoundRole')}
          </p>
        </div>
      </motion.div>

      {/* Floating Scans Stat Card (Bottom-End) */}
      <motion.div
        initial={{ opacity: 0, y: 20, x: isRtl ? -30 : 30 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 0.8, ...SPRING }}
        className="absolute bottom-6 -end-4 sm:-end-8 z-30 rounded-2xl p-4 min-w-[170px] border border-ds-border-bold bg-ds-surface-raised/95 backdrop-blur-md shadow-xl"
      >
        <div className="flex items-center gap-3 mb-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-ds-background-brand-bold shadow-md">
            <Activity size={16} className="text-white" />
          </div>
          <div>
            <div className="text-[20px] font-black text-ds-text-heading leading-none">
              1,247
            </div>
            <div className="text-[8.5px] text-ds-text-subtle font-bold uppercase tracking-wider mt-0.5">
              {t('hero.mockups.scanner.scansToday')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 pt-1 border-t border-ds-border">
          <TrendingUp
            size={12}
            className="text-ds-text-success rtl:-scale-x-100 flex-shrink-0"
          />
          <span className="text-[9.5px] font-black text-ds-text-success">
            {t('hero.mockups.scanner.scansGrowth')}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Artwork 2: Visitor Permission (Phone centered) ──────────────────────── */
function VisitorArtwork({ isRtl }: { isRtl: boolean }) {
  const { t } = useTranslation('landing');

  const steps = [
    { label: t('hero.mockups.visitor.stepVerify'), done: true },
    { label: t('hero.mockups.visitor.stepQuota'), done: true },
    { label: t('hero.mockups.visitor.stepNotify'), done: false },
  ];

  return (
    <div className="relative mx-auto flex items-center justify-center py-2">
      <PhoneFrame
        width={290}
        className="relative z-20"
        style={{
          boxShadow: 'var(--ds-shadow-overlay, 0 16px 32px rgba(0,0,0,0.35))',
        }}
      >
        {/* App Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ds-border bg-ds-surface">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-ds-background-brand-bold">
              <UserCheck size={13} className="text-white" />
            </div>
            <span className="text-ds-text-heading text-[11px] font-black">
              {t('hero.mockups.visitor.title')}
            </span>
          </div>
          <motion.div
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-ds-border-warning bg-ds-background-warning-subtle"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-ds-background-warning-bold" />
            <span className="text-ds-text-warning text-[8px] font-black tracking-widest">
              {t('hero.mockups.visitor.pending')}
            </span>
          </motion.div>
        </div>

        {/* Visitor Info Card */}
        <div className="px-3.5 pt-3 bg-ds-surface">
          <div className="rounded-2xl p-3 flex items-center gap-3 border border-ds-border bg-ds-surface-raised shadow-sm">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-[16px] font-black flex-shrink-0 shadow-sm"
              style={{ background: 'var(--ds-background-brand-bold, #E34935)' }}
            >
              أ
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-ds-text-heading text-[13px] font-black truncate">
                {t('hero.mockups.visitor.guestName')}
              </div>
              <div className="text-ds-text-subtle text-[9.5px] font-semibold flex items-center gap-1.5 mt-0.5">
                <span dir="ltr" className="font-mono">
                  {t('hero.mockups.visitor.guestPhone')}
                </span>
                <span>·</span>
                <span>{t('hero.mockups.visitor.guestUnit')}</span>
              </div>
            </div>
            <motion.div
              className="w-2 h-2 rounded-full bg-ds-background-warning-bold flex-shrink-0"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Destination & Time Selectors */}
        <div className="px-3.5 pt-2.5 space-y-1.5 bg-ds-surface">
          {[
            {
              label: t('hero.mockups.visitor.gateLabel'),
              value: t('hero.mockups.visitor.gateValue'),
            },
            {
              label: t('hero.mockups.visitor.durationLabel'),
              value: t('hero.mockups.visitor.durationValue'),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between px-3 py-2 rounded-xl border border-ds-border bg-ds-surface-sunken"
            >
              <span className="text-ds-text-subtle text-[9.5px] font-semibold">
                {label}
              </span>
              <div className="flex items-center gap-1 text-ds-text-heading text-[9.5px] font-black">
                <span>{value}</span>
                {isRtl ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
              </div>
            </div>
          ))}
        </div>

        {/* Security Checklist Steps */}
        <div className="px-3.5 pt-2.5 space-y-1.5 bg-ds-surface">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.12 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                s.done
                  ? 'bg-ds-background-success-subtle border-ds-border-success'
                  : 'bg-ds-surface-sunken border-ds-border'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                  s.done
                    ? 'bg-ds-background-success-bold text-white'
                    : 'bg-ds-surface border border-ds-border-bold'
                }`}
              >
                {s.done && <CheckCircle2 size={11} />}
              </div>
              <span
                className={`text-[9.5px] font-bold ${
                  s.done ? 'text-ds-text-success' : 'text-ds-text-subtle'
                }`}
              >
                {s.label}
              </span>
              {i === steps.length - 1 && (
                <motion.span
                  className="ms-auto text-[7.5px] font-black uppercase tracking-wider text-ds-text-warning bg-ds-background-warning-subtle px-1.5 py-0.5 rounded"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {t('hero.mockups.visitor.sending')}
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Actions */}
        <div className="px-3.5 pt-3 pb-3 space-y-2 bg-ds-surface mt-auto">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 bg-ds-background-brand-bold shadow-md hover:shadow-lg transition-all"
          >
            <ShieldCheck size={14} />
            {t('hero.mockups.visitor.grantCta')}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 rounded-xl text-[10px] font-bold border border-ds-border bg-ds-surface-raised text-ds-text-subtle hover:bg-ds-surface-sunken transition-colors"
          >
            {t('hero.mockups.visitor.denyCta')}
          </motion.button>
        </div>
      </PhoneFrame>
    </div>
  );
}

/* ─── Artwork 3: Analytics Dashboard (Laptop) ─────────────────────────────── */
function AnalyticsArtwork({ isRtl }: { isRtl: boolean }) {
  const { t } = useTranslation('landing');

  return (
    <div className="w-full max-w-[700px] mx-auto py-2">
      <LaptopFrame>
        <div className="px-5 py-4 bg-ds-surface min-h-[380px] flex flex-col justify-between">
          {/* Dashboard Header Bar */}
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-ds-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-ds-background-brand-bold text-white shadow-sm">
                <LayoutDashboard size={14} />
              </div>
              <span className="text-ds-text-heading text-[11px] font-black uppercase tracking-wider">
                {t('hero.mockups.hub.title')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-ds-border-success bg-ds-background-success-subtle">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-ds-background-success-bold"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span className="text-ds-text-success text-[8.5px] font-black uppercase tracking-wider">
                {t('hero.mockups.hub.allSystemsLive')}
              </span>
            </div>
          </div>

          {/* Metric Tiles */}
          <div className="grid grid-cols-4 gap-2 mb-3.5">
            <div className="rounded-xl p-2.5 border border-ds-border-success bg-ds-background-success-subtle">
              <Shield size={12} className="mb-1 text-ds-text-success" />
              <div className="text-[16px] font-black leading-none text-ds-text-success mb-1">
                14/15
              </div>
              <div className="text-[7.5px] font-bold uppercase tracking-wider text-ds-text-success opacity-80 truncate">
                {t('hero.mockups.hub.activeGates')}
              </div>
            </div>

            <div className="rounded-xl p-2.5 border border-ds-border-brand bg-ds-background-brand-subtle">
              <Activity size={12} className="mb-1 text-ds-text-brand" />
              <div className="text-[16px] font-black leading-none text-ds-text-brand mb-1">
                1,247
              </div>
              <div className="text-[7.5px] font-bold uppercase tracking-wider text-ds-text-brand opacity-80 truncate">
                {t('hero.mockups.hub.scansCount')}
              </div>
            </div>

            <div className="rounded-xl p-2.5 border border-ds-border-danger bg-ds-background-danger-subtle">
              <Lock size={12} className="mb-1 text-ds-text-danger" />
              <div className="text-[16px] font-black leading-none text-ds-text-danger mb-1">
                3
              </div>
              <div className="text-[7.5px] font-bold uppercase tracking-wider text-ds-text-danger opacity-80 truncate">
                {t('hero.mockups.hub.blockedCount')}
              </div>
            </div>

            <div className="rounded-xl p-2.5 border border-ds-border-information bg-ds-background-information-subtle">
              <TrendingUp size={12} className="mb-1 text-ds-text-information" />
              <div className="text-[16px] font-black leading-none text-ds-text-information mb-1">
                99.9%
              </div>
              <div className="text-[7.5px] font-bold uppercase tracking-wider text-ds-text-information opacity-80 truncate">
                {t('hero.mockups.hub.uptime')}
              </div>
            </div>
          </div>

          {/* Center: Traffic Chart & Live Access Feed */}
          <div className="grid grid-cols-5 gap-2.5 mb-3">
            {/* Realtime Traffic Curve */}
            <div className="col-span-3 rounded-xl p-3 border border-ds-border bg-ds-surface-raised shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-ds-text-subtle text-[8.5px] font-black uppercase tracking-widest">
                  {t('hero.mockups.hub.trafficFlow')}
                </span>
                <span className="text-[7px] font-bold text-ds-text-brand bg-ds-background-brand-subtle px-1.5 py-0.5 rounded">
                  LIVE
                </span>
              </div>
              <div className="relative h-14 w-full flex items-end">
                <svg
                  className="absolute inset-0 w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 40"
                >
                  <defs>
                    <linearGradient id="hubGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--ds-background-brand-bold, #E34935)"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--ds-background-brand-bold, #E34935)"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 35 Q 15 25 30 30 T 60 15 T 85 6 L 100 18 L 100 40 L 0 40 Z"
                    fill="url(#hubGlow)"
                  />
                  <path
                    d="M0 35 Q 15 25 30 30 T 60 15 T 85 6 L 100 18"
                    fill="none"
                    stroke="var(--ds-background-brand-bold, #E34935)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="85"
                    cy="6"
                    r="2.5"
                    fill="var(--ds-background-brand-bold, #E34935)"
                    className="animate-pulse"
                  />
                </svg>
              </div>
              <div className="flex justify-between mt-2 text-[7px] font-bold text-ds-text-subtle">
                <span>06:00</span>
                <span>12:00</span>
                <span>{t('hero.mockups.hub.now')}</span>
              </div>
            </div>

            {/* Access Feed Log */}
            <div className="col-span-2 rounded-xl p-3 border border-ds-border bg-ds-surface-raised shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-ds-text-subtle text-[8.5px] font-black uppercase tracking-widest">
                  {t('hero.mockups.hub.accessLog')}
                </span>
              </div>
              <div className="space-y-1.5">
                {[
                  {
                    name: isRtl ? 'بوابة أ / أحمد' : 'Gate A / Ahmed',
                    status: 'GRANTED',
                    ok: true,
                  },
                  {
                    name: isRtl ? 'بوابة ج / زائر' : 'Gate C / Guest',
                    status: 'BLOCKED',
                    ok: false,
                  },
                  {
                    name: isRtl ? 'بوابة ب / سارة' : 'Gate B / Sara',
                    status: 'GRANTED',
                    ok: true,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-ds-surface p-1.5 rounded-lg border border-ds-border text-[7.5px]"
                  >
                    <div className="flex items-center gap-1 truncate">
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          item.ok
                            ? 'bg-ds-background-success-bold'
                            : 'bg-ds-background-danger-bold'
                        }`}
                      />
                      <span className="text-ds-text-subtle font-bold truncate">
                        {item.name}
                      </span>
                    </div>
                    <span
                      className={`font-black px-1 py-0.5 rounded text-[6.5px] ${
                        item.ok
                          ? 'text-ds-text-success bg-ds-background-success-subtle'
                          : 'text-ds-text-danger bg-ds-background-danger-subtle'
                      }`}
                    >
                      {item.ok
                        ? t('hero.mockups.scanner.statusGranted')
                        : t('hero.mockups.scanner.statusBlocked')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: Hardware Connectivity & Incident Alert */}
          <div className="space-y-2">
            <div className="rounded-xl p-2.5 border border-ds-border bg-ds-surface-raised shadow-sm">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-ds-text-subtle text-[8px] font-black uppercase tracking-widest">
                  {t('hero.mockups.hub.devicesOnline')}
                </span>
                <span className="text-[7.5px] font-bold text-ds-text-success">
                  {t('hero.mockups.hub.hardwareUptime')}
                </span>
              </div>
              <div className="flex gap-1">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-[1.5px] ${
                      i === 11
                        ? 'bg-ds-background-danger-bold opacity-90'
                        : 'bg-ds-background-success-bold opacity-90'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl px-3 py-2 border border-ds-border-warning bg-ds-background-warning-subtle text-[8px]">
              <div className="flex gap-2 items-center">
                <AlertTriangle
                  size={11}
                  className="text-ds-text-warning flex-shrink-0"
                />
                <span className="font-bold text-ds-text-warning">
                  {t('hero.mockups.hub.recentAlert')}
                </span>
              </div>
              <span className="font-bold text-ds-text-warning opacity-75">
                {t('hero.mockups.hub.timeAgo')}
              </span>
            </div>
          </div>
        </div>
      </LaptopFrame>
    </div>
  );
}

/* ─── Main Hero Component ─────────────────────────────────────────────────── */
interface HeroSlide {
  id: 'security' | 'permission' | 'hub';
  slideLabel: string;
  artwork: React.ReactNode;
}

export function HeroAnimatedContent({ locale }: { locale: Locale }) {
  const { t } = useTranslation('landing');
  const isRtl = locale.startsWith('ar');
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const containerRef = React.useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 600], [0, -60]);

  const slides: HeroSlide[] = [
    {
      id: 'security',
      slideLabel: t('hero.mockups.slidesLabels.scanner'),
      artwork: <ScannerArtwork isRtl={isRtl} />,
    },
    {
      id: 'permission',
      slideLabel: t('hero.mockups.slidesLabels.visitor'),
      artwork: <VisitorArtwork isRtl={isRtl} />,
    },
    {
      id: 'hub',
      slideLabel: t('hero.mockups.slidesLabels.hub'),
      artwork: <AnalyticsArtwork isRtl={isRtl} />,
    },
  ];

  React.useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % slides.length),
      8000
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section
      ref={containerRef}
      className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-ds-surface min-h-[calc(100dvh-5rem)] flex flex-col justify-center overflow-hidden"
    >
      {/* ── Backgrounds & Atmospheric Glow ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AntigravityBackground />
        <div
          className="absolute inset-0 -z-10 bg-ds-background-brand-bold opacity-[0.03]"
          style={{
            maskImage:
              'radial-gradient(ellipse 80% 60% at 50% -10%, black, transparent)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 60% at 50% -10%, black, transparent)',
          }}
        />
        <motion.div
          style={{ y: yParallax }}
          className="absolute top-10 end-0 -z-10 w-[500px] h-[500px] bg-ds-selected/20 blur-[130px] rounded-full translate-x-1/3 -translate-y-1/4 rtl:-translate-x-1/3"
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.35] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, var(--ds-border) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="w-full max-w-[1536px] px-4 lg:px-8 xl:px-12 mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-center">
          {/* ── Left Column: Copy & Actions ── */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col items-start">
            {/* Trust Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-ds-background-brand-subtle text-ds-text-brand text-[11px] font-black tracking-wider uppercase mb-6 border border-ds-border-brand/30 shadow-sm">
              <Shield size={14} className="fill-current/20" />
              <span>{t('trust.badge')}</span>
            </div>

            {/* Slide Headline & Description */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.08] mb-5 tracking-tight text-ds-text-heading">
                  <span className="block mb-1.5 text-ds-text-heading">
                    {t(`hero.slides.${slide.id}.title`)}
                  </span>
                  <span className="block text-ds-text-brand">
                    {t(`hero.slides.${slide.id}.suffix`)}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-ds-text-subtle font-medium leading-relaxed mb-8 max-w-xl">
                  {t(`hero.slides.${slide.id}.subHeadline`)}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10 w-full sm:w-auto">
              <IntentLink
                locale={locale}
                href="/contact"
                intent="demo"
                surface="home_hero_primary"
              >
                <Button
                  variant="brand"
                  size="lg"
                  className="h-14 px-8 text-[13px] font-black uppercase tracking-wider min-w-[200px] group shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-white"
                >
                  <span>{t('hero.primaryCta')}</span>
                  <ArrowRight className="ms-2.5 h-4 w-4 rtl:-scale-x-100 group-hover:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform" />
                </Button>
              </IntentLink>
              <IntentLink
                locale={locale}
                href="/solutions"
                intent="consult"
                surface="home_hero_secondary"
              >
                <Button
                  variant="subtle"
                  size="lg"
                  className="h-14 px-8 text-[13px] font-black uppercase tracking-wider border border-ds-border hover:border-ds-border-bold bg-ds-surface-raised hover:bg-ds-surface"
                >
                  {t('hero.secondaryCta')}
                </Button>
              </IntentLink>
            </div>

            {/* Slide Navigation Indicator Pills */}
            <div
              className="flex items-center gap-3 pt-2"
              role="tablist"
              aria-label="Hero showcase switcher"
            >
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(i)}
                  className="group flex flex-col gap-1.5 focus:outline-none py-1"
                  role="tab"
                  aria-selected={i === currentSlide}
                  aria-label={`Slide ${i + 1}: ${s.slideLabel}`}
                >
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 overflow-hidden ${
                      i === currentSlide
                        ? 'w-20 bg-ds-background-brand-bold shadow-sm'
                        : 'w-8 bg-ds-border-bold group-hover:bg-ds-border-brand'
                    }`}
                  >
                    {i === currentSlide && (
                      <motion.div
                        className="h-full bg-white/40"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 8, ease: 'linear' }}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider transition-all ${
                      i === currentSlide
                        ? 'text-ds-text-brand opacity-100'
                        : 'text-ds-text-subtle opacity-60 group-hover:opacity-100'
                    }`}
                  >
                    {s.slideLabel}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Right Column: Device Artwork ── */}
          <div className="lg:col-span-12 xl:col-span-7 relative flex items-center justify-center min-h-[540px] lg:min-h-[580px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -20 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-20 w-full flex items-center justify-center"
              >
                {slide.artwork}
              </motion.div>
            </AnimatePresence>

            {/* Radial glow background */}
            <div
              className="absolute inset-0 -z-10 pointer-events-none bg-ds-background-brand-bold opacity-10"
              style={{
                maskImage:
                  'radial-gradient(circle at center, black, transparent 70%)',
                WebkitMaskImage:
                  'radial-gradient(circle at center, black, transparent 70%)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
