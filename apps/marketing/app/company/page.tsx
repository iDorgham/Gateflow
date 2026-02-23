import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Mail, Briefcase, Newspaper } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Company',
  description:
    'Learn about GateFlow — our mission, team, and commitment to replacing insecure manual gate management across the MENA region.',
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const TEAM = [
  {
    name: 'Omar Ashraf',
    role: 'Co-founder & CEO',
    initials: 'OA',
    bio: 'Former operations director at a 1,200-unit compound in New Cairo. Built GateFlow after managing WhatsApp QR chaos for 3 years.',
  },
  {
    name: 'Nour El-Din Mostafa',
    role: 'Co-founder & CTO',
    initials: 'NM',
    bio: 'Ex-senior engineer at a Gulf fintech. Designed the HMAC-SHA256 signing architecture and offline-first sync engine.',
  },
  {
    name: 'Layla Ibrahim',
    role: 'Head of Product',
    initials: 'LI',
    bio: 'Previously led product at a MENA PropTech company. Obsessed with removing every unnecessary click from gate workflows.',
  },
  {
    name: 'Karim Hassan',
    role: 'Head of Growth',
    initials: 'KH',
    bio: '10 years in B2B SaaS sales across Egypt and Saudi Arabia. Knows every security manager pain point by heart.',
  },
];

const VALUES = [
  {
    title: 'Security by default',
    desc: 'Every QR code is signed. Every API call is authenticated. Every piece of sensitive data is encrypted at rest. Security is not a feature — it is the foundation.',
  },
  {
    title: 'Offline-first resilience',
    desc: 'MENA infrastructure is unpredictable. Gates cannot go down because of a routing hiccup. Our offline-first design ensures access control works everywhere, always.',
  },
  {
    title: 'Operator empathy',
    desc: 'Security guards work long shifts in harsh conditions. Every UI decision is made with the lowest-bandwidth, most distracted user in mind. If it takes more than 2 taps, we simplify.',
  },
  {
    title: 'Full auditability',
    desc: 'Management and compliance teams need answers quickly. Every scan, override, and API call is logged immutably. Any event can be reconstructed in seconds.',
  },
];

const PRESS = [
  {
    outlet: 'Egypt Startups',
    headline: 'GateFlow raises pre-seed to digitize compound security in MENA',
    date: 'January 2026',
    href: '#',
  },
  {
    outlet: 'Gulf Tech Review',
    headline: 'The QR access control startup securing Gulf compounds and events',
    date: 'December 2025',
    href: '#',
  },
  {
    outlet: 'ArabNet',
    headline: 'How cryptographic QR codes are replacing paper guest books',
    date: 'November 2025',
    href: '#',
  },
];

const OPEN_ROLES = [
  { title: 'Senior Backend Engineer (Node.js / PostgreSQL)', location: 'Cairo or Remote', type: 'Full-time' },
  { title: 'React Native Engineer (Expo)', location: 'Cairo or Remote', type: 'Full-time' },
  { title: 'Customer Success Manager — Gulf Region', location: 'Dubai or Riyadh', type: 'Full-time' },
  { title: 'Sales Development Representative — Egypt', location: 'Cairo', type: 'Full-time' },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CompanyPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-24 sm:pt-32">
        <div
          className="absolute inset-x-0 -top-40 -z-10 overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div
            className="relative left-1/2 w-[64rem] -translate-x-1/2 bg-gradient-to-r from-indigo-600/20 to-[#00C9A7]/20 opacity-50"
            style={{ height: 600, borderRadius: '50%' }}
          />
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-indigo-600">
            ABOUT GATEFLOW
          </p>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            We built what we needed but couldn't find
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500 dark:text-slate-400">
            GateFlow was founded by people who managed actual gates — and lived the daily reality of
            paper books, WhatsApp chaos, and zero audit trail. We built the platform we always
            wanted.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Our mission
              </h2>
              <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
                Replace every clipboard and WhatsApp QR link in MENA with cryptographically-signed,
                auditable, offline-capable digital access control.
              </p>
              <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
                The MENA region has thousands of gated communities, schools, clubs, and venues that
                still rely on manual processes that are slow, error-prone, and completely
                unverifiable. We are changing that — one gate at a time.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <MapPin size={15} className="text-indigo-600" />
                <span>Cairo, Egypt · Dubai, UAE</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 dark:text-slate-400">
                <Mail size={15} className="text-indigo-600" />
                <a href="mailto:hello@gateflow.io" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  hello@gateflow.io
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '50+', label: 'Active facilities' },
                { value: '200K+', label: 'Scans processed' },
                { value: '5', label: 'Countries' },
                { value: '2025', label: 'Founded' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-center shadow-sm"
                >
                  <p className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              What we believe
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-7 shadow-sm"
              >
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-6 py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              The team
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((person) => (
              <div
                key={person.name}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-400 text-lg font-extrabold">
                  {person.initials}
                </div>
                <p className="font-bold text-slate-900 dark:text-white">{person.name}</p>
                <p className="mt-0.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{person.role}</p>
                <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="px-6 py-20" id="press">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <Newspaper size={20} className="text-indigo-600" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Press</h2>
          </div>
          <div className="space-y-4">
            {PRESS.map((item) => (
              <a
                key={item.headline}
                href={item.href}
                className="group flex items-start justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div>
                  <p className="text-xs font-bold text-indigo-600 mb-1">{item.outlet}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                    {item.headline}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">{item.date}</span>
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">
            For press enquiries:{' '}
            <a href="mailto:press@gateflow.io" className="text-indigo-600 hover:underline">
              press@gateflow.io
            </a>
          </p>
        </div>
      </section>

      {/* Careers */}
      <section className="px-6 py-20 bg-slate-50/50 dark:bg-slate-900/50" id="careers">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase size={20} className="text-indigo-600" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Open Roles</h2>
          </div>
          <p className="mb-8 text-slate-500 dark:text-slate-400">
            We are a small, high-output team. Every hire matters enormously.
          </p>
          <div className="space-y-3">
            {OPEN_ROLES.map((role) => (
              <div
                key={role.title}
                className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{role.title}</p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 text-xs">
                      {role.location}
                    </span>
                    <span className="rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 text-xs">
                      {role.type}
                    </span>
                  </div>
                </div>
                <a
                  href="mailto:careers@gateflow.io"
                  className="shrink-0 rounded-lg bg-indigo-700 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-600 transition-colors"
                >
                  Apply
                </a>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Don't see your role?{' '}
            <a href="mailto:careers@gateflow.io" className="text-indigo-600 hover:underline">
              Send us your CV anyway.
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
