import type { Metadata } from 'next';
import * as React from 'react';
import { Button } from '@gate-access/ui';
import {
  BookOpen,
  FileCode,
  Users,
  ArrowRight,
  Download,
  Webhook,
  FileSpreadsheet,
  Mail,
  Clock,
} from 'lucide-react';
import { I18nLink } from '../../../components/i18n-link';
import type { Locale } from '../../../i18n-config';
import { getTranslation } from '../../../lib/i18n/get-translation';
import { getAllPosts } from '../../../lib/blog';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { t } = await getTranslation(locale, 'navigation');
  return {
    title: `${t('header.dropdowns.company.resources.label')} | GateFlow`,
    description:
      'Learn how to get the most out of the GateFlow access control platform.',
  };
}

const INTEGRATIONS = [
  {
    name: 'Webhook API',
    desc: 'Push scan events to any endpoint in real time.',
    icon: <Webhook size={22} />,
    status: 'live',
  },
  {
    name: 'CSV Export',
    desc: 'Export scans, contacts, and units to spreadsheet.',
    icon: <FileSpreadsheet size={22} />,
    status: 'live',
  },
  {
    name: 'Resend Email',
    desc: 'Auto-deliver QR codes to guests via transactional email.',
    icon: <Mail size={22} />,
    status: 'live',
  },
  {
    name: 'HubSpot CRM',
    desc: 'Sync contacts and access events with HubSpot.',
    icon: <Users size={22} />,
    status: 'soon',
  },
  {
    name: 'Salesforce',
    desc: 'Log visitor activity directly in Salesforce records.',
    icon: <BookOpen size={22} />,
    status: 'soon',
  },
  {
    name: 'API Keys',
    desc: 'Programmatic access to the full GateFlow API.',
    icon: <FileCode size={22} />,
    status: 'live',
  },
];

export default async function ResourcesPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const { t } = await getTranslation(locale, 'resources');
  const allPosts = await getAllPosts();
  const latestPosts = allPosts.slice(0, 3);

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Header */}
      <section className="pt-20 pb-16 text-center container px-6">
        <h1 className="text-4xl lg:text-7xl font-black tracking-tight mb-6 uppercase">
          {t('ui.knowledgeBaseTitle')}{' '}
          <span className="text-primary italic">
            {t('ui.knowledgeBaseTitleSpan')}
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('hero.subHeadline')}
        </p>
      </section>

      {/* PDF Download */}
      <section className="container px-6 mb-16">
        <div className="rounded-[2.5rem] border bg-gradient-to-br from-primary/5 to-primary/10 p-10 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
              Free Download
            </p>
            <h2 className="text-2xl font-black mb-3">
              GateFlow Platform Overview
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              A comprehensive 12-page guide covering architecture, security
              model, deployment options, and ROI benchmarks for MENA property
              managers.
            </p>
          </div>
          <a
            href="/downloads/gateflow-overview.pdf"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shrink-0"
          >
            <Download size={18} />
            Download PDF
          </a>
        </div>
      </section>

      {/* Resource Cards */}
      <section className="container px-6 grid md:grid-cols-2 gap-8 mb-20">
        <ResourceCard
          icon={<BookOpen />}
          title={t('categories.documentation.title')}
          desc={t('categories.documentation.description')}
          link="#"
          readMore={t('ui.readMore')}
        />
        <ResourceCard
          icon={<FileCode />}
          title={t('categories.api.title')}
          desc={t('categories.api.description')}
          link="#"
          readMore={t('ui.readMore')}
        />
      </section>

      {/* Latest Blog Posts */}
      {latestPosts.length > 0 && (
        <section className="container px-6 mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black">Latest from the blog</h2>
            <I18nLink
              locale={locale}
              href="/blog"
              className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </I18nLink>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <I18nLink
                key={post.slug}
                locale={locale}
                href={`/blog/${post.slug}`}
                className="group block p-6 rounded-2xl border bg-card hover:border-primary transition-all"
              >
                {post.tags[0] && (
                  <span className="inline-block mb-3 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {post.tags[0]}
                  </span>
                )}
                <h3 className="font-bold text-lg leading-tight mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock size={12} />
                  {post.readingTime}
                </div>
              </I18nLink>
            ))}
          </div>
        </section>
      )}

      {/* Integrations */}
      <section className="container px-6 mb-20">
        <h2 className="text-2xl font-black mb-8">Integrations</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INTEGRATIONS.map((item) => (
            <div
              key={item.name}
              className="flex items-start gap-4 p-6 rounded-2xl border bg-card"
            >
              <div className="shrink-0 h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{item.name}</span>
                  {item.status === 'soon' && (
                    <span className="text-[10px] font-black uppercase tracking-widest bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      Coming soon
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Help Banner */}
      <section className="container px-6">
        <div className="bg-primary rounded-[3rem] p-12 lg:p-20 text-primary-foreground flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
          <div>
            <h2 className="text-3xl lg:text-5xl font-black mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              {t('cta.description')}
            </p>
          </div>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-slate-100 h-14 px-8 rounded-xl font-bold"
            asChild
          >
            <I18nLink locale={locale} href="/contact">
              {t('ui.chatWithSupport')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </I18nLink>
          </Button>
        </div>
      </section>
    </div>
  );
}

function ResourceCard({
  icon,
  title,
  desc,
  link,
  readMore,
}: {
  icon: React.ReactElement;
  title: string;
  desc: string;
  link: string;
  readMore: string;
}) {
  return (
    <div className="p-8 rounded-[2.5rem] border bg-card hover:border-primary transition-all group flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div className="bg-primary/5 text-primary p-4 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {React.cloneElement(icon, { size: 28 } as React.HTMLAttributes<SVGElement>)}
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed mb-8 flex-1">{desc}</p>
      <Button
        variant="ghost"
        className="w-fit p-0 h-auto font-bold hover:bg-transparent hover:text-primary"
        asChild
      >
        <a href={link}>
          {readMore}
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}
