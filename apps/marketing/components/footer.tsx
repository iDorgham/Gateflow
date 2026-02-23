import Link from 'next/link';

const LINKS = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Security', href: '/#security' },
    { label: "What's New", href: '/resources#changelog' },
  ],
  Solutions: [
    { label: 'Gated Compounds', href: '/solutions#compounds' },
    { label: 'Schools', href: '/solutions#schools' },
    { label: 'Events & Venues', href: '/solutions#events' },
    { label: 'Clubs & Marinas', href: '/solutions#clubs' },
  ],
  Resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Help Center', href: '/help' },
    { label: 'API Docs', href: '/resources#api' },
    { label: 'Changelog', href: '/resources#changelog' },
  ],
  Company: [
    { label: 'About Us', href: '/company#about' },
    { label: 'Careers', href: '/company#careers' },
    { label: 'Press', href: '/company#press' },
    { label: 'Contact', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand — 2 cols */}
          <div className="lg:col-span-2 lg:pr-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-sm font-bold text-white shadow-md">
                G
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                GateFlow
              </span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              End-to-end digital gate infrastructure for gated compounds, schools, events, and clubs across the MENA region.
            </p>
            <div className="mt-5 flex gap-2">
              <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                🇪🇬 Egypt
              </span>
              <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                🇦🇪 Gulf
              </span>
            </div>
            <div className="mt-5 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <p className="flex items-center gap-2">
                <span className="text-indigo-400">📧</span> hello@gateflow.io
              </p>
              <p className="flex items-center gap-2">
                <span className="text-indigo-400">📞</span> +20 100 000 0000
              </p>
              <p className="flex items-center gap-2">
                <span className="text-indigo-400">📍</span> Cairo, Egypt
              </p>
            </div>
            <a
              href="https://wa.me/201000000000"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#25D366]/10 px-4 py-2 text-sm font-bold text-[#1DA851] hover:bg-[#25D366]/20 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {section}
              </p>
              <ul className="mt-5 space-y-3">
                {items.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-8 sm:flex-row text-sm">
          <p className="text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} GateFlow Technologies Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/legal/privacy"
              className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/legal/cookies"
              className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
