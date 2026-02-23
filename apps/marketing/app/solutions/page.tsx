import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, GraduationCap, Calendar, Dumbbell, Anchor, Check, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solutions',
  description:
    'GateFlow powers access control for gated compounds, schools, events, clubs, and marinas across Egypt and the Gulf.',
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const SOLUTIONS = [
  {
    id: 'compounds',
    icon: Building2,
    label: 'Gated Compounds',
    color: 'indigo',
    headline: 'Secure Every Gate in Your Compound',
    subheadline:
      'Replace paper guest books and WhatsApp QR chaos with cryptographically-signed, auditable digital access.',
    points: [
      'Residents self-manage visitor invites via QR links',
      'Security guards scan offline — no WiFi dependency',
      'Supervisor override with full audit trail',
      'Per-gate scan counts and success rates at a glance',
      'Bulk QR codes for contractors and service crews',
      'Export scan logs for compliance or incident review',
    ],
    stats: [{ value: '< 2 s', label: 'Scan verification time' }, { value: '100%', label: 'Offline capable' }, { value: '0', label: 'Paper logs needed' }],
    cta: 'Book a Compound Demo',
  },
  {
    id: 'schools',
    icon: GraduationCap,
    label: 'Schools & Universities',
    color: 'teal',
    headline: 'Know Who Is on Campus at All Times',
    subheadline:
      'Issue signed QR passes for parents, contractors, and visitors. Revoke access instantly. Every entry is logged.',
    points: [
      'Separate QR types for parents, staff, and contractors',
      'Time-windowed access (e.g. 07:30–09:00 drop-off only)',
      'Instant revocation — invalidated in under 1 second',
      'Multi-gate: main entrance, gym, labs, admin block',
      'Daily visitor report emailed to administration',
      'No app install required for visitors — just a QR code',
    ],
    stats: [{ value: '5 s', label: 'QR email delivery' }, { value: 'SINGLE / RECURRING', label: 'QR types for routines' }, { value: 'Instant', label: 'Revocation' }],
    cta: 'Book a School Demo',
  },
  {
    id: 'events',
    icon: Calendar,
    label: 'Events & Venues',
    color: 'purple',
    headline: 'Run Smooth, Fraud-Proof Events',
    subheadline:
      'Generate thousands of signed tickets in seconds. Fake screenshots and reprints are rejected automatically.',
    points: [
      'Bulk CSV upload — generate 1,000 tickets in < 30 seconds',
      'SINGLE-use QR codes that expire after first scan',
      'Real-time entry count and gate throughput dashboard',
      'Multi-gate load balancing across entrances',
      'Webhook push to your ticketing or CRM system',
      'Post-event CSV export for attendee verification',
    ],
    stats: [{ value: '1,000', label: 'Tickets from CSV in < 30 s' }, { value: 'SINGLE-use', label: 'Prevents reprints' }, { value: 'Real-time', label: 'Entry dashboard' }],
    cta: 'Book an Events Demo',
  },
  {
    id: 'clubs',
    icon: Dumbbell,
    label: 'Sports Clubs & Gyms',
    color: 'orange',
    headline: 'Membership Access Without the Friction',
    subheadline:
      'RECURRING QR passes for active members, time-limited day passes for guests, and instant suspension for expired memberships.',
    points: [
      'RECURRING QR for active members — valid every day',
      'Day pass QR with configurable expiry for guests',
      'Auto-deny on membership expiry (no manual revoke needed)',
      'Turnstile or barrier integration via webhook',
      'Staff override for exceptional cases, fully logged',
      'Analytics: peak hours heatmap for staffing decisions',
    ],
    stats: [{ value: 'RECURRING', label: 'QR for members' }, { value: 'Auto-deny', label: 'On subscription expiry' }, { value: 'Heatmap', label: 'Peak-hour analytics' }],
    cta: 'Book a Club Demo',
  },
  {
    id: 'marinas',
    icon: Anchor,
    label: 'Marinas & Waterfront',
    color: 'blue',
    headline: 'Control Pier Access with Precision',
    subheadline:
      'Issue PERMANENT passes for berth holders and SINGLE-use passes for service crews and day visitors.',
    points: [
      'PERMANENT passes for registered berth holders',
      'SINGLE-use passes for service engineers and suppliers',
      'Offline-capable scanning at remote piers',
      'Time-stamped access log for insurance compliance',
      'Per-berth zone access control via gate scoping',
      'Mobile-first scanner for patrol staff on the dockside',
    ],
    stats: [{ value: '3 QR types', label: 'Flexible pass system' }, { value: 'Offline', label: 'Works on remote piers' }, { value: 'Zone-scoped', label: 'Per-berth access' }],
    cta: 'Book a Marina Demo',
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; badge: string; btn: string; check: string }> = {
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-400',
    badge: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300',
    btn: 'bg-indigo-700 hover:bg-indigo-600 shadow-indigo-600/30',
    check: 'text-indigo-600 dark:text-indigo-400',
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    text: 'text-teal-700 dark:text-teal-400',
    badge: 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300',
    btn: 'bg-teal-700 hover:bg-teal-600 shadow-teal-600/30',
    check: 'text-teal-600 dark:text-teal-400',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-400',
    badge: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    btn: 'bg-purple-700 hover:bg-purple-600 shadow-purple-600/30',
    check: 'text-purple-600 dark:text-purple-400',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-700 dark:text-orange-400',
    badge: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
    btn: 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30',
    check: 'text-orange-600 dark:text-orange-400',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    btn: 'bg-blue-700 hover:bg-blue-600 shadow-blue-600/30',
    check: 'text-blue-600 dark:text-blue-400',
  },
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SolutionsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-24 sm:pt-32">
        <div
          className="absolute inset-x-0 -top-40 -z-10 overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div
            className="relative left-1/2 w-[64rem] -translate-x-1/2 bg-gradient-to-r from-teal-600/20 to-indigo-600/20 opacity-50"
            style={{ height: 600, borderRadius: '50%' }}
          />
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-indigo-600">
            SOLUTIONS BY INDUSTRY
          </p>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Built for your industry
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500 dark:text-slate-400">
            Whether you manage a gated compound, a school campus, or a marina, GateFlow adapts to
            your access control workflows — not the other way around.
          </p>
        </div>

        {/* Solution tabs */}
        <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3">
          {SOLUTIONS.map((s) => {
            const Icon = s.icon;
            const c = COLOR_MAP[s.color];
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${c.badge} hover:opacity-90`}
              >
                <Icon size={15} />
                {s.label}
              </a>
            );
          })}
        </div>
      </section>

      {/* Solution sections */}
      {SOLUTIONS.map((s, i) => {
        const Icon = s.icon;
        const c = COLOR_MAP[s.color];
        const isEven = i % 2 === 0;
        return (
          <section
            key={s.id}
            id={s.id}
            className={`px-6 py-20 scroll-mt-20 ${isEven ? '' : 'bg-slate-50/50 dark:bg-slate-900/50'}`}
          >
            <div className="mx-auto max-w-6xl">
              <div className={`flex flex-col gap-12 lg:flex-row lg:items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                {/* Text */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg}`}>
                      <Icon size={22} className={c.text} />
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${c.badge}`}>
                      {s.label}
                    </span>
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    {s.headline}
                  </h2>
                  <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                    {s.subheadline}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {s.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-3">
                        <Check size={18} className={`mt-0.5 shrink-0 ${c.check}`} />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link
                      href="/contact"
                      className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 ${c.btn}`}
                    >
                      {s.cta}
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>

                {/* Stats card */}
                <div className="flex-1 max-w-sm lg:max-w-none">
                  <div className={`rounded-2xl border border-slate-200 dark:border-slate-700 ${c.bg} p-8`}>
                    <div className="grid grid-cols-3 gap-4">
                      {s.stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                          <p className={`text-xl font-extrabold ${c.text}`}>{stat.value}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-tight">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 rounded-xl bg-white/70 dark:bg-slate-800/70 p-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      <span className={`font-bold ${c.text}`}>How it works: </span>
                      GateFlow issues signed QR codes that gate staff scan with the mobile app. Every
                      scan is logged server-side, with full offline fallback and automatic sync.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Not sure which plan fits?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-slate-500 dark:text-slate-400">
            Talk to our team. We'll map your gates, headcount, and workflows to the right GateFlow
            configuration — free of charge.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-xl bg-indigo-700 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-0.5 hover:bg-indigo-600"
            >
              Book a Free Consultation
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-slate-200 dark:border-slate-700 px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
