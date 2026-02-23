'use client';

import { useState } from 'react';

const INTERESTS = [
  'Gated compound / real estate',
  'Private school / university',
  'Event / wedding venue',
  'Beach club / gym / marina',
  'Corporate office',
  'Other',
];

const TEAM_SIZES = ['Just me', '2–10', '11–50', '51–200', '200+'];

const GATES_OPTIONS = ['1–2', '3–5', '6–15', '16–50', '50+'];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    gates: '',
    teamSize: '',
    interest: '',
    message: '',
    wantDemo: false,
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('sent');
  }

  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-slate-50 to-white px-6 pb-12 pt-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Let&apos;s secure your facility
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-500 leading-relaxed">
          Tell us about your compound, school, or event venue. Our Cairo-based team
          will get back to you within one business day — or sooner on WhatsApp.
        </p>
      </section>

      {/* Main content */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5">
          {/* Sidebar */}
          <aside className="space-y-5 lg:col-span-2">
            <ContactCard
              icon="💬"
              title="WhatsApp (fastest)"
              detail="+20 100 000 0000"
              sub="Usually replied within 1 hour"
              action={{ label: 'Open WhatsApp', href: 'https://wa.me/201000000000' }}
            />
            <ContactCard
              icon="✉️"
              title="Email"
              detail="hello@gateflow.io"
              sub="Replies within 1 business day"
            />
            <ContactCard
              icon="📞"
              title="Sales call (Egypt)"
              detail="+20 100 000 0000"
              sub="Sun – Thu, 9 am – 6 pm (Cairo)"
            />
            <ContactCard
              icon="🇦🇪"
              title="Gulf inquiries"
              detail="gulf@gateflow.io"
              sub="+971 50 000 0000 (Dubai)"
            />

            {/* Office location card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Map placeholder */}
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50">
                <div className="text-center">
                  <span className="text-4xl">📍</span>
                  <p className="mt-2 text-sm font-semibold text-slate-700">Cairo, Egypt</p>
                  <p className="text-xs text-slate-400">New Cairo Business District</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-slate-900">Our offices</p>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-base">🇪🇬</span>
                    <div>
                      <p className="font-medium">Cairo (HQ)</p>
                      <p className="text-xs text-slate-400">New Cairo, Egypt</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-base">🇦🇪</span>
                    <div>
                      <p className="font-medium">Dubai</p>
                      <p className="text-xs text-slate-400">Business Bay, UAE</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-3">
            {status === 'sent' ? (
              <SuccessState email={form.email} onReset={() => {
                setStatus('idle');
                setForm({ name: '', email: '', phone: '', company: '', country: '', gates: '', teamSize: '', interest: '', message: '', wantDemo: false });
              }} />
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <p className="mb-6 text-sm font-semibold text-slate-900">
                  Tell us about your facility
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" required>
                    <input
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ahmed Hassan"
                      className={INPUT}
                    />
                  </Field>

                  <Field label="Work email" required>
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="ahmed@compound.com"
                      className={INPUT}
                    />
                  </Field>

                  <Field label="WhatsApp / Phone">
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+20 100 000 0000"
                      className={INPUT}
                    />
                  </Field>

                  <Field label="Company / Organization">
                    <input
                      name="company"
                      type="text"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Palm View Compound"
                      className={INPUT}
                    />
                  </Field>

                  <Field label="Country">
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className={INPUT}
                    >
                      <option value="">Select country…</option>
                      <option value="EG">🇪🇬 Egypt</option>
                      <option value="AE">🇦🇪 UAE</option>
                      <option value="SA">🇸🇦 Saudi Arabia</option>
                      <option value="KW">🇰🇼 Kuwait</option>
                      <option value="QA">🇶🇦 Qatar</option>
                      <option value="BH">🇧🇭 Bahrain</option>
                      <option value="OM">🇴🇲 Oman</option>
                      <option value="Other">Other</option>
                    </select>
                  </Field>

                  <Field label="Number of gates">
                    <select
                      name="gates"
                      value={form.gates}
                      onChange={handleChange}
                      className={INPUT}
                    >
                      <option value="">Select…</option>
                      {GATES_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o} gates</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Facility type" className="sm:col-span-2">
                    <select
                      name="interest"
                      value={form.interest}
                      onChange={handleChange}
                      className={INPUT}
                    >
                      <option value="">Select your facility type…</option>
                      {INTERESTS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Message" required className="sm:col-span-2">
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your current access control setup and what problems you want to solve…"
                      className={INPUT}
                    />
                  </Field>

                  {/* Demo checkbox */}
                  <div className="sm:col-span-2">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        name="wantDemo"
                        checked={form.wantDemo}
                        onChange={handleChange}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 accent-blue-600"
                      />
                      <span className="text-sm text-slate-700">
                        I&apos;d like to schedule a live demo (30 min, via Zoom or on-site in Cairo / Dubai)
                      </span>
                    </label>
                  </div>
                </div>

                {status === 'error' && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    Something went wrong. Please try again or contact us on WhatsApp.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
                  <span>🔒 Your data is never shared</span>
                  <span>·</span>
                  <span>📅 Response within 1 business day</span>
                  <span>·</span>
                  <a href="https://wa.me/201000000000" className="text-green-600 hover:underline">
                    💬 Prefer WhatsApp?
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const INPUT =
  'w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition';

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function ContactCard({
  icon,
  title,
  detail,
  sub,
  action,
}: {
  icon: string;
  title: string;
  detail: string;
  sub: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="mt-0.5 text-2xl">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-700">{detail}</p>
        <p className="mt-0.5 text-xs text-slate-400">{sub}</p>
        {action && (
          <a
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
          >
            {action.label} →
          </a>
        )}
      </div>
    </div>
  );
}

function SuccessState({
  email,
  onReset,
}: {
  email: string;
  onReset: () => void;
}) {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-green-200 bg-green-50 p-12 text-center">
      <span className="text-5xl">✅</span>
      <h2 className="mt-4 text-xl font-bold text-slate-900">Message sent!</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-600">
        We&apos;ll reply to <strong className="text-slate-900">{email}</strong> within one
        business day. For faster replies, message us on WhatsApp.
      </p>
      <a
        href="https://wa.me/201000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-block rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
      >
        💬 Message us on WhatsApp
      </a>
      <button
        onClick={onReset}
        className="mt-3 text-sm text-slate-400 hover:text-slate-700 transition-colors"
      >
        Send another message
      </button>
    </div>
  );
}
