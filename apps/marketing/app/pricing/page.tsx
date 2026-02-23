import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, transparent pricing in EGP for compounds, schools, events, and clubs across Egypt and the Gulf.',
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: 'Starter',
    badge: null,
    priceEGP: '649',
    priceAED: '80',
    period: 'per month',
    description:
      'Perfect for a single compound gate, small school, or one-off event. Get started in minutes.',
    cta: 'Start free trial',
    ctaHref: '/contact',
    featured: false,
    features: [
      'Up to 5,000 QR scans / month',
      'Up to 3 gates',
      'Up to 3 team members',
      'Visitor day passes',
      'Basic scan analytics',
      'Email & WhatsApp support',
      '30-day audit log',
    ],
    missing: [
      'Webhooks & API keys',
      'Offline sync queue',
      'CSV bulk upload',
      'Custom branding',
      'Advanced analytics & export',
    ],
  },
  {
    name: 'Pro',
    badge: 'Most Popular',
    priceEGP: '2,499',
    priceAED: '260',
    period: 'per month',
    description:
      'For growing facilities that need integrations, full analytics, and reliable offline scanning.',
    cta: 'Start 14-day trial',
    ctaHref: '/contact',
    featured: true,
    features: [
      'Up to 50,000 QR scans / month',
      'Unlimited gates',
      'Up to 10 team members',
      'Webhooks with retry',
      'API keys with scopes',
      'Offline sync queue',
      'CSV bulk upload',
      'Advanced analytics + CSV export',
      'Priority email & chat support',
      '90-day audit log',
    ],
    missing: ['Custom branding / white-label', 'Dedicated account manager'],
  },
  {
    name: 'Enterprise',
    badge: null,
    priceEGP: null,
    priceAED: null,
    period: null,
    description:
      'Unlimited scale, SLA guarantees, on-site onboarding, and white-label options for large portfolios.',
    cta: 'Contact sales',
    ctaHref: '/contact?enterprise=1',
    featured: false,
    features: [
      'Unlimited QR scans',
      'Unlimited gates',
      'Unlimited team members',
      'Everything in Pro',
      'Custom branding / white-label',
      'SSO / SAML integration',
      'Data residency (EG / KSA / UAE)',
      'Unlimited audit log retention',
      'Dedicated account manager',
      '99.99% SLA',
      'On-site training & onboarding',
    ],
    missing: [],
  },
];

// ─── Comparison table ─────────────────────────────────────────────────────────

type CellVal = boolean | string;

const TABLE: { feature: string; starter: CellVal; pro: CellVal; enterprise: CellVal }[] = [
  { feature: 'QR scans / month', starter: '5,000', pro: '50,000', enterprise: 'Unlimited' },
  { feature: 'Gates', starter: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Team members', starter: '3', pro: '10', enterprise: 'Unlimited' },
  { feature: 'Visitor day passes', starter: true, pro: true, enterprise: true },
  { feature: 'Resident / member codes', starter: true, pro: true, enterprise: true },
  { feature: 'Offline scanner', starter: false, pro: true, enterprise: true },
  { feature: 'Webhooks & API keys', starter: false, pro: true, enterprise: true },
  { feature: 'CSV bulk upload', starter: false, pro: true, enterprise: true },
  { feature: 'Analytics & CSV export', starter: 'Basic', pro: 'Full', enterprise: 'Advanced' },
  { feature: 'Audit log', starter: '30 days', pro: '90 days', enterprise: 'Unlimited' },
  { feature: 'Custom branding', starter: false, pro: false, enterprise: true },
  { feature: 'SSO / SAML', starter: false, pro: false, enterprise: true },
  { feature: 'Data residency (EG/KSA/UAE)', starter: false, pro: false, enterprise: true },
  { feature: 'SLA', starter: 'None', pro: '99.9%', enterprise: '99.99%' },
  { feature: 'Support', starter: 'Email', pro: 'Priority', enterprise: 'Dedicated' },
  { feature: 'On-site onboarding', starter: false, pro: false, enterprise: true },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQ = [
  {
    q: 'Are prices in EGP or USD?',
    a: 'Prices are listed in EGP (Egyptian Pounds). We also accept payment in AED for Gulf customers. Enterprise contracts can be in USD. Annual plans receive a 20% discount.',
  },
  {
    q: 'What happens if I exceed my scan limit?',
    a: 'You\'ll get an email warning at 80% usage. New scans beyond the limit are queued (not dropped) for 7 days, giving you time to upgrade without disruption.',
  },
  {
    q: 'Can I use GateFlow without internet at the gate?',
    a: 'Yes — the scanner app works fully offline. Scans are queued locally and synced to the cloud when connectivity returns. Offline mode is available on Pro and Enterprise plans.',
  },
  {
    q: 'Do you offer on-site setup and training?',
    a: 'Enterprise customers receive dedicated on-site onboarding in Cairo or Dubai. Starter and Pro customers get a guided remote setup session and video tutorials.',
  },
  {
    q: 'Can I white-label GateFlow for my real-estate developer brand?',
    a: 'Yes — white-label and custom branding (your logo, colors, domain) are available on the Enterprise plan. Contact us for a demo.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Starter and Pro plans include a full 14-day free trial with no credit card required. You get access to all features of the chosen plan during the trial.',
  },
  {
    q: 'Do you store data in Egypt?',
    a: 'Enterprise customers can choose their data residency region: Egypt, KSA, or UAE. Starter and Pro data is hosted in EU-West by default.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Visa, Mastercard, bank transfer, Fawry (Egypt), and corporate invoicing for Enterprise. Contact us for Meeza or mobile-wallet billing.',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-slate-50 to-white px-6 pb-16 pt-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Pricing</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-500 leading-relaxed">
          Prices in EGP &amp; AED. No per-gate fees. No hidden charges. Cancel any time.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <span className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-600 shadow-sm">
            🇪🇬 Priced for Egypt
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-600 shadow-sm">
            🇦🇪 Gulf AED pricing available
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-600 shadow-sm">
            💳 Fawry &amp; bank transfer accepted
          </span>
        </div>
      </section>

      {/* Plan cards */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.featured
                  ? 'border-blue-500 bg-blue-600 text-white shadow-2xl shadow-blue-200 ring-2 ring-blue-500'
                  : 'border-slate-200 bg-white shadow-sm'
              }`}
            >
              {/* Most popular badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-slate-900 shadow">
                  {plan.badge}
                </div>
              )}

              {/* Plan header */}
              <div>
                <p className={`text-sm font-semibold ${plan.featured ? 'text-blue-200' : 'text-slate-500'}`}>
                  {plan.name}
                </p>

                {plan.priceEGP ? (
                  <div className="mt-2">
                    <div className="flex items-end gap-1">
                      <span className={`text-4xl font-extrabold ${plan.featured ? 'text-white' : 'text-slate-900'}`}>
                        EGP {plan.priceEGP}
                      </span>
                      <span className={`mb-1 text-sm ${plan.featured ? 'text-blue-200' : 'text-slate-400'}`}>
                        / {plan.period}
                      </span>
                    </div>
                    <p className={`mt-1 text-xs ${plan.featured ? 'text-blue-200' : 'text-slate-400'}`}>
                      ≈ AED {plan.priceAED} / month
                    </p>
                  </div>
                ) : (
                  <div className="mt-2">
                    <span className={`text-3xl font-extrabold ${plan.featured ? 'text-white' : 'text-slate-900'}`}>
                      Custom pricing
                    </span>
                    <p className={`mt-1 text-xs ${plan.featured ? 'text-blue-200' : 'text-slate-400'}`}>
                      Volume discounts available
                    </p>
                  </div>
                )}

                <p className={`mt-3 text-sm leading-relaxed ${plan.featured ? 'text-blue-100' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
              </div>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`mt-6 block rounded-xl px-5 py-3 text-center text-sm font-semibold transition-colors ${
                  plan.featured
                    ? 'bg-white text-blue-700 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <ul className="mt-7 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className={`mt-0.5 shrink-0 font-bold ${plan.featured ? 'text-blue-200' : 'text-blue-500'}`}>
                      ✓
                    </span>
                    <span className={plan.featured ? 'text-blue-50' : 'text-slate-700'}>{f}</span>
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-2.5 text-sm ${
                      plan.featured ? 'text-blue-300/50' : 'text-slate-300'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">✕</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          All plans include a 14-day free trial. Annual billing saves 20%.{' '}
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact us for annual quotes.
          </Link>
        </p>
      </section>

      {/* Add-ons */}
      <section className="border-y border-slate-100 bg-slate-50 px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-xl font-bold text-slate-900">
            Available add-ons
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                name: 'SMS Delivery',
                desc: 'Send QR codes via SMS to guests without smartphones. Available in Egypt (all operators) and Gulf.',
                price: 'From EGP 150 / month',
              },
              {
                name: 'Dedicated Support',
                desc: 'A named support engineer available via WhatsApp and phone during business hours, Cairo time.',
                price: 'From EGP 800 / month',
              },
              {
                name: 'On-Site Onboarding',
                desc: 'A GateFlow engineer visits your facility to set up gates, train staff, and verify the installation.',
                price: 'From EGP 2,500 / visit',
              },
            ].map((addon) => (
              <div
                key={addon.name}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="font-semibold text-slate-900">{addon.name}</p>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{addon.desc}</p>
                <p className="mt-3 text-sm font-semibold text-blue-600">{addon.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-extrabold text-slate-900">
            Full feature comparison
          </h2>
          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Feature
                  </th>
                  {['Starter', 'Pro', 'Enterprise'].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide ${
                        h === 'Pro' ? 'text-blue-600' : 'text-slate-500'
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TABLE.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-50">
                    <td className="px-6 py-3.5 font-medium text-slate-700">{row.feature}</td>
                    {(
                      [
                        { val: row.starter, isProCol: false },
                        { val: row.pro, isProCol: true },
                        { val: row.enterprise, isProCol: false },
                      ] as { val: CellVal; isProCol: boolean }[]
                    ).map(({ val, isProCol }, i) => (
                      <td key={i} className="px-5 py-3.5 text-center">
                        {typeof val === 'boolean' ? (
                          val ? (
                            <span className="font-bold text-green-500">✓</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )
                        ) : (
                          <span
                            className={
                              isProCol ? 'font-semibold text-blue-700' : 'text-slate-600'
                            }
                          >
                            {val}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-100 bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-extrabold text-slate-900">
            Frequently asked questions
          </h2>
          <div className="mt-10 space-y-4">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="font-semibold text-slate-900">{item.q}</p>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-blue-600 px-6 py-20 text-center text-white">
        <h2 className="text-2xl font-extrabold">
          Still unsure which plan is right for you?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-blue-100">
          Book a free 30-minute call with our team. We&apos;ll assess your facility
          and recommend the best fit — no pressure.
        </p>
        <Link
          href="/contact?demo=1"
          className="mt-6 inline-block rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
        >
          Book a free demo
        </Link>
      </section>
    </main>
  );
}
