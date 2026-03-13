'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, MessageCircle, BookOpen, Zap } from 'lucide-react';

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I create a visitor QR code?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to QR Codes → New QR Code. Enter the visitor name, email, select a gate and QR type (SINGLE, RECURRING, or PERMANENT), then click Generate. The QR code can be emailed directly to the visitor.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the scanner has no internet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The scanner app verifies QR signatures locally using the pre-loaded signing key. Scans are queued in AES-256 encrypted local storage and automatically synced when connectivity returns. No scan is ever lost.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can residents manage their own visitors?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Resident Portal allows residents to create visitor QR codes, set access rules, and track quota usage. They can share QR links directly from their phone without contacting security.',
      },
    },
    {
      '@type': 'Question',
      name: 'How are QR codes secured against tampering?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every QR code is signed with HMAC-SHA256 using a secret only your organization holds. A screenshot or photocopy of a SINGLE-use QR will be rejected after the first scan because the server marks it as used.',
      },
    },
    {
      '@type': 'Question',
      name: 'What roles are available in GateFlow?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GateFlow has five roles: Platform Admin (Anthropic-managed), Tenant Admin (full client dashboard access), Tenant User (limited access), Visitor (scanner app only), and Resident (resident portal). Roles are assigned per organization.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I export scan history?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to Scans → Export. Select a date range, filter by gate or QR type, and download a CSV. The export includes all scan metadata: timestamp, gate, QR code ID, status, and operator.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I set time-limited access for recurring visitors?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. RECURRING QR codes support access rules including day-of-week and time-of-day restrictions. For example, you can create a QR valid only on weekdays between 8am and 6pm.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is GateFlow available in Arabic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. GateFlow fully supports Arabic (AR-EG) with a right-to-left interface across the admin dashboard, client dashboard, marketing site, and scanner app.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do webhooks work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GateFlow sends HTTP POST requests to your configured endpoint on selected events (e.g., scan.success, qrcode.created). Each delivery is logged with status and retry history. Webhook secrets use AES-256 encryption.',
      },
    },
    {
      '@type': 'Question',
      name: "What's the difference between Starter, Pro, and Enterprise?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Starter is free: 1 gate, 500 scans/month, basic analytics. Pro ($49/month): unlimited gates, unlimited scans, bulk QR, webhooks, advanced analytics. Enterprise: custom pricing, SLA, dedicated support, custom integrations.',
      },
    },
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const FAQ_SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      {
        q: 'How do I create my first gate?',
        a: "After signing up, complete the onboarding wizard. Navigate to Gates → New Gate, enter a name and location, and assign it to a project. Your first gate is ready in under a minute.",
      },
      {
        q: 'Do I need to install anything to get started?',
        a: 'The admin dashboard is web-based — no installation needed. The scanner app (for gate staff) is available for iOS and Android via Expo Go during beta, with standalone app builds coming Q2 2026.',
      },
      {
        q: 'How do I invite team members?',
        a: "Go to Settings → Team. Enter their email address and select a role (Tenant Admin or Tenant User). They'll receive an invite link valid for 48 hours.",
      },
      {
        q: 'What happens during the free trial?',
        a: 'The Starter plan is permanently free — not a trial. It supports 1 gate and up to 500 scans per month with no credit card required. You can upgrade to Pro at any time.',
      },
    ],
  },
  {
    title: 'QR Codes',
    items: [
      {
        q: 'What is the difference between SINGLE, RECURRING, and PERMANENT QR types?',
        a: 'SINGLE-use QR codes expire after the first successful scan — ideal for one-time visitor passes. RECURRING QR codes are valid on a schedule you define (e.g., every weekday). PERMANENT codes never expire and are not limited by scan count — use with caution.',
      },
      {
        q: 'How do I generate QR codes in bulk?',
        a: "Upload a CSV file with columns: name, email. GateFlow generates a signed QR code for each row and emails it to the recipient automatically. Bulk generation is available on Pro and Enterprise plans.",
      },
      {
        q: 'Can a QR code be revoked?',
        a: "Yes. Open the QR code in the dashboard and set its status to Inactive. The scanner app will reject it within seconds — even if it was previously accepted. Revocation is instant.",
      },
      {
        q: 'Are QR codes secure against screenshots and reprints?',
        a: 'Yes. Every QR code is signed with HMAC-SHA256 using a secret only your organization holds. A screenshot or photocopy of a SINGLE-use QR will be rejected after the first scan because the server marks it as used.',
      },
    ],
  },
  {
    title: 'Offline Scanning',
    items: [
      {
        q: 'What happens when the scanner has no internet connection?',
        a: "The scanner app verifies QR signatures locally using the pre-loaded signing key. Scans are queued in AES-256 encrypted local storage and automatically synced when connectivity returns. No scan is ever lost.",
      },
      {
        q: 'How long can the scanner operate offline?',
        a: "Indefinitely — there is no time limit on offline operation. The scanner will queue as many scans as needed. The only limitation is that SINGLE-use deduplication only works fully once the queue syncs.",
      },
      {
        q: 'What is scanUuid deduplication?',
        a: "Each scan event is assigned a unique UUID at the time of scanning. When the offline queue syncs, the server checks these UUIDs and ignores duplicates. This prevents a scan from being counted twice if the network drops mid-sync.",
      },
    ],
  },
  {
    title: 'Security & Compliance',
    items: [
      {
        q: 'How are passwords stored?',
        a: 'User passwords are hashed using Argon2id with parameters t=3, m=65536, p=4 — the current industry gold standard for password hashing.',
      },
      {
        q: 'How are API keys stored?',
        a: 'API keys are stored as SHA-256 hashes. The plaintext key is shown only once at creation and cannot be recovered. If lost, you must generate a new key.',
      },
      {
        q: 'Can I export scan logs for audits?',
        a: "Yes. Go to Scans → Export. Select a date range, filter by gate or QR type, and download a CSV. The export includes all scan metadata: timestamp, gate, QR code ID, status, and operator.",
      },
      {
        q: 'What is a supervisor override?',
        a: 'If a scan is rejected and the supervisor believes it should be granted (e.g., a legitimate but expired pass), they can enter their PIN to force-grant access. Every override is logged server-side with the operator identity, timestamp, and reason.',
      },
    ],
  },
  {
    title: 'Billing & Plans',
    items: [
      {
        q: 'Can I change plans at any time?',
        a: 'Yes. Upgrades take effect immediately. Downgrades take effect at the end of the current billing cycle.',
      },
      {
        q: 'What happens if I exceed my scan limit?',
        a: "On Starter (500 scans/month), scanning continues but you'll see a warning in the dashboard. We don't hard-block access — but you'll be prompted to upgrade. On Pro and Enterprise, there are no scan limits.",
      },
      {
        q: 'Do you offer annual billing?',
        a: 'Yes — annual plans include a 17% discount compared to monthly billing. Contact us to switch.',
      },
    ],
  },
];

// ─── Components ────────────────────────────────────────────────────────────────

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 dark:border-slate-800 last:border-0">
      <button
        className="flex w-full items-start justify-between gap-4 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <ChevronDown
          size={16}
          className={`mt-0.5 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{a}</p>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HelpPage() {
  const [search, setSearch] = useState('');

  const filtered = FAQ_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        !search ||
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      {/* Hero */}
      <section className="px-6 pb-12 pt-24 sm:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-indigo-600">
            HELP CENTER
          </p>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            How can we help?
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-500 dark:text-slate-400">
            Answers to the most common questions about GateFlow.
          </p>

          {/* Search */}
          <div className="relative mt-8 mx-auto max-w-lg">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search help articles..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-4xl grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: Zap, label: 'Quick Start Guide', href: '#getting-started' },
            { icon: BookOpen, label: 'QR Code Guide', href: '#qr-codes' },
            { icon: MessageCircle, label: 'Contact Support', href: '/contact' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Icon size={18} />
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 dark:text-slate-400">No results for &ldquo;{search}&rdquo;.</p>
              <button
                onClick={() => setSearch('')}
                className="mt-3 text-sm font-semibold text-indigo-600 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {filtered.map((section) => (
                <div key={section.title} id={section.title.toLowerCase().replace(/ /g, '-')}>
                  <h2 className="mb-4 text-lg font-extrabold text-slate-900 dark:text-white">
                    {section.title}
                  </h2>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 shadow-sm">
                    {section.items.map((item) => (
                      <AccordionItem key={item.q} q={item.q} a={item.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still need help */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-2xl rounded-2xl bg-indigo-700 p-10 text-center">
          <h2 className="text-2xl font-extrabold text-white">Still need help?</h2>
          <p className="mt-2 text-indigo-200">
            Our support team typically responds within 4 business hours.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </main>
  );
}
