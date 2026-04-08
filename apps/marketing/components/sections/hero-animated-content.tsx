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
} from 'lucide-react';
import { useTranslation } from '../../hooks/use-translation';
import { AntigravityBackground } from '../antigravity-background';

/* ─── Constants ───────────────────────────────────────────────────────────── */
const SPRING = {
  type: 'spring',
  stiffness: 160,
  damping: 24,
  mass: 1.2,
} as const;

/* ─── Reusable Device Frames ──────────────────────────────────────────────── */

function PhoneFrame({
  children,
  width = 224,
  className = '',
  style = {},
}: {
  children: React.ReactNode;
  width?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const h = Math.round(width * 2.16);
  const r = Math.round(width * 0.138);

  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width, height: h, ...style }}
    >
      {/* SVG bezel - hardware stays dark regardless of theme */}
      <svg
        viewBox={`0 0 ${width} ${h}`}
        className="absolute inset-0 w-full h-full"
        fill="none"
      >
        {/* Body */}
        <rect
          x="1"
          y="1"
          width={width - 2}
          height={h - 2}
          rx={r}
          fill="var(--ds-surface-overlay)"
          stroke="var(--ds-border-bold)"
          strokeWidth="1.5"
        />
        {/* Screen glass */}
        <rect
          x="8"
          y="8"
          width={width - 16}
          height={h - 16}
          rx={r - 5}
          fill="var(--ds-surface-sunken)"
        />
        {/* Pill notch */}
        <rect
          x={width / 2 - 22}
          y="13"
          width="44"
          height="11"
          rx="5.5"
          fill="var(--ds-surface-overlay)"
        />
        {/* Volume buttons */}
        <rect
          x="0"
          y={h * 0.22}
          width="3"
          height={h * 0.06}
          rx="1.5"
          fill="var(--ds-border-bold)"
        />
        <rect
          x="0"
          y={h * 0.3}
          width="3"
          height={h * 0.06}
          rx="1.5"
          fill="var(--ds-border-bold)"
        />
        {/* Power button */}
        <rect
          x={width - 3}
          y={h * 0.28}
          width="3"
          height={h * 0.09}
          rx="1.5"
          fill="var(--ds-border-bold)"
        />
        {/* Home pill */}
        <rect
          x={width / 2 - 22}
          y={h - 13}
          width="44"
          height="4"
          rx="2"
          fill="var(--ds-text)"
          opacity="0.15"
        />
      </svg>
      {/* Content area */}
      <div
        className="absolute overflow-hidden bg-ds-surface"
        style={{
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
          borderRadius: r - 3,
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pt-5 pb-1.5 bg-ds-surface-sunken">
          <span className="text-ds-text-subtle text-[8px] font-bold">9:41</span>
          <div className="flex items-center gap-1">
            <Wifi size={7} className="text-ds-text-subtle" />
            <div className="flex gap-px items-end">
              {[3, 5, 7, 9].map((h, i) => (
                <div
                  key={i}
                  className={`w-[3px] rounded-full ${i < 3 ? 'bg-ds-text-subtle' : 'bg-ds-border-bold'}`}
                  style={{ height: h }}
                />
              ))}
            </div>
            <div className="flex items-center gap-px ms-0.5">
              <div className="w-5 h-2.5 rounded-[2px] border border-ds-border-bold flex items-center p-[1.5px]">
                <div className="w-3/4 h-full rounded-[1px] bg-ds-text-success" />
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function LaptopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full select-none">
      {/* Screen bezel */}
      <div
        className="relative rounded-t-2xl overflow-hidden border border-ds-border-bold bg-ds-surface-sunken"
        style={{ boxShadow: 'var(--ds-shadow-deep)' }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-ds-border bg-ds-surface-raised">
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-ds-background-danger-bold" />
            <div className="w-3 h-3 rounded-full bg-ds-background-warning-bold" />
            <div className="w-3 h-3 rounded-full bg-ds-background-success-bold" />
          </div>
          {/* URL bar */}
          <div className="flex-1 mx-2 overflow-hidden px-2.5 py-1 rounded-md text-ds-text-subtle text-[9px] font-medium flex items-center gap-1.5 border border-ds-border bg-ds-surface">
            <div className="w-3.5 h-3.5 flex-shrink-0 cursor-default rounded-[3px] bg-ds-background-brand-bold text-white flex items-center justify-center text-[7.5px] font-black leading-none pb-[1px] shadow-sm">
              G
            </div>
            <Lock
              size={8}
              className="text-ds-text-success flex-shrink-0 ms-1"
            />
            <span dir="ltr" className="truncate tracking-tight select-all">
              https://app.gateflow.site/en
            </span>
          </div>
          {/* Tab refresh */}
          <div className="w-4 h-4 rounded-sm border border-ds-border flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 border border-ds-border-bold rounded-full border-t-transparent" />
          </div>
        </div>
        {children}
      </div>
      {/* Laptop hinge - hardware stays dark/metallic */}
      <div className="h-2.5 rounded-b-lg border border-t-0 border-ds-border-bold bg-ds-surface-sunken" />
      {/* Laptop base */}
      <div className="mx-6 h-2 rounded-b-xl shadow-xl bg-ds-surface" />
    </div>
  );
}

/* ─── Artwork 1: Gate Scanner (Phone + floating cards) ────────────────────── */
function ScannerArtwork({ isRtl }: { isRtl: boolean }) {
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
    { name: 'Ahmed S.', gate: 'Gate A', ok: true, time: '2s' },
    { name: 'Sara M.', gate: 'Gate C', ok: true, time: '1m' },
    { name: 'Unknown', gate: 'Gate B', ok: false, time: '3m' },
  ];

  return (
    <div className="relative mx-auto w-fit flex justify-center items-end scale-125 sm:scale-150 lg:scale-[1.7] origin-bottom translate-y-24 lg:-translate-x-12 rtl:lg:translate-x-12 lg:translate-y-[170px] transition-transform duration-700">
      <PhoneFrame
        width={260}
        className="relative z-20"
        style={{ boxShadow: 'var(--ds-shadow-overlay)' }}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-ds-border bg-ds-surface">
          <div className="flex items-center gap-2">
            <QrCode size={12} className="text-ds-text-brand" />
            <span className="text-ds-text-heading text-[10px] font-black uppercase tracking-[0.12em]">
              GateFlow Scanner
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-ds-background-success-bold"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span className="text-ds-text-success text-[8px] font-black tracking-widest">
              {isRtl ? 'مباشر' : 'LIVE'}
            </span>
          </div>
        </div>

        {/* Scanner viewfinder */}
        <div
          className="relative mx-3.5 mt-3 rounded-2xl overflow-hidden flex-shrink-0 bg-ds-surface-sunken outline outline-1 outline-ds-border-bold"
          style={{ aspectRatio: '1' }}
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
                {/* Corner guides */}
                {[
                  'top-3 left-3 border-t-2 border-l-2',
                  'top-3 right-3 border-t-2 border-r-2',
                  'bottom-3 left-3 border-b-2 border-l-2',
                  'bottom-3 right-3 border-b-2 border-r-2',
                ].map((cls, i) => (
                  <div
                    key={i}
                    className={`absolute w-6 h-6 rounded-sm ${cls} border-ds-border-brand`}
                  />
                ))}
                {/* Scan beam */}
                <motion.div
                  className="absolute left-6 right-6 h-0.5 rounded-full bg-ds-background-brand-bold shadow-[0_0_10px_var(--ds-background-brand-bold)]"
                  animate={{ y: [-35, 35, -35] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                {/* QR placeholder grid */}
                <div className="grid grid-cols-3 gap-1 opacity-20 w-16 h-16">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-sm bg-ds-text-heading"
                      style={{
                        opacity: [0, 2, 6, 8].includes(i)
                          ? 1
                          : i === 4
                            ? 0
                            : 0.4,
                      }}
                    />
                  ))}
                </div>
                <p className="text-ds-text-subtle text-[8px] font-bold mt-3 uppercase tracking-wider">
                  {isRtl ? 'قم بمحاذاة رمز QR...' : 'Align QR code…'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="ok"
                className="absolute inset-0 flex flex-col items-center justify-center bg-ds-background-success-subtle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ ...SPRING, delay: 0.05 }}
                >
                  <CheckCircle2
                    size={44}
                    className="text-ds-text-success mb-2"
                  />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-ds-text-success text-[14px] font-black uppercase tracking-widest"
                >
                  {isRtl ? 'تم منح الإذن' : 'Access Granted'}
                </motion.p>
                <p className="text-ds-text-success text-[9px] font-bold mt-1 opacity-70">
                  {isRtl
                    ? 'بوابة ب · المدخل الرئيسي'
                    : 'Gate B · Main Entrance'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scan log */}
        <div className="px-3.5 pt-3 space-y-1.5 flex-1 bg-ds-surface">
          {log.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-ds-border bg-ds-surface-raised shadow-sm"
            >
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${item.ok ? 'bg-ds-background-success-bold' : 'bg-ds-background-danger-bold'}`}
                />
                <span className="text-ds-text-heading text-[9px] font-bold">
                  {item.name}
                </span>
                <span className="text-ds-text-subtle text-[8px]">
                  · {item.gate}
                </span>
              </div>
              <span
                className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${item.ok ? 'text-ds-text-success bg-ds-background-success-subtle' : 'text-ds-text-danger bg-ds-background-danger-subtle'}`}
              >
                {item.ok
                  ? isRtl
                    ? 'تم المنح'
                    : 'GRANTED'
                  : isRtl
                    ? 'مرفوض'
                    : 'BLOCKED'}
              </span>
            </motion.div>
          ))}
        </div>
      </PhoneFrame>

      {/* Floating stat card */}
      <motion.div
        initial={{ opacity: 0, x: isRtl ? -40 : 40, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.9, ...SPRING }}
        className="absolute bottom-20 -end-12 z-30 rounded-2xl p-4 min-w-[165px] border border-ds-border-bold bg-ds-surface-raised"
        style={{ boxShadow: 'var(--ds-shadow-overlay)' }}
      >
        <div className="flex items-center gap-3 mb-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-ds-background-brand-bold">
            <Activity size={14} className="text-ds-text-inverse" />
          </div>
          <div>
            <div className="text-[22px] font-black text-ds-text-heading leading-none">
              1,247
            </div>
            <div className="text-[9px] text-ds-text-subtle font-bold uppercase tracking-wider">
              {isRtl ? 'عمليات المسح اليوم' : 'scans today'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp
            size={10}
            className="text-ds-text-success rtl:-scale-x-100"
          />
          <span className="text-[9px] font-black text-ds-text-success">
            {isRtl ? '+12% عن الأمس' : '+12% vs yesterday'}
          </span>
        </div>
      </motion.div>

      {/* Floating compound badge */}
      <motion.div
        initial={{ opacity: 0, y: -20, x: isRtl ? 20 : -20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 1.1, ...SPRING }}
        className="absolute top-12 -start-8 z-30 rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 border border-ds-border bg-ds-surface-raised"
        style={{ boxShadow: 'var(--ds-shadow-overlay)' }}
      >
        <div className="w-7 h-7 rounded-xl bg-ds-background-information-subtle flex items-center justify-center">
          <Home size={13} className="text-ds-text-information" />
        </div>
        <div>
          <p className="text-[12px] font-black text-ds-text-heading">
            Palm Hills
          </p>
          <p className="text-[8px] font-bold text-ds-text-subtle uppercase tracking-wider">
            Compound Admin
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Artwork 2: Visitor Permission (Phone centered) ──────────────────────── */
function VisitorArtwork({ isRtl }: { isRtl: boolean }) {
  const steps = [
    { label: 'Verify Identity', done: true },
    { label: 'Check Gate Quota', done: true },
    { label: 'Notify Host via SMS', done: false },
  ];

  return (
    <div className="flex justify-center scale-125 sm:scale-150 lg:scale-[1.7] origin-bottom translate-y-24 lg:-translate-x-12 rtl:lg:translate-x-12 lg:translate-y-[170px] transition-transform duration-700">
      <PhoneFrame
        width={260}
        className="relative z-20"
        style={{ boxShadow: 'var(--ds-shadow-deep)' }}
      >
        {/* App header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-ds-border bg-ds-surface">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-ds-background-brand-bold">
              <UserCheck size={12} className="text-ds-text-inverse" />
            </div>
            <span className="text-ds-text-heading text-[10px] font-black">
              Visitor Request
            </span>
          </div>
          <motion.div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-ds-border-warning bg-ds-background-warning-subtle"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-ds-background-warning-bold" />
            <span className="text-ds-text-warning text-[7px] font-black tracking-widest">
              PENDING
            </span>
          </motion.div>
        </div>

        {/* Visitor card */}
        <div className="px-3.5 pt-3 bg-ds-surface">
          <div className="rounded-2xl p-3 flex items-center gap-3 border border-ds-border bg-ds-surface-raised shadow-sm">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-[15px] font-black flex-shrink-0"
              style={{
                background: 'var(--ds-background-brand-bold)',
              }}
            >
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-ds-text-heading text-[13px] font-black truncate">
                Ahmed Al-Rashidi
              </div>
              <div className="text-ds-text-subtle text-[9px] font-semibold">
                +20 10 1234 5678 · Villa 14
              </div>
            </div>
            <motion.div
              className="w-2 h-2 rounded-full bg-ds-background-warning-bold flex-shrink-0"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Selectors */}
        <div className="px-3.5 pt-2.5 space-y-1.5 bg-ds-surface">
          {[
            { label: 'Gate', value: 'Main Entrance' },
            { label: 'Duration', value: '1 Hour' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between px-3 py-2 rounded-xl border border-ds-border bg-ds-surface-sunken"
            >
              <span className="text-ds-text-subtle text-[9px] font-semibold">
                {label}
              </span>
              <span className="text-ds-text-heading text-[9px] font-black">
                {value} ›
              </span>
            </div>
          ))}
        </div>

        {/* Auth steps */}
        <div className="px-3.5 pt-2.5 space-y-1.5 bg-ds-surface">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isRtl ? 12 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${s.done ? 'bg-ds-background-success-subtle border-ds-border-success' : 'bg-ds-surface-sunken border-ds-border'}`}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? 'bg-ds-background-success-bold' : 'bg-ds-surface border border-ds-border-bold'}`}
              >
                {s.done && (
                  <CheckCircle2 size={10} className="text-ds-text-inverse" />
                )}
              </div>
              <span
                className={`text-[9px] font-bold ${s.done ? 'text-ds-text-success' : 'text-ds-text-subtle'}`}
              >
                {s.label}
              </span>
              {i === steps.length - 1 && (
                <motion.span
                  className="ms-auto text-[7px] font-black uppercase tracking-widest text-ds-text-warning"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Sending…
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="px-3.5 pt-3 pb-1 space-y-2 bg-ds-surface h-full">
          {/* Approve — Kimchi Orange accent */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-2xl text-ds-text-inverse text-[11px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 bg-ds-background-brand-bold shadow-md hover:shadow-lg transition-all"
          >
            <ShieldCheck size={13} />
            Grant Access
          </motion.button>
          {/* Deny — ghost */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full py-2 rounded-xl text-[10px] font-bold border border-ds-border bg-ds-surface-raised text-ds-text-subtle hover:bg-ds-surface-sunken transition-colors"
          >
            Deny Request
          </motion.button>
        </div>
      </PhoneFrame>
    </div>
  );
}

/* ─── Artwork 3: Analytics Dashboard (Laptop) ─────────────────────────────── */
function AnalyticsArtwork() {
  return (
    <div
      className="scale-100 lg:scale-[1.05] origin-bottom lg:translate-x-12 rtl:lg:-translate-x-12 transition-transform duration-700 rounded-xl w-full lg:w-[125%] max-w-[1200px] ms-auto z-50 relative"
      style={{ boxShadow: 'var(--ds-shadow-deep)' }}
    >
      <LaptopFrame>
        <div className="px-4 py-3.5 bg-ds-surface h-full min-h-[480px]">
          {/* Dashboard toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-ds-background-brand-bold p-1.5">
                <LayoutDashboard size={13} className="text-ds-text-inverse" />
              </div>
              <span className="text-ds-text-heading text-[10px] font-black uppercase tracking-[0.18em]">
                Security Hub
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-ds-border-success bg-ds-background-success-subtle">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-ds-background-success-bold"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span className="text-ds-text-success text-[8px] font-black uppercase tracking-wider">
                All Systems Live
              </span>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-4 gap-2 mb-3.5">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 }}
              className="rounded-xl p-2.5 border border-ds-border-success bg-ds-background-success-subtle"
            >
              <Shield size={11} className="mb-1.5 text-ds-text-success" />
              <div className="text-[17px] font-black leading-none mb-0.5 text-ds-text-success">
                14/15
              </div>
              <div className="text-[7px] font-bold uppercase tracking-wider text-ds-text-success opacity-80">
                Active Gates
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="rounded-xl p-2.5 border border-ds-border-brand bg-ds-background-brand-subtle"
            >
              <Activity size={11} className="mb-1.5 text-ds-text-brand" />
              <div className="text-[17px] font-black leading-none mb-0.5 text-ds-text-brand">
                1,247
              </div>
              <div className="text-[7px] font-bold uppercase tracking-wider text-ds-text-brand opacity-80">
                Today&apos;s Scans
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.21 }}
              className="rounded-xl p-2.5 border border-ds-border-danger bg-ds-background-danger-subtle"
            >
              <Lock size={11} className="mb-1.5 text-ds-text-danger" />
              <div className="text-[17px] font-black leading-none mb-0.5 text-ds-text-danger">
                3
              </div>
              <div className="text-[7px] font-bold uppercase tracking-wider text-ds-text-danger opacity-80">
                Blocked
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="rounded-xl p-2.5 border border-ds-border-information bg-ds-background-information-subtle"
            >
              <TrendingUp
                size={11}
                className="mb-1.5 text-ds-text-information"
              />
              <div className="text-[17px] font-black leading-none mb-0.5 text-ds-text-information">
                99.9%
              </div>
              <div className="text-[7px] font-bold uppercase tracking-wider text-ds-text-information opacity-80">
                Uptime
              </div>
            </motion.div>
          </div>

          {/* Chart + events */}
          <div className="grid grid-cols-5 gap-2.5">
            {/* Traffic Line Chart */}
            <div className="col-span-3 rounded-xl p-3 border border-ds-border bg-ds-surface-raised shadow-sm">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-ds-text-subtle text-[8px] font-black uppercase tracking-widest">
                  Traffic Flow
                </span>
                <span className="text-[7px] font-bold text-ds-text-brand bg-ds-background-brand-subtle px-1.5 py-0.5 rounded-sm">
                  LIVE
                </span>
              </div>
              <div className="relative h-14 w-full flex items-end">
                <svg
                  className="absolute inset-0 w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 40"
                >
                  <style>{`
                  .chart-line { stroke-dasharray: 200; stroke-dashoffset: 200; animation: dash 2.5s ease-out forwards; }
                  @keyframes dash { to { stroke-dashoffset: 0; } }
                `}</style>
                  <defs>
                    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--ds-background-brand-bold)"
                        stopOpacity="0.25"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--ds-background-brand-bold)"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 35 Q 15 25 30 30 T 60 15 T 85 5 L 100 20 L 100 40 L 0 40 Z"
                    fill="url(#glow)"
                    className="opacity-70"
                  />
                  <path
                    d="M0 35 Q 15 25 30 30 T 60 15 T 85 5 L 100 20"
                    fill="none"
                    stroke="var(--ds-background-brand-bold)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="chart-line"
                  />
                  <circle
                    cx="85"
                    cy="5"
                    r="2.5"
                    fill="var(--ds-background-brand-bold)"
                    className="animate-pulse"
                  />
                </svg>
              </div>
              <div className="flex justify-between mt-2.5">
                <span className="text-[7px] font-bold text-ds-text-subtlest">
                  6 AM
                </span>
                <span className="text-[7px] font-bold text-ds-text-subtlest">
                  12 PM
                </span>
                <span className="text-[7px] font-bold text-ds-text-subtlest">
                  NOW
                </span>
              </div>
            </div>

            {/* Access Log */}
            <div className="col-span-2 rounded-xl p-3 border border-ds-border bg-ds-surface-raised shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-ds-text-subtle text-[8px] font-black uppercase tracking-widest">
                  Access Log
                </span>
              </div>
              <div className="space-y-1.5">
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex items-center justify-between bg-ds-surface p-1.5 rounded-lg border border-ds-border"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-ds-background-success-bold" />
                    <span className="text-ds-text-subtle text-[7px] font-bold truncate">
                      Gate A / Alice
                    </span>
                  </div>
                  <span className="text-[6.5px] font-black px-1 py-0.5 rounded-sm text-ds-text-success bg-ds-background-success-subtle whitespace-nowrap">
                    GRANTED
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                  className="flex items-center justify-between bg-ds-surface p-1.5 rounded-lg border border-ds-border"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-ds-background-danger-bold" />
                    <span className="text-ds-text-subtle text-[7px] font-bold truncate">
                      Gate C / Visitor
                    </span>
                  </div>
                  <span className="text-[6.5px] font-black px-1 py-0.5 rounded-sm text-ds-text-danger bg-ds-background-danger-subtle whitespace-nowrap">
                    BLOCKED
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 }}
                  className="flex items-center justify-between bg-ds-surface p-1.5 rounded-lg border border-ds-border opacity-70"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-ds-background-success-bold" />
                    <span className="text-ds-text-subtle text-[7px] font-bold truncate">
                      Gate B / John M.
                    </span>
                  </div>
                  <span className="text-[6.5px] font-black px-1 py-0.5 rounded-sm text-ds-text-success bg-ds-background-success-subtle whitespace-nowrap">
                    GRANTED
                  </span>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Device Health Row */}
          <div className="mt-2.5 rounded-xl p-3 border border-ds-border bg-ds-surface-raised shadow-sm">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-ds-text-subtle text-[8px] font-black uppercase tracking-widest">
                Hardware Devices Online
              </span>
              <span className="text-[7px] font-bold text-ds-text-success">
                98% Uptime
              </span>
            </div>
            <div className="flex gap-1">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-[1px] ${i === 12 ? 'bg-ds-background-danger-bold opacity-80' : 'bg-ds-background-success-bold opacity-80'}`}
                />
              ))}
            </div>
          </div>
          {/* Recent Alerts Row */}
          <div className="mt-2.5 flex items-center justify-between rounded-xl p-2.5 border border-ds-border-warning bg-ds-background-warning-subtle">
            <div className="flex gap-2 items-center">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-ds-background-warning-bold shadow-[0_0_8px_var(--ds-background-warning-bold)]"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[8px] font-bold text-ds-text-warning">
                Gate C Offline - Reconnecting...
              </span>
            </div>
            <span className="text-[7px] font-bold text-ds-text-warning opacity-70">
              2 mins ago
            </span>
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
  const yParallax = useTransform(scrollY, [0, 600], [0, -100]);

  const slides: HeroSlide[] = [
    {
      id: 'security',
      slideLabel: 'Gate Scanner',
      artwork: <ScannerArtwork isRtl={isRtl} />,
    },
    {
      id: 'permission',
      slideLabel: 'Visitor Permission',
      artwork: <VisitorArtwork isRtl={isRtl} />,
    },
    {
      id: 'hub',
      slideLabel: 'Analytics Hub',
      artwork: <AnalyticsArtwork />,
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
      className="relative py-20 lg:py-32 bg-ds-surface min-h-[100vh] flex flex-col justify-center"
    >
      {/* ── Backgrounds ── */}
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
          className="absolute top-0 end-0 -z-10 w-[600px] h-[600px] bg-ds-selected/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/3 rtl:-translate-x-1/2"
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.4] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, var(--ds-border) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="w-full max-w-[1536px] px-4 lg:px-8 xl:px-10 mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ── Left: Text content ── */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col items-start gap-1">
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-ds-background-brand-subtle text-ds-text-brand text-[11px] font-black tracking-[0.3em] uppercase mb-10 w-fit ms-0 me-auto border border-ds-border-brand/20"
            >
              <Shield size={15} fill="currentColor" fillOpacity={0.2} />
              {t('trust.badge')}
            </motion.div>

            {/* Slide headline */}
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -24, filter: 'blur(10px)' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="text-4xl lg:text-5xl font-black leading-[0.94] mb-8 tracking-tighter text-ds-text-heading">
                  <span className="block mb-2 text-ds-text-heading">
                    {t(`hero.slides.${slide.id}.title`)}
                  </span>
                  <span className="block text-ds-text-brand">
                    {t(`hero.slides.${slide.id}.suffix`)}
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-ds-text-subtle font-medium leading-relaxed mb-12 max-w-lg mx-auto lg:ms-0 lg:me-auto rtl:lg:ms-auto rtl:lg:me-0">
                  {t(`hero.slides.${slide.id}.subHeadline`)}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-14">
              <IntentLink
                locale={locale}
                href="/contact"
                intent="demo"
                surface="home_hero_primary"
              >
                <Button
                  variant="brand"
                  size="lg"
                  className="h-16 px-10 text-[14px] font-black uppercase tracking-[0.18em] min-w-[200px] group hover:-translate-y-1 transition-all shadow-md hover:shadow-lg"
                >
                  {t('hero.primaryCta')}
                  <ArrowRight className="ms-3 h-5 w-5 rtl:-scale-x-100 group-hover:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform" />
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
                  className="h-16 px-10 text-[14px] font-black uppercase tracking-[0.18em] border border-ds-border hover:border-ds-border-bold bg-ds-surface-raised"
                >
                  {t('hero.secondaryCta')}
                </Button>
              </IntentLink>
            </div>

            {/* Slide nav pills */}
            <div className="flex gap-3 justify-center lg:justify-start">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(i)}
                  className="group flex flex-col gap-1.5 focus:outline-none"
                  aria-label={`Go to slide: ${s.slideLabel}`}
                >
                  <div
                    className={`h-1 rounded-full transition-all duration-700 overflow-hidden ${
                      i === currentSlide
                        ? 'w-20 bg-ds-background-brand-bold'
                        : 'w-7 bg-ds-border-bold hover:bg-ds-border-brand'
                    }`}
                  >
                    {i === currentSlide && (
                      <motion.div
                        className="h-full bg-ds-surface/50"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 8, ease: 'linear' }}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                      i === currentSlide
                        ? 'opacity-100 text-ds-text-brand'
                        : 'opacity-0'
                    }`}
                  >
                    {s.slideLabel}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Artwork ── */}
          <div
            className={`lg:col-span-7 relative flex justify-center -mb-32 lg:-mb-64 pt-12 lg:pt-0 ${currentSlide === 2 ? 'items-start lg:-mt-16' : 'items-end pb-16'}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.95, y: 48 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -32 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-20 w-[110%] sm:w-[120%] lg:w-[130%] max-w-[900px] scale-110 lg:scale-[1.15] origin-top"
              >
                {slide.artwork}
              </motion.div>
            </AnimatePresence>

            {/* Ambient glow */}
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
