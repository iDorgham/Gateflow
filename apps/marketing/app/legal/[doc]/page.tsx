import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface LegalDoc {
  title: string;
  description: string;
  lastUpdated: string;
  sections: Array<{ heading: string; body: string; list?: string[] }>;
}

const LEGAL_DOCS: Record<string, LegalDoc> = {
  privacy: {
    title: 'Privacy Policy',
    description: 'How GateFlow collects, uses, and protects your personal information.',
    lastUpdated: 'February 1, 2026',
    sections: [
      {
        heading: '1. Information We Collect',
        body: 'We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.',
        list: [
          'Account data: name, email address, organization name, role',
          'Usage data: scan logs, QR code metadata, gate activity',
          'Technical data: IP address, browser type, device identifiers',
          'Payment data: processed by Stripe — we never store card details',
        ],
      },
      {
        heading: '2. How We Use Your Information',
        body: 'We use the information we collect to provide, maintain, and improve our services.',
        list: [
          'Authenticate users and enforce access control',
          'Process and log QR scan events for audit purposes',
          'Send transactional emails (QR codes, invitations, receipts)',
          'Detect and prevent fraud, abuse, and security incidents',
          'Comply with legal obligations',
        ],
      },
      {
        heading: '3. Data Retention',
        body: 'We retain your data for as long as your account is active or as needed to provide services. Scan logs are retained for the period selected in your plan settings (default 12 months). You may request deletion of your account and associated data at any time.',
      },
      {
        heading: '4. Data Sharing',
        body: 'We do not sell, trade, or rent your personal information to third parties. We may share data with service providers who assist in operating our platform (hosting, email delivery, analytics) under strict data processing agreements.',
      },
      {
        heading: '5. Security',
        body: 'We implement industry-standard security measures including AES-256 encryption for data at rest, TLS 1.3 for data in transit, Argon2id password hashing, and regular security audits. However, no method of transmission over the internet is 100% secure.',
      },
      {
        heading: '6. Your Rights',
        body: 'Depending on your location, you may have the right to access, correct, or delete your personal data. To exercise these rights, contact us at privacy@gateflow.io.',
      },
      {
        heading: '7. Contact',
        body: 'For privacy-related questions, contact our Data Protection Officer at privacy@gateflow.io or write to GateFlow Technologies, Cairo, Egypt.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    description: 'The terms that govern your use of GateFlow services.',
    lastUpdated: 'February 1, 2026',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: 'By accessing or using GateFlow, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, do not use our services.',
      },
      {
        heading: '2. Use of Services',
        body: 'You may use GateFlow only for lawful purposes and in accordance with these Terms. You agree not to:',
        list: [
          'Use the service for any unlawful or unauthorized purpose',
          'Attempt to reverse-engineer, decompile, or extract source code',
          'Use the service to generate fraudulent or unauthorized access credentials',
          'Interfere with or disrupt the integrity or performance of the service',
          'Attempt to gain unauthorized access to any accounts or systems',
        ],
      },
      {
        heading: '3. Account Responsibilities',
        body: 'You are responsible for maintaining the security of your account credentials and for all activity under your account. Notify us immediately of any unauthorized use at security@gateflow.io.',
      },
      {
        heading: '4. Subscription and Billing',
        body: 'Paid plans are billed monthly or annually in advance. Refunds are provided at our discretion within 14 days of payment for annual plans. Monthly plan fees are non-refundable. We reserve the right to change pricing with 30 days notice.',
      },
      {
        heading: '5. Intellectual Property',
        body: "GateFlow and its licensors own all right, title, and interest in and to the service. These Terms do not grant you any right, title, or interest in GateFlow's intellectual property.",
      },
      {
        heading: '6. Limitation of Liability',
        body: "To the maximum extent permitted by law, GateFlow shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.",
      },
      {
        heading: '7. Termination',
        body: 'We may terminate or suspend your account immediately, without prior notice, for any conduct that we believe violates these Terms or is harmful to other users, GateFlow, or third parties.',
      },
      {
        heading: '8. Governing Law',
        body: 'These Terms are governed by the laws of the Arab Republic of Egypt. Any disputes shall be subject to the exclusive jurisdiction of the courts of Cairo, Egypt.',
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    description: 'How GateFlow uses cookies and similar tracking technologies.',
    lastUpdated: 'February 1, 2026',
    sections: [
      {
        heading: '1. What Are Cookies',
        body: "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.",
      },
      {
        heading: '2. Essential Cookies',
        body: 'These cookies are necessary for the website to function and cannot be disabled. They include:',
        list: [
          'Authentication cookies: keep you logged in during your session',
          'CSRF tokens: protect against cross-site request forgery attacks',
          'Load balancer cookies: ensure requests reach the correct server',
        ],
      },
      {
        heading: '3. Analytics Cookies',
        body: 'With your consent, we use analytics cookies to understand how visitors interact with our marketing website. These cookies collect aggregated, anonymized data only and cannot be used to identify you personally.',
      },
      {
        heading: '4. Your Choices',
        body: "You can choose to accept all cookies or essential cookies only using our cookie banner. You may also manage cookies through your browser settings, though this may affect website functionality.",
      },
      {
        heading: '5. Changes',
        body: 'We may update this Cookie Policy from time to time. Continued use of the site after changes constitutes acceptance.',
      },
    ],
  },
  gdpr: {
    title: 'GDPR & Data Protection',
    description: 'How GateFlow complies with the General Data Protection Regulation (GDPR) and regional data protection laws.',
    lastUpdated: 'February 1, 2026',
    sections: [
      {
        heading: '1. Legal Basis for Processing',
        body: 'We process personal data under the following legal bases:',
        list: [
          'Contractual necessity: processing required to deliver our services',
          'Legitimate interests: fraud prevention, security monitoring, product improvement',
          'Consent: marketing communications and optional analytics',
          'Legal obligation: compliance with applicable laws',
        ],
      },
      {
        heading: '2. Data Subject Rights',
        body: 'If you are located in the EU/EEA or other jurisdictions with similar rights, you have the following rights:',
        list: [
          'Right of access: request a copy of data we hold about you',
          'Right to rectification: correct inaccurate personal data',
          'Right to erasure ("right to be forgotten")',
          'Right to restriction of processing',
          'Right to data portability',
          'Right to object to processing',
          'Rights related to automated decision-making',
        ],
      },
      {
        heading: '3. International Transfers',
        body: 'Your data may be processed in countries outside the EU/EEA. When we transfer data internationally, we use appropriate safeguards including Standard Contractual Clauses approved by the European Commission.',
      },
      {
        heading: '4. Data Protection Officer',
        body: 'Our Data Protection Officer can be contacted at dpo@gateflow.io for any GDPR-related enquiries.',
      },
      {
        heading: '5. Supervisory Authority',
        body: 'You have the right to lodge a complaint with your local supervisory authority if you believe we have not complied with applicable data protection law.',
      },
    ],
  },
};

const DOC_LINKS = [
  { slug: 'privacy', label: 'Privacy Policy' },
  { slug: 'terms', label: 'Terms of Service' },
  { slug: 'cookies', label: 'Cookie Policy' },
  { slug: 'gdpr', label: 'GDPR & Data Protection' },
];

interface Props {
  params: { doc: string };
}

export function generateStaticParams() {
  return Object.keys(LEGAL_DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = LEGAL_DOCS[params.doc];
  if (!doc) return {};
  return { title: doc.title, description: doc.description };
}

export default function LegalPage({ params }: Props) {
  const doc = LEGAL_DOCS[params.doc];
  if (!doc) notFound();

  return (
    <main>
      <section className="px-6 pb-16 pt-24 sm:pt-32">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>

          <div className="grid md:grid-cols-4 gap-10">
            {/* Sidebar */}
            <aside className="md:col-span-1">
              <nav className="space-y-1">
                {DOC_LINKS.map((link) => (
                  <Link
                    key={link.slug}
                    href={`/legal/${link.slug}`}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      params.doc === link.slug
                        ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <div className="md:col-span-3">
              <div className="mb-2 text-xs text-slate-400">Last updated: {doc.lastUpdated}</div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {doc.title}
              </h1>
              <p className="mt-3 text-slate-500 dark:text-slate-400">{doc.description}</p>

              <div className="mt-10 space-y-8">
                {doc.sections.map((section) => (
                  <div key={section.heading}>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                      {section.heading}
                    </h2>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {section.body}
                    </p>
                    {section.list && (
                      <ul className="mt-3 space-y-1.5 ml-4">
                        {section.list.map((item) => (
                          <li
                            key={item}
                            className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-5 text-sm text-slate-500 dark:text-slate-400">
                Questions about this policy? Email us at{' '}
                <a href="mailto:legal@gateflow.io" className="text-indigo-600 hover:underline">
                  legal@gateflow.io
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
