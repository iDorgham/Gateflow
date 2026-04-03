'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@gate-access/ui';
import {
  Menu,
  X,
  ChevronRight,
  Shield,
  ChevronDown,
  Building,
  LayoutGrid,
  BookOpen,
  Users,
  Search,
  Home,
  DollarSign,
  LayoutTemplate,
} from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { I18nLink } from './i18n-link';
import Link from 'next/link';
import type { Locale } from '../i18n-config';
import { useTranslation } from '../hooks/use-translation';

const GateFlowLogo = () => (
  <Shield size={26} strokeWidth={2.2} fill="currentColor" fillOpacity={0.15} />
);

export function Nav({ locale }: { locale: Locale }) {
  const { t } = useTranslation('navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const isRtl = locale === 'ar-EG';

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', isHome: true, icon: Home },
    {
      href: '/solutions',
      label: t('header.menu.solutions'),
      hasMega: true,
      items: [
        {
          href: '/solutions/residential',
          label:
            t('header.dropdowns.solutions.compounds.label') ||
            'Residential Communities',
          desc:
            t('header.dropdowns.solutions.compounds.description') ||
            'Secure access for gated communities.',
          icon: Building,
        },
        {
          href: '/solutions/commercial',
          label:
            t('header.dropdowns.solutions.commercial.label') ||
            'Commercial Hubs',
          desc:
            t('header.dropdowns.solutions.commercial.description') ||
            'High-density office access control.',
          icon: LayoutGrid,
        },
        {
          href: '/solutions/education',
          label: 'Education Campus',
          desc: 'Campus security for students and staff.',
          icon: BookOpen,
        },
        {
          href: '/solutions/events',
          label: 'Event Management',
          desc: 'Temporary QR access for massive crowds.',
          icon: Users,
        },
      ],
      quickLinks: {
        title: 'Our Hardware',
        links: [
          { label: 'Smart Pro Scanners', href: '/hardware/scanners' },
          { label: 'Biometric Wall Readers', href: '/hardware/biometrics' },
          { label: 'LPR ANPR Cameras', href: '/hardware/lpr' },
          { label: 'Cloud Access Controllers', href: '/hardware/controller' },
          { label: 'NFC Access Cards', href: '/hardware/cards' },
        ],
      },
      sliderElements: [
        {
          badge: 'Residential',
          title: 'Smart Compounds',
          desc: 'Gate access for luxury villas.',
          image: '/images/solutions/me_compounds.png',
        },
        {
          badge: 'Education',
          title: 'Campus Security',
          desc: 'Automated student access.',
          image: '/images/solutions/me_schools.png',
        },
        {
          badge: 'Events',
          title: 'Festival Passes',
          desc: 'High-throughput crowd QR scanning.',
          image: '/images/solutions/me_events.png',
        },
        {
          badge: 'Commercial',
          title: 'Enterprise Hubs',
          desc: 'Frictionless corporate speedgates.',
          image: '/images/solutions/me_clubs.png',
        },
        {
          badge: 'Residential',
          title: 'Smart Compounds',
          desc: 'Gate access for luxury villas.',
          image: '/images/solutions/me_compounds.png',
        },
      ],
    },
    {
      href: '/pricing',
      label: t('header.menu.pricing'),
      hasMega: false,
      icon: DollarSign,
    },
    {
      href: '/resources',
      label: t('header.menu.resources'),
      hasMega: true,
      items: [
        {
          href: '/resources/docs',
          label: t('header.dropdowns.company.resources.label') || 'Help Center',
          desc: 'Platform setup guides and documentation.',
          icon: BookOpen,
        },
        {
          href: '/resources/case-studies',
          label: 'Customer Stories',
          desc: 'See how leading operators secure perimeters.',
          icon: Users,
        },
        {
          href: '/resources/changelog',
          label: 'Platform Changelog',
          desc: 'Track all the latest feature releases.',
          icon: LayoutTemplate,
        },
        {
          href: '/resources/security',
          label: 'Security & Privacy',
          desc: 'Enterprise RBAC & GDPR compliance details.',
          icon: Shield,
        },
      ],
      quickLinks: {
        title: 'Developer Tools',
        links: [
          { label: 'API Reference', href: '/resources/api' },
          { label: 'Webhooks & Events', href: '/resources/webhooks' },
          { label: 'Mobile SDK', href: '/resources/sdk' },
          { label: 'System Status', href: '/resources/status' },
          { label: 'Developer Community', href: '/resources/community' },
        ],
      },
      featuredPosts: [
        {
          title: 'Securing 10,000 Visitors with QR Fast-Pass',
          date: 'Sep 12',
          readTime: '5 min read',
          href: '/blog/qr-fast',
          image: '/images/solutions/me_events.png',
        },
        {
          title: 'Cloud Access Control for Enterprise Offices',
          date: 'Oct 24',
          readTime: '4 min read',
          href: '/blog/cloud-access',
          image: '/images/solutions/me_clubs.png',
        },
      ],
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? 'bg-ds-surface/90 shadow-sm backdrop-blur-xl border-b border-ds-border'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-20 w-full max-w-[1536px] items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <I18nLink
            locale={locale}
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="text-ds-text-brand transition-transform duration-300 group-hover:scale-110">
              <GateFlowLogo />
            </div>
            <span className="text-[20px] font-black tracking-tighter text-ds-text-heading">
              Gate<span className="text-ds-text-brand">Flow</span>
            </span>
          </I18nLink>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 xl:gap-2 me-auto lg:flex ms-4">
            {navLinks.map((link) => {
              const NavIcon = link.icon;
              return (
                <div key={link.href} className="group">
                  <I18nLink
                    locale={locale}
                    href={link.href}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-transparent text-[14px] font-bold text-ds-text-subtle transition-all hover:bg-ds-surface-raised hover:border-ds-border hover:text-ds-text-heading hover:shadow-sm"
                  >
                    {link.isHome && NavIcon ? (
                      <div className="flex items-center justify-center p-1.5 rounded-full bg-ds-surface border border-ds-border shadow-sm text-ds-icon-brand group-hover:bg-ds-background-brand-bold group-hover:text-ds-icon-inverse group-hover:border-ds-border-brand transition-colors">
                        <NavIcon size={14} strokeWidth={2.5} />
                      </div>
                    ) : (
                      NavIcon && (
                        <NavIcon
                          size={16}
                          strokeWidth={2.5}
                          className="text-ds-icon-subtle group-hover:text-ds-icon-brand transition-colors"
                        />
                      )
                    )}

                    {!link.isHome && link.label}
                    {link.hasMega && (
                      <ChevronDown
                        size={14}
                        className="opacity-60 transition-transform group-hover:rotate-180"
                      />
                    )}
                  </I18nLink>

                  {/* Mega Menu Dropdown */}
                  {link.hasMega && (
                    <div
                      className={`fixed top-[80px] left-0 right-0 mx-auto w-full px-4 lg:px-8 opacity-0 invisible translate-y-6 scale-[0.98] blur-sm group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:blur-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-[100] pointer-events-none group-hover:pointer-events-auto origin-top max-w-[1536px]`}
                    >
                      <div
                        className={`border border-ds-border bg-ds-surface/95 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.6)] rounded-[24px] overflow-hidden flex mx-auto min-h-[360px]`}
                      >
                        {/* 1. Left Sidebar: Quick Links (Always render) */}
                        {link.quickLinks && (
                          <div
                            className={`w-[260px] shrink-0 p-6 xl:p-8 border-e border-ds-border/60 bg-ds-surface flex flex-col`}
                          >
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtlest mb-5">
                              {link.quickLinks.title}
                            </h4>
                            <div className="flex flex-col gap-1.5">
                              {link.quickLinks.links.map((ql, i) => (
                                <Link
                                  key={i}
                                  href={ql.href}
                                  className="text-[13px] font-bold text-ds-text-subtle hover:text-ds-text-brand hover:translate-x-1 hover:rtl:-translate-x-1 hover:bg-ds-surface-raised px-3 py-2 -mx-3 rounded-[10px] transition-all flex items-center justify-between group/ql"
                                >
                                  {ql.label}
                                  <ChevronRight
                                    size={14}
                                    className="opacity-0 -translate-x-2 rtl:translate-x-2 rtl:rotate-180 group-hover/ql:opacity-100 group-hover/ql:translate-x-0 group-hover/ql:rtl:translate-x-0 transition-all text-ds-icon-brand"
                                  />
                                </Link>
                              ))}
                            </div>

                            {/* Dev CTA - if Resources Menu type */}
                            {!link.sliderElements && (
                              <div className="mt-auto pt-6">
                                <div className="rounded-xl bg-ds-background-brand-subtle border border-ds-border-brand/20 p-4">
                                  <h5 className="text-[12px] font-black text-ds-text-brand mb-1">
                                    Build on GateFlow
                                  </h5>
                                  <p className="text-[10px] font-semibold text-ds-text-subtle leading-tight mb-2">
                                    Integrate physical security directly into
                                    your stack.
                                  </p>
                                  <Link
                                    href="/docs/api"
                                    className="text-[10px] font-black uppercase tracking-widest text-ds-text-brand flex items-center gap-1 hover:gap-1.5 transition-all"
                                  >
                                    Dev Docs{' '}
                                    <ChevronRight
                                      size={12}
                                      className="rtl:rotate-180"
                                    />
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 2. Main Link Grid (High Density ADS Styling) */}
                        <div
                          className={`flex-1 flex flex-col justify-center p-6 xl:p-8 bg-ds-surface-sunken`}
                        >
                          <div
                            className={`grid grid-cols-2 gap-3 mb-6 lg:pe-6`}
                          >
                            {link.items?.map((item, idx) => {
                              const Icon = item.icon;
                              return (
                                <I18nLink
                                  key={idx}
                                  locale={locale}
                                  href={item.href}
                                  className="flex gap-3.5 p-4 rounded-[16px] xl:rounded-[20px] hover:bg-ds-surface hover:shadow-sm transition-all group/item border border-transparent hover:border-ds-border items-start"
                                >
                                  <div className="flex shrink-0 h-[44px] w-[44px] xl:h-[48px] xl:w-[48px] items-center justify-center rounded-[12px] bg-ds-surface-raised text-ds-text-subtle shadow-sm border border-ds-border group-hover/item:bg-ds-background-brand-bold group-hover/item:text-ds-text-inverse group-hover/item:border-transparent group-hover/item:scale-105 group-hover/item:-rotate-3 transition-transform duration-300">
                                    <Icon size={22} strokeWidth={2.2} />
                                  </div>
                                  <div className="flex flex-col pt-0.5">
                                    <span className="text-[14px] xl:text-[15px] font-black text-ds-text-heading leading-tight mb-0.5 group-hover/item:text-ds-text-brand transition-colors">
                                      {item.label}
                                    </span>
                                    <span className="text-[11px] xl:text-[12px] text-ds-text-subtle font-semibold leading-[1.35] pr-2 xl:pr-4">
                                      {item.desc}
                                    </span>
                                  </div>
                                </I18nLink>
                              );
                            })}
                          </div>

                          {/* Bottom Action Footer inside the Grid */}
                          <div
                            className={`pt-4 mt-auto border-t border-ds-border/60 flex items-center justify-end pe-4`}
                          >
                            <Link
                              href={link.href}
                              className="group/action flex items-center gap-1.5 text-[12px] font-black text-ds-text-brand bg-transparent hover:bg-ds-surface px-4 py-2 rounded-full transition-all"
                            >
                              View all {link.label}
                              <ChevronRight
                                size={14}
                                className={`transition-transform duration-300 rtl:rotate-180 group-hover/action:translate-x-1 group-hover/action:rtl:-translate-x-1`}
                              />
                            </Link>
                          </div>
                        </div>

                        {/* 3. Right: Featured Blog Posts (Resources view) */}
                        {link.featuredPosts && !link.sliderElements && (
                          <div
                            className={`w-[360px] shrink-0 p-6 xl:p-8 border-s border-ds-border/60 bg-ds-surface flex flex-col`}
                          >
                            <div className="flex items-center justify-between mb-5">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtlest">
                                Latest Insights
                              </h4>
                              <Link
                                href="/blog"
                                className="text-[10px] font-black text-ds-text-brand hover:underline rtl:hover:underline"
                              >
                                View All
                              </Link>
                            </div>

                            <div className="flex flex-col gap-4">
                              {link.featuredPosts.map((post, i) => (
                                <Link
                                  key={i}
                                  href={post.href}
                                  className="group/post flex flex-col gap-2.5 relative"
                                >
                                  <div className="w-full h-[100px] xl:h-[110px] rounded-xl bg-ds-surface-raised border border-ds-border overflow-hidden relative">
                                    <img
                                      src={post.image}
                                      alt={post.title}
                                      className="w-full h-full object-cover opacity-[0.85] group-hover/post:opacity-100 group-hover/post:scale-105 transition-all duration-[3s] ease-out"
                                    />
                                  </div>
                                  <div>
                                    <h5 className="text-[13px] font-black text-ds-text-heading leading-[1.2] group-hover/post:text-ds-text-brand transition-colors mb-1.5">
                                      {post.title}
                                    </h5>
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-ds-text-subtle uppercase tracking-widest">
                                      <span>{post.date}</span>
                                      <div className="w-1 h-1 rounded-full bg-ds-border-bold" />
                                      <span>{post.readTime}</span>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 3. Right: Autoplaying Featured Slider (Solutions view) */}
                        {link.sliderElements && (
                          <div
                            className={`w-[360px] shrink-0 flex flex-col justify-center p-6 xl:p-8 border-s border-ds-border/60 bg-ds-surface`}
                          >
                            <div className="relative w-full h-[280px] xl:h-[300px] rounded-[24px] overflow-hidden group/slider shadow-lg border border-ds-border">
                              <style>{`
                              @keyframes megaSlider {
                                0%, 15% { transform: translateX(0); }
                                20%, 35% { transform: translateX(${isRtl ? '20' : '-20'}%); }
                                40%, 55% { transform: translateX(${isRtl ? '40' : '-40'}%); }
                                60%, 75% { transform: translateX(${isRtl ? '60' : '-60'}%); }
                                80%, 95% { transform: translateX(${isRtl ? '80' : '-80'}%); }
                                100% { transform: translateX(0); }
                              }
                              .mega-slider-track {
                                animation: megaSlider 26s cubic-bezier(0.25, 1, 0.5, 1) infinite;
                              }
                              .group\\/slider:hover .mega-slider-track {
                                animation-play-state: paused;
                              }
                            `}</style>
                              <div className="flex w-[500%] h-full mega-slider-track">
                                {link.sliderElements.map((s, i) => (
                                  <div
                                    key={i}
                                    className="w-1/5 h-full p-6 flex flex-col justify-end relative overflow-hidden group/slide cursor-pointer"
                                  >
                                    {/* Photo Background */}
                                    <img
                                      src={s.image}
                                      alt={s.title}
                                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] ease-out group-hover/slide:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-0 transition-opacity duration-500 group-hover/slide:opacity-85" />

                                    <span className="relative z-10 w-fit px-2.5 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-widest text-[#FFF] mb-3 shadow-md border border-white/20 bg-black/40 backdrop-blur-md">
                                      {s.badge}
                                    </span>
                                    <h4 className="relative z-10 text-[20px] font-black text-white leading-tight mb-1 drop-shadow-md">
                                      {s.title}
                                    </h4>
                                    <p className="relative z-10 text-[13px] font-bold text-ds-text-inverse leading-snug drop-shadow-md opacity-90">
                                      {s.desc}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Actions */}
          <div className={`flex items-center gap-3 xl:gap-4`}>
            {/* Search Bar */}
            <div className="hidden xl:flex relative items-center group/search">
              <div
                className={`absolute start-3 text-ds-text-subtle group-focus-within/search:text-ds-icon-brand transition-colors pointer-events-none`}
              >
                <Search size={16} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Search resources..."
                className={`h-11 rounded-full bg-ds-surface-sunken border border-ds-border focus:border-ds-border-brand focus:ring-1 focus:ring-ds-border-brand text-[13px] font-bold text-ds-text outline-none ps-9 pe-4 w-[220px] 2xl:w-[280px] shadow-inner transition-all placeholder:text-ds-text-subtlest`}
              />
              <div
                className={`absolute end-3 flex items-center justify-center pointer-events-none`}
              >
                <span className="text-[10px] font-black text-ds-text-subtlest border border-ds-border px-1.5 py-0.5 rounded-md bg-ds-surface opacity-70">
                  ⌘K
                </span>
              </div>
            </div>
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggle />

            <div className={`hidden items-center gap-3 md:flex`}>
              <Link href={`https://app.gateflow.site/${locale}/login`}>
                <Button
                  variant="subtle"
                  className="font-bold rounded-full hover:bg-ds-surface-raised hover:shadow-sm"
                >
                  {t('header.actions.signIn')}
                </Button>
              </Link>
              <I18nLink locale={locale} href="/contact">
                <Button
                  variant="brand"
                  className="font-black rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-ds-text-inverse group/btn"
                >
                  {t('header.actions.getStarted')}
                  <ChevronRight
                    size={16}
                    className={`opacity-70 ms-1 rtl:rotate-180 group-hover/btn:translate-x-1 group-hover/btn:rtl:-translate-x-1 transition-transform`}
                  />
                </Button>
              </I18nLink>
            </div>

            <Button
              variant="subtle"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open navigation menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-ds-border bg-ds-surface/95 backdrop-blur-xl lg:hidden"
            >
              <div className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <I18nLink
                    key={link.href}
                    locale={locale}
                    href={link.href}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-bold text-ds-text-subtle hover:bg-ds-surface-raised hover:text-ds-text-heading transition-all shadow-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                    <ChevronRight
                      size={16}
                      className={`opacity-40 ${isRtl ? '-scale-x-100' : ''}`}
                    />
                  </I18nLink>
                ))}
                <div className="mt-4 flex flex-col gap-3 border-t border-ds-border pt-4 px-2">
                  <Link href={`https://app.gateflow.site/${locale}/login`}>
                    <Button
                      variant="subtle"
                      size="lg"
                      className="w-full justify-center font-bold rounded-full border border-ds-border"
                    >
                      {t('header.actions.signIn')}
                    </Button>
                  </Link>
                  <I18nLink locale={locale} href="/contact">
                    <Button
                      variant="brand"
                      size="lg"
                      className="w-full justify-center font-black rounded-full shadow-md text-ds-text-inverse"
                    >
                      {t('header.actions.getStarted')}
                    </Button>
                  </I18nLink>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      {/* Spacer to offset fixed nav */}
      <div className="h-20" />
    </>
  );
}
