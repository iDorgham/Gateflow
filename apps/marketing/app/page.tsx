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
      {/* Decorative background shapes */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#00C9A7] to-[#3B368A] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}} />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.1]">
              Managing gate <br/> security has <br/>
              <span className="relative inline-block">
                 never been easier.
                 <svg className="absolute -bottom-2 w-full text-indigo-600" viewBox="0 0 318 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M316 9.68266C247.965 2.50285 119.5 -0.686523 2 9.68266" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>
              </span>
            </h1>
            <p className="mt-8 text-lg font-medium text-slate-500 leading-relaxed max-w-lg">
              End-to-end visitor access and gate security in a single solution. Empower your security team with the platform designed to keep unauthorized guests out.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/contact"
                className="rounded-xl bg-indigo-700 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-600 hover:-translate-y-0.5 transition-all"
              >
                Get Started
              </Link>
              <button className="group flex items-center gap-3 text-base font-bold text-slate-900 hover:text-indigo-700 transition-colors">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#00C9A7] text-white shadow-lg shadow-[#00C9A7]/30 group-hover:scale-105 transition-transform">
                  <svg className="h-5 w-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </span>
                See How It Works
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            {/* The generated hero mockup image */}
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-2xl shadow-indigo-100 ring-1 ring-slate-100 flex justify-center items-center group">
               <img src="/hero-graphic.png" alt="GateFlow Security Dashboard" className="w-[85%] h-auto object-cover py-10 pt-16 transition-transform duration-700 group-hover:scale-105" />
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
    <section className="py-10 border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="mb-8 text-sm font-semibold text-slate-800">
          Over 1,200+ gated communities secured by GateFlow
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
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
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-4">OUR FEATURE</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              All scans are linked to your central dashboard
            </h2>
            <p className="mt-6 text-lg text-slate-500 leading-relaxed">
              Every barcode tap, every entry log, instantly synced. No more lost clipboards. Know exactly who entered Compound Gate 3 in real-time, online or offline.
            </p>
            <div className="mt-10">
              <Link
                href="/contact"
                className="rounded-xl bg-indigo-700 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-600 hover:-translate-y-0.5 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0 lg:ml-auto w-full max-w-lg">
             {/* Abstract UI representation */}
             <div className="relative rounded-3xl bg-slate-50 border border-slate-100 p-8 shadow-2xl shadow-indigo-100 overflow-hidden">
                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#00C9A7]/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">100+ Verified Guards</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Ahmed Hassan', role: 'Main Gate Supervisor', color: 'bg-orange-400' },
                      { name: 'Sarah Kamal', role: 'Visitor Verification', color: 'bg-teal-500' },
                      { name: 'Omar Zaki', role: 'Night Shift Admin', color: 'bg-indigo-500' }
                    ].map(u => (
                      <div key={u.name} className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-50">
                        <div className={`w-12 h-12 rounded-full ${u.color} shrink-0 border-2 border-white shadow-md flex items-center justify-center text-white font-bold`}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-6 text-sm font-bold text-[#FF6B6B] hover:text-red-600 transition-colors">
                    See More →
                  </button>
                </div>
             </div>

             {/* Floating overlay card */}
             <div className="absolute -bottom-12 -right-12 sm:-right-8 bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 z-20 w-72 transform rotate-2 hover:rotate-0 transition-transform">
               <div className="w-20 h-20 rounded-full bg-yellow-400 mx-auto border-4 border-white shadow-lg flex items-center justify-center text-3xl mb-4">
                 👨‍✈️
               </div>
               <div className="text-center">
                 <h4 className="text-lg font-bold text-slate-900">Morne Morkel</h4>
                 <p className="text-xs text-slate-500">Gate Security Lead</p>
                 <button className="mt-6 w-full py-2.5 bg-[#00AEEF] hover:bg-[#0096D1] text-white font-bold rounded-xl transition-colors">
                   CONTACT
                 </button>
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
    <section className="px-6 py-24 sm:py-32 overflow-hidden bg-slate-50/50">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="order-2 lg:order-1 relative">
            {/* Chart mockup abstract */}
             <div className="relative rounded-3xl bg-white p-8 shadow-xl shadow-indigo-100 border border-slate-100">
               <div className="flex justify-between items-start mb-10">
                 <div>
                   <p className="text-sm text-slate-500 font-medium">Total Scans</p>
                   <p className="text-3xl font-extrabold text-slate-900 mt-1">12,400 <span className="text-sm text-[#00C9A7] font-bold">+14%</span></p>
                 </div>
                 <div className="w-24 h-24 rounded-full border-[12px] border-[#00C9A7]/20 relative">
                    <div className="absolute inset-0 border-[12px] border-t-[#00C9A7] border-r-[#00C9A7] rounded-full" style={{margin: '-12px'}}></div>
                 </div>
               </div>
               
               <div className="flex items-end gap-3 h-48 mt-8">
                 {[40, 70, 30, 90, 50, 20, 80].map((h, i) => (
                   <div key={i} className="flex-1 bg-indigo-700/10 rounded-t-lg relative group">
                      <div className="absolute bottom-0 left-0 w-full bg-indigo-700 rounded-t-lg transition-all group-hover:bg-indigo-500" style={{ height: `${h}%` }}></div>
                   </div>
                 ))}
               </div>
               <div className="flex justify-between mt-4 text-xs font-bold text-slate-400">
                 <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
               </div>
             </div>

             {/* Floating badge */}
             <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-white px-4 py-3 rounded-2xl shadow-lg border border-slate-50 flex items-center gap-4 z-10 w-64">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">✅</div>
                <div>
                  <p className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mb-1">+28,900</p>
                  <p className="text-xs text-slate-500 font-medium whitespace-nowrap">Scans from Main Gate</p>
                </div>
             </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-4">OUR FEATURE</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Process visitors quickly from anywhere
            </h2>
            <p className="mt-6 text-lg text-slate-500 leading-relaxed">
              Equip every guard with a tablet. GateFlow's mobile app processes QR codes in under 100ms. Keep traffic flowing, even during the morning school rush.
            </p>
            <div className="mt-10">
              <Link
                href="/contact"
                className="rounded-xl bg-indigo-700 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-600 hover:-translate-y-0.5 transition-all"
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

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Loved by top security teams
        </h2>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            { name: 'Khaled M.', role: 'Palm View Compound', quote: 'GateFlow replaced our paper guest books overnight. Traffic is gone.' },
            { name: 'Nada S.', role: 'British School Alex.', quote: 'Our school pick-up line went from a nightmare to a breeze in two days.' },
            { name: 'Omar R.', role: 'Marina Events', quote: 'Scanned 2,000 QR codes offline when the WiFi died. Absolute lifesaver.' }
          ].map(t => (
             <div key={t.name} className="text-left bg-white border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow">
               <div className="flex text-yellow-400 mb-4 gap-1">
                 <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
               </div>
               <p className="text-slate-600 font-medium leading-relaxed mb-8">"{t.quote}"</p>
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center font-bold text-indigo-600">
                   {t.name.charAt(0)}
                 </div>
                 <div>
                   <p className="font-bold text-slate-900">{t.name}</p>
                   <p className="text-sm text-slate-500">{t.role}</p>
                 </div>
               </div>
             </div>
          ))}
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
    },
    {
      icon: '🏫',
      title: 'Schools & Universities',
      desc: "Issue parent pickup QR codes, restrict contractor access after hours, and get a full audit of who entered your campus today.",
      stat: '<100 ms per scan',
    },
    {
      icon: '🎪',
      title: 'Events & Venues',
      desc: 'Scan 2,000 tickets per hour offline without WiFi. Prevent reprints with HMAC-signed, single-use QR codes.',
      stat: 'Works 100% offline',
    },
    {
      icon: '🏖️',
      title: 'Clubs & Marinas',
      desc: 'Differentiate member tiers, limit guest quota per member, and give receptionists a lightweight tablet app.',
      stat: 'Unlimited gates per plan',
    },
  ];

  return (
    <section id="use-cases" className="px-6 py-24 sm:py-32 bg-slate-50/50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-3">USE CASES</p>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Built for every access-controlled venue
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Whether you manage a compound of 500 villas or a beach club with 3,000 members, GateFlow adapts to your workflow.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cases.map((c) => (
            <div key={c.title} className="group rounded-2xl bg-white border border-slate-100 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <span className="text-4xl">{c.icon}</span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{c.desc}</p>
              <p className="mt-4 text-xs font-bold text-indigo-600 bg-indigo-50 inline-block rounded-full px-3 py-1">{c.stat}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="rounded-xl bg-indigo-700 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-600 hover:-translate-y-0.5 transition-all"
          >
            Tell us about your facility →
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
        <div className="text-center mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-3">SECURITY</p>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Zero-trust from the ground up
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            GateFlow is built on the same security principles used in banking applications. Your access data is never an afterthought.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-2xl bg-slate-900 p-7 text-white">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-4 text-base font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{item.desc}</p>
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
    <section className="px-6 py-24 sm:py-32 bg-slate-50/50">
      <div className="mx-auto max-w-7xl relative">
        <div className="bg-white border border-slate-100 rounded-[3rem] p-10 sm:p-20 shadow-2xl overflow-hidden relative">
          
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-[8rem] font-black leading-none tracking-tighter">
            ✖ ✖
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-4">START TODAY</p>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Ready to secure your compound?
              </h2>
            </div>
            
            <div>
              <form className="flex flex-col sm:flex-row gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-600 transition-all">
                <input 
                  type="email" 
                  placeholder="Enter your Work Email" 
                  className="w-full bg-transparent px-6 py-4 outline-none text-slate-900 font-medium placeholder:text-slate-400"
                  required
                />
                <button type="submit" className="rounded-xl bg-[#FF6B6B] hover:bg-red-500 px-8 py-4 text-base font-bold text-white shadow-md transition-colors whitespace-nowrap">
                  Get Started for Free
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
