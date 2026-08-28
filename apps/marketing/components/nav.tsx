'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, GateFlowLogo } from '@gateflow/ui';
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

const panelVariants = {
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2,
      ease: [0.32, 0, 0.67, 0],
    },
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
} as const;

export function Nav({ locale }: { locale: Locale }) {
  const { t } = useTranslation('navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [scrolled, setScrolled] = React.useState(false);
  const isRtl = locale === 'ar-EG';

  const closeTimeout = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  const handleMouseEnter = (menu: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const navLinks = [
    { href: '/', label: isRtl ? 'الرئيسية' : 'Home', isHome: true, icon: Home },
    {
      href: '/solutions',
      label: t('header.menu.solutions'),
      hasMega: true,
      items: [
        {
          href: '/solutions/residential',
          label: t('header.dropdowns.solutions.compounds.label'),
          description: t('header.dropdowns.solutions.compounds.description'),
          icon: Building,
        },
        {
          href: '/solutions/commercial',
          label: t('header.dropdowns.solutions.commercial.label'),
          description: t('header.dropdowns.solutions.commercial.description'),
          icon: LayoutGrid,
        },
        {
          href: '/solutions/education',
          label: isRtl ? 'المدارس والجامعات' : 'Education Campus',
          description: isRtl
            ? 'تأمين الحرم التعليمي وإدارة استلام الطلاب بأمان.'
            : 'Campus security for students and staff.',
          icon: BookOpen,
        },
        {
          href: '/solutions/events',
          label: isRtl ? 'الفعاليات والمؤتمرات' : 'Event Management',
          description: isRtl
            ? 'دخول خاطف وسلس للحشود الكبيرة دون أي اختناق.'
            : 'Temporary QR access for massive crowds.',
          icon: Users,
        },
      ],
      quickLinks: {
        title: isRtl ? 'حلول العتاد والبوابات' : 'Our Hardware',
        links: [
          {
            label: isRtl ? 'أجهزة مسح ذكية' : 'Smart Pro Scanners',
            href: '/hardware/scanners',
          },
          {
            label: isRtl ? 'قارئات حائط حيوية' : 'Biometric Wall Readers',
            href: '/hardware/biometrics',
          },
          {
            label: isRtl ? 'كاميرات قراءة لوحات (LPR)' : 'LPR ANPR Cameras',
            href: '/hardware/lpr',
          },
          {
            label: isRtl ? 'وحدات تحكم سحابية' : 'Cloud Access Controllers',
            href: '/hardware/controller',
          },
          {
            label: isRtl ? 'بطاقات NFC الذكية' : 'NFC Access Cards',
            href: '/hardware/cards',
          },
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
          label: t('header.dropdowns.resources.docs.label'),
          description: t('header.dropdowns.resources.docs.description'),
          icon: BookOpen,
        },
        {
          href: '/resources/case-studies',
          label: t('header.dropdowns.resources.caseStudies.label'),
          description: t('header.dropdowns.resources.caseStudies.description'),
          icon: Users,
        },
        {
          href: '/resources/changelog',
          label: t('header.dropdowns.resources.changelog.label'),
          description: t('header.dropdowns.resources.changelog.description'),
          icon: LayoutTemplate,
        },
        {
          href: '/resources/security',
          label: t('header.dropdowns.resources.security.label'),
          description: t('header.dropdowns.resources.security.description'),
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
            <GateFlowLogo size={26} />
          </I18nLink>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 xl:gap-2 me-auto lg:flex ms-4">
            {navLinks.map((link) => {
              const NavIcon = link.icon;
              return (
                <div
                  key={link.href}
                  className="group"
                  onMouseEnter={() => handleMouseEnter(link.href)}
                  onMouseLeave={handleMouseLeave}
                >
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
                </div>
              );
            })}
          </nav>

          {/* Actions */}
          <div className={`flex items-center gap-3 xl:gap-4`}>
            <div className="hidden xl:flex relative items-center group/search">
              <div
                className={`absolute start-3 text-ds-text-subtle group-focus-within/search:text-ds-icon-brand transition-colors pointer-events-none`}
              >
                <Search size={16} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Search resources..."
                aria-label="Search resources"
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
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://app.gateflow.site'}/${locale}/login`}
              >
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
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mega Menu Overlay */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial="exit"
              animate="enter"
              exit="exit"
              variants={panelVariants}
              onMouseEnter={() => {
                if (closeTimeout.current) clearTimeout(closeTimeout.current);
              }}
              onMouseLeave={handleMouseLeave}
              className="absolute inset-x-0 top-20 z-40 overflow-hidden border-b border-ds-border bg-ds-surface before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/5"
              style={{ boxShadow: 'var(--ds-shadow-deep)' }}
            >
              <div className="mx-auto flex max-w-[1536px] min-h-[320px] items-center">
                {navLinks.find((l) => l.href === activeMenu)?.hasMega && (
                  <>
                    {/* Left: Quick Links */}
                    <div className="w-[280px] shrink-0 p-6 bg-ds-surface">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtlest mb-6">
                        {
                          navLinks.find((l) => l.href === activeMenu)
                            ?.quickLinks?.title
                        }
                      </h4>
                      <div className="flex flex-col gap-1">
                        {navLinks
                          .find((l) => l.href === activeMenu)
                          ?.quickLinks?.links.map((ql, i) => (
                            <Link
                              key={i}
                              href={ql.href}
                              className="text-[14px] font-bold text-ds-text-subtle hover:text-ds-text-brand hover:translate-x-1 hover:rtl:-translate-x-1 hover:bg-ds-surface-raised px-4 py-2.5 -mx-4 rounded-xl transition-all flex items-center justify-between group/ql"
                            >
                              {ql.label}
                              <ChevronRight
                                size={14}
                                className="opacity-0 -translate-x-2 rtl:translate-x-2 rtl:rotate-180 group-hover/ql:opacity-100 group-hover/ql:translate-x-0 transition-all"
                              />
                            </Link>
                          ))}
                      </div>
                    </div>

                    {/* Center: Main Grid */}
                    <div className="flex-1 bg-ds-surface-sunken/30 p-6 border-x border-ds-border-subtle">
                      <div className="grid grid-cols-2 gap-4">
                        {navLinks
                          .find((l) => l.href === activeMenu)
                          ?.items?.map((item) => {
                            const Icon = item.icon;
                            return (
                              <I18nLink
                                key={item.href}
                                locale={locale}
                                href={item.href}
                                className="group/item flex items-start gap-4 rounded-2xl p-4 transition-all duration-300 hover:bg-ds-surface border border-transparent hover:border-ds-border-subtle hover:shadow-sm"
                              >
                                <div className="flex shrink-0 h-11 w-11 items-center justify-center rounded-xl bg-ds-surface-raised border border-ds-border shadow-sm text-ds-text-subtle group-hover/item:border-primary/20 group-hover/item:text-primary transition-all">
                                  {Icon && <Icon size={22} strokeWidth={2.2} />}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[15px] font-black text-ds-text-heading leading-tight mb-1 group-hover/item:text-ds-text-brand">
                                    {item.label}
                                  </span>
                                  <span className="text-[12px] text-ds-text-subtle leading-relaxed line-clamp-2">
                                    {item.description}
                                  </span>
                                </div>
                              </I18nLink>
                            );
                          })}
                      </div>
                    </div>

                    {/* Right: Feature/Slider */}
                    <div className="w-[380px] shrink-0 p-6 bg-ds-surface overflow-hidden">
                      {activeMenu === '/solutions' ? (
                        <div className="h-full flex flex-col">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtlest mb-4">
                            Spotlight
                          </h4>
                          <div className="relative flex-1 rounded-2xl overflow-hidden group/img">
                            <img
                              src="/images/solutions/me_compounds.png"
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-[5s]"
                              alt="Featured"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                              <span className="inline-block px-2 py-0.5 rounded bg-primary text-[10px] font-black text-white mb-2 uppercase">
                                New Release
                              </span>
                              <h5 className="text-white text-lg font-black leading-tight">
                                Advanced Perimeter Shield v2.4
                              </h5>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col">
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtlest">
                              Latest Insights
                            </h4>
                            <Link
                              href="/blog"
                              className="text-[10px] font-black text-ds-text-brand uppercase hover:underline"
                            >
                              All Posts
                            </Link>
                          </div>
                          <div className="flex flex-col gap-6">
                            {navLinks
                              .find((l) => l.href === activeMenu)
                              ?.featuredPosts?.map((post, i) => (
                                <Link
                                  key={i}
                                  href={post.href}
                                  className="group/post flex gap-4 items-center"
                                >
                                  <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-ds-border">
                                    <img
                                      src={post.image}
                                      alt={post.title}
                                      className="w-full h-full object-cover group-hover/post:scale-110 transition-transform"
                                    />
                                  </div>
                                  <div>
                                    <h6 className="text-[13px] font-black text-ds-text-heading leading-tight group-hover/post:text-ds-text-brand transition-colors mb-1">
                                      {post.title}
                                    </h6>
                                    <p className="text-[11px] font-bold text-ds-text-subtle">
                                      {post.readTime}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-ds-border bg-ds-surface/95 backdrop-blur-xl lg:hidden"
            >
              <div className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <I18nLink
                    key={link.href}
                    locale={locale}
                    href={link.href}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-bold text-ds-text-subtle hover:bg-ds-surface-raised hover:text-ds-text-heading transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                    <ChevronRight
                      size={16}
                      className={`opacity-40 ${isRtl ? '-scale-x-100' : ''}`}
                    />
                  </I18nLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
