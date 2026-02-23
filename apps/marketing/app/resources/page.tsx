import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Code2, Terminal, Webhook, KeyRound, Download, ExternalLink, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'GateFlow developer documentation, API reference, integration guides, and changelog.',
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const CHANGELOG = [
  {
    version: 'v1.4.0',
    date: 'February 15, 2026',
    badge: 'Latest',
    items: [
      'Added Supervisor Override audit trail with PIN-based force-grant',
      'Scan log export now includes Project column and project-scoped filenames',
      'Admin dashboard: scan logs audit page with date/status/gate filters',
      'Scanner app: SettingsTab redesign with haptics and location toggles',
    ],
  },
  {
    version: 'v1.3.0',
    date: 'January 28, 2026',
    badge: 'Feature',
    items: [
      'Advanced analytics: trend KPIs, per-gate success rates, QR type breakdown',
      'Peak-hours heatmap (24×7 grid) with project-scoped filtering',
      'Denied scans KPI card with 30-day trend indicator',
      'Avg scans/day metric on analytics dashboard',
    ],
  },
  {
    version: 'v1.2.0',
    date: 'January 10, 2026',
    badge: 'Feature',
    items: [
      'Multi-project support: gates and QR codes scoped to projects',
      'Project column in scan log table and exports',
      'Cookie consent banner with granular Essential/All options',
      'Dark mode support across marketing site',
    ],
  },
  {
    version: 'v1.1.0',
    date: 'December 18, 2025',
    badge: 'Feature',
    items: [
      'Webhooks: subscribe to scan events, QR activations, and access denials',
      'API Keys with scoped permissions (SHA-256 stored, shown once)',
      'Bulk CSV QR code generation with automatic email delivery',
      'Offline queue: AES-256 encrypted local storage with LWW sync',
    ],
  },
  {
    version: 'v1.0.0',
    date: 'November 30, 2025',
    badge: 'Launch',
    items: [
      'Initial public release of GateFlow SaaS platform',
      'HMAC-SHA256 signed QR codes with offline scanner verification',
      'Multi-gate management with per-gate analytics',
      'JWT auth with Argon2id password hashing and token rotation',
    ],
  },
];

const API_ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/auth/login',
    desc: 'Authenticate user and receive JWT access + refresh tokens',
    color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400',
  },
  {
    method: 'POST',
    path: '/api/qrcodes',
    desc: 'Create a new QR code (SINGLE, RECURRING, or PERMANENT)',
    color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400',
  },
  {
    method: 'GET',
    path: '/api/qrcodes',
    desc: 'List QR codes for the active project',
    color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400',
  },
  {
    method: 'POST',
    path: '/api/qrcodes/validate',
    desc: 'Validate a scanned QR payload and record a scan log',
    color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400',
  },
  {
    method: 'GET',
    path: '/api/scans',
    desc: 'Retrieve scan history with filters (date, gate, status)',
    color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400',
  },
  {
    method: 'POST',
    path: '/api/scans/bulk',
    desc: 'Bulk sync offline scans from scanner app (deduplication via scanUuid)',
    color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400',
  },
  {
    method: 'GET',
    path: '/api/scans/export',
    desc: 'Export scan logs as CSV with optional project/gate/status filters',
    color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400',
  },
  {
    method: 'GET',
    path: '/api/gates',
    desc: 'List gates for the authenticated organization',
    color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400',
  },
  {
    method: 'POST',
    path: '/api/webhooks',
    desc: 'Register a webhook endpoint for scan events',
    color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400',
  },
  {
    method: 'POST',
    path: '/api/api-keys',
    desc: 'Generate a scoped API key (plaintext shown once)',
    color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400',
  },
];

const GUIDES = [
  {
    icon: Terminal,
    title: 'Quick Start',
    desc: 'Set up GateFlow from scratch: create an org, add a gate, generate your first QR, and scan it.',
    href: '/contact',
  },
  {
    icon: Webhook,
    title: 'Webhook Integration',
    desc: 'Subscribe to scan events and push real-time access data to your own systems.',
    href: '/contact',
  },
  {
    icon: KeyRound,
    title: 'API Key Authentication',
    desc: 'Authenticate server-to-server requests using scoped API keys.',
    href: '/contact',
  },
  {
    icon: Download,
    title: 'CSV Bulk QR Guide',
    desc: 'Upload a CSV of names and emails to generate and deliver hundreds of QR passes at once.',
    href: '/contact',
  },
  {
    icon: Code2,
    title: 'Scanner App Integration',
    desc: 'Embed the GateFlow scanner flow into your own Expo-based mobile application.',
    href: '/contact',
  },
  {
    icon: BookOpen,
    title: 'Security & Signing',
    desc: 'Understand the HMAC-SHA256 QR signing architecture and how offline verification works.',
    href: '/blog/how-hmac-sha256-makes-your-qr-codes-unfakeable',
  },
];

const BADGE_COLORS: Record<string, string> = {
  Latest: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-400',
  Feature: 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-400',
  Launch: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-400',
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="px-6 pb-12 pt-24 sm:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-indigo-600">
            DEVELOPER RESOURCES
          </p>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Build with GateFlow
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-500 dark:text-slate-400">
            API reference, integration guides, and the full changelog — everything you need to
            integrate GateFlow into your facility or product.
          </p>
        </div>
      </section>

      {/* Guides */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-8">
            Integration Guides
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((guide) => {
              const Icon = guide.icon;
              return (
                <Link
                  key={guide.title}
                  href={guide.href}
                  className="group rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-xl transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {guide.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Read guide <ArrowRight size={12} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="px-6 py-16 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              API Reference
            </h2>
            <span className="rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 px-3 py-1 text-xs font-bold">
              REST · JSON · JWT Auth
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
            {/* Auth hint */}
            <div className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-5 py-3 text-xs text-slate-500 dark:text-slate-400">
              Base URL:{' '}
              <code className="font-mono text-indigo-600 dark:text-indigo-400">
                https://app.gateflow.io/api
              </code>
              {' · '}
              Auth:{' '}
              <code className="font-mono text-slate-600 dark:text-slate-300">
                Authorization: Bearer &lt;access_token&gt;
              </code>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Endpoint
                  </th>
                  <th className="hidden sm:table-cell px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {API_ENDPOINTS.map((ep, i) => (
                  <tr
                    key={ep.path}
                    className={`border-b border-slate-50 dark:border-slate-700/50 last:border-0 ${
                      i % 2 !== 0 ? 'bg-slate-50/40 dark:bg-slate-800/40' : ''
                    }`}
                  >
                    <td className="px-5 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-bold font-mono ${ep.color}`}
                      >
                        {ep.method}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <code className="text-xs font-mono text-slate-700 dark:text-slate-300">
                        {ep.path}
                      </code>
                    </td>
                    <td className="hidden sm:table-cell px-5 py-3 text-xs text-slate-500 dark:text-slate-400">
                      {ep.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Full OpenAPI spec available on request.{' '}
            <Link href="/contact" className="text-indigo-600 hover:underline">
              Contact us
            </Link>{' '}
            to get access.
          </p>
        </div>
      </section>

      {/* Changelog */}
      <section className="px-6 py-16" id="changelog">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-8">
            Changelog
          </h2>
          <div className="relative border-l-2 border-slate-200 dark:border-slate-700 pl-6 space-y-10">
            {CHANGELOG.map((entry) => (
              <div key={entry.version} className="relative">
                <div className="absolute -left-[1.8125rem] top-1 h-3.5 w-3.5 rounded-full border-2 border-indigo-600 bg-white dark:bg-slate-900" />
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {entry.version}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      BADGE_COLORS[entry.badge] ?? 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {entry.badge}
                  </span>
                  <span className="text-xs text-slate-400">{entry.date}</span>
                </div>
                <ul className="space-y-1.5">
                  {entry.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Ready to integrate?
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Get your API keys and start building in minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-xl bg-indigo-700 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 hover:-translate-y-0.5 hover:bg-indigo-600 transition-all"
            >
              Request API Access
            </Link>
            <Link
              href="/blog/how-hmac-sha256-makes-your-qr-codes-unfakeable"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-7 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Security Deep Dive
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
