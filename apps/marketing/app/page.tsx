import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <TrustBar />
      <FeatureOne />
      <FeatureTwo />
      <UseCases />
      <Security />
      <Testimonials />
      <BottomCTA />
    </main>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative px-6 pb-20 pt-20 lg:pb-32 lg:pt-32">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#00C9A7] to-[#3B368A] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
              Managing gate <br /> security has <br />
              <span className="relative inline-block">
                never been easier.
                <svg
                  className="absolute -bottom-2 w-full text-indigo-600"
                  viewBox="0 0 318 12"
                  fill="none"
                >
                  <path
                    d="M316 9.68266C247.965 2.50285 119.5 -0.686523 2 9.68266"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-8 max-w-lg text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">
              End-to-end visitor access and gate security in a single solution. Empower your security
              team with the platform designed to keep unauthorized guests out.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/contact"
                className="rounded-xl bg-indigo-700 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-0.5 hover:bg-indigo-600"
              >
                Get Started
              </Link>
              <Link
                href="/features"
                className="group flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white transition-colors hover:text-indigo-700 dark:hover:text-indigo-400"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#00C9A7] text-white shadow-lg shadow-[#00C9A7]/30 transition-transform group-hover:scale-105">
                  <svg className="ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                See How It Works
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="group relative flex items-center justify-center overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/20 ring-1 ring-slate-100 dark:ring-slate-700">
              {/* Fallback dashboard mockup if hero-graphic.png is missing */}
              <div className="w-full p-8 py-12">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-700 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Total Scans Today</p>
                      <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        2,847 <span className="text-sm text-[#00C9A7] font-bold">+18%</span>
                      </p>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-700 text-white text-2xl shadow-lg">
                      🔐
                    </div>
                  </div>
                  <div className="flex items-end gap-2 h-32">
                    {[35, 60, 45, 80, 55, 40, 90, 70, 50, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md bg-indigo-600"
                        style={{ height: `${h}%`, opacity: 0.6 + i * 0.04 }}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Success Rate', val: '98.2%', color: 'text-green-600' },
                      { label: 'Active Gates', val: '12', color: 'text-blue-600' },
                      { label: 'Denied', val: '3', color: 'text-red-500' },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl bg-white dark:bg-slate-600 p-3 text-center">
                        <p className={`text-lg font-extrabold ${s.color}`}>{s.val}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-300">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Trust bar ────────────────────────────────────────────────────────────────

function TrustBar() {
  const orgs = [
    { name: 'Palm Hills', color: 'text-indigo-600' },
    { name: 'British School', color: 'text-red-500' },
    { name: 'Emaar', color: 'text-teal-500' },
    { name: 'Sodic', color: 'text-blue-600' },
    { name: 'Gouna', color: 'text-orange-500' },
  ];
  return (
    <section className="border-y border-slate-100 dark:border-slate-800 py-10">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="mb-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
          Over 1,200+ gated communities secured by GateFlow
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10 opacity-60 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100 sm:gap-16">
          {orgs.map((o) => (
            <span key={o.name} className={`text-xl font-extrabold tracking-tight ${o.color}`}>
              {o.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Feature One ─────────────────────────────────────────────────────────────────

function FeatureOne() {
  return (
    <section id="features" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-8">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-indigo-600">
              REAL-TIME MONITORING
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              All scans linked to your central dashboard
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-500 dark:text-slate-400">
              Every barcode tap, every entry log, instantly synced. No more lost clipboards. Know
              exactly who entered Compound Gate 3 in real-time, online or offline.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-xl bg-indigo-700 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 hover:bg-indigo-600"
              >
                Get Started
              </Link>
              <Link
                href="/features"
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                See All Features
              </Link>
            </div>
          </div>

          <div className="relative mt-8 w-full max-w-lg lg:ml-auto lg:mt-0">
            <div className="relative overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-8 shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/10">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#00C9A7]/10 blur-3xl" />
              <div className="relative z-10">
                <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  100+ Verified Guards
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Ahmed Hassan', role: 'Main Gate Supervisor', color: 'bg-orange-400' },
                    { name: 'Sarah Kamal', role: 'Visitor Verification', color: 'bg-teal-500' },
                    { name: 'Omar Zaki', role: 'Night Shift Admin', color: 'bg-indigo-500' },
                  ].map((u) => (
                    <div
                      key={u.name}
                      className="flex items-center gap-4 rounded-2xl border border-slate-50 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-sm"
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${u.color} border-2 border-white font-bold text-white shadow-md`}
                      >
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{u.role}</p>
                      </div>
                      <span className="ml-auto text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Feature Two ─────────────────────────────────────────────────────────────

function FeatureTwo() {
  return (
    <section className="overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-xl shadow-indigo-100 dark:shadow-indigo-900/10">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total Scans
                  </p>
                  <p className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white">
                    12,400{' '}
                    <span className="text-sm font-bold text-[#00C9A7]">+14%</span>
                  </p>
                </div>
                <div className="relative h-20 w-20 rounded-full border-[10px] border-[#00C9A7]/20">
                  <div
                    className="absolute inset-0 rounded-full border-[10px] border-t-[#00C9A7] border-r-[#00C9A7] border-b-transparent border-l-transparent"
                    style={{ margin: '-10px' }}
                  />
                </div>
              </div>
              <div className="mt-6 flex h-40 items-end gap-2">
                {[40, 70, 30, 90, 50, 20, 80].map((h, i) => (
                  <div
                    key={i}
                    className="group relative flex-1 rounded-t-md bg-indigo-100 dark:bg-indigo-900/40"
                  >
                    <div
                      className="absolute bottom-0 left-0 w-full rounded-t-md bg-indigo-700 transition-all group-hover:bg-indigo-500"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-xs font-bold text-slate-400 dark:text-slate-500">
                <span>S</span><span>M</span><span>T</span>
                <span>W</span><span>T</span><span>F</span><span>S</span>
              </div>
            </div>

            <div className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex items-center gap-3 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 shadow-lg lg:-right-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-lg">
                ✅
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">+28,900</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Scans from Main Gate
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-indigo-600">
              MOBILE-FIRST SCANNER
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Process visitors quickly from anywhere
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-500 dark:text-slate-400">
              Equip every guard with a tablet. GateFlow's mobile app processes QR codes in under
              100ms. Keep traffic flowing, even during the morning school rush.
            </p>
            <div className="mt-10">
              <Link
                href="/contact"
                className="rounded-xl bg-indigo-700 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 hover:bg-indigo-600"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Use Cases ────────────────────────────────────────────────────────────────

function UseCases() {
  const cases = [
    {
      icon: '🏘️',
      title: 'Gated Compounds',
      desc: 'Manage resident passes, contractor permits, and delivery windows across multiple gates — all from one dashboard.',
      stat: '3,200+ compounds globally',
      href: '/solutions#compounds',
    },
    {
      icon: '🏫',
      title: 'Schools & Universities',
      desc: 'Issue parent pickup QR codes, restrict contractor access after hours, and get a full audit of who entered your campus today.',
      stat: '<100 ms per scan',
      href: '/solutions#schools',
    },
    {
      icon: '🎪',
      title: 'Events & Venues',
      desc: 'Scan 2,000 tickets per hour offline without WiFi. Prevent reprints with HMAC-signed, single-use QR codes.',
      stat: 'Works 100% offline',
      href: '/solutions#events',
    },
    {
      icon: '🏖️',
      title: 'Clubs & Marinas',
      desc: 'Differentiate member tiers, limit guest quota per member, and give receptionists a lightweight tablet app.',
      stat: 'Unlimited gates per plan',
      href: '/solutions#clubs',
    },
  ];

  return (
    <section id="use-cases" className="bg-slate-50/50 dark:bg-slate-900/50 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">
            USE CASES
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Built for every access-controlled venue
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Whether you manage a compound of 500 villas or a beach club with 3,000 members,
            GateFlow adapts to your workflow.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cases.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="text-4xl">{c.icon}</span>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{c.desc}</p>
              <p className="mt-4 inline-block rounded-full bg-indigo-50 dark:bg-indigo-950 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {c.stat}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/solutions"
            className="rounded-xl bg-indigo-700 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 hover:bg-indigo-600"
          >
            Explore all solutions →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Security ─────────────────────────────────────────────────────────────────

function Security() {
  const items = [
    {
      icon: '🔐',
      title: 'HMAC-SHA256 Signed QR',
      desc: 'Every QR code is cryptographically signed. Reprints and fakes are rejected immediately — even offline.',
    },
    {
      icon: '🛡️',
      title: 'Role-Based Access Control',
      desc: 'Assign TENANT_ADMIN, TENANT_USER, and VISITOR roles. Every API action is scoped to the authenticated organization.',
    },
    {
      icon: '🔒',
      title: 'AES-256 Offline Storage',
      desc: 'Scans queued while offline are encrypted at rest with AES-256 + PBKDF2 key derivation. Nothing sensitive ever hits disk unprotected.',
    },
    {
      icon: '📋',
      title: 'Full Audit Trail',
      desc: 'Every scan, override, and admin action is permanently logged with timestamps, gate IDs, and operator identity.',
    },
    {
      icon: '🔄',
      title: 'Token Rotation',
      desc: 'JWT access tokens expire in 15 minutes. Refresh tokens rotate on use, with revocation on logout or detected anomaly.',
    },
    {
      icon: '🚧',
      title: 'Rate Limiting & CSRF',
      desc: 'All login and API routes are rate-limited via Redis. Every mutating request is protected by the double-submit CSRF pattern.',
    },
  ];

  return (
    <section id="security" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">
            SECURITY
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Zero-trust from the ground up
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            GateFlow is built on the same security principles used in banking applications. Your
            access data is never an afterthought.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const testimonials = [
    {
      name: 'Khaled M.',
      role: 'Palm View Compound',
      quote: 'GateFlow replaced our paper guest books overnight. Gate traffic went from chaotic to seamless.',
    },
    {
      name: 'Nada S.',
      role: 'British School Alex.',
      quote: 'Our school pick-up line went from a nightmare to a breeze in two days. Parents love it.',
    },
    {
      name: 'Omar R.',
      role: 'Marina Events',
      quote: 'Scanned 2,000 QR codes offline when the WiFi died. Absolute lifesaver for our event.',
    },
  ];

  return (
    <section className="bg-slate-50/50 dark:bg-slate-900/50 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Loved by top security teams
        </h2>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-3xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-left shadow-sm transition-shadow hover:shadow-xl"
            >
              <div className="mb-4 flex gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="mb-8 font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950 font-bold text-indigo-600 dark:text-indigo-400">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Bottom CTA ───────────────────────────────────────────────────────────────

function BottomCTA() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[3rem] border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-10 shadow-2xl sm:p-20">
          <div className="absolute right-0 top-0 p-12 text-[8rem] font-black leading-none tracking-tighter opacity-[0.03] pointer-events-none select-none">
            ✖ ✖
          </div>
          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-indigo-600">
                START TODAY
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Ready to secure your compound?
              </h2>
            </div>
            <div>
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-2 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="w-full bg-transparent px-6 py-4 text-slate-900 dark:text-white font-medium placeholder:text-slate-400 outline-none"
                />
                <Link
                  href="/contact"
                  className="whitespace-nowrap rounded-xl bg-[#FF6B6B] px-8 py-4 text-center text-base font-bold text-white shadow-md transition-colors hover:bg-red-500"
                >
                  Get Started Free
                </Link>
              </div>
              <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 text-center">
                No credit card required · Free Starter plan available
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
