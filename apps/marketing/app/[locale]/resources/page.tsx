import type { Metadata } from 'next';
import * as React from 'react';
import { Button } from '@gate-access/ui';
import { BookOpen, Newspaper, FileCode, Users, ArrowRight } from 'lucide-react';
import { I18nLink } from '../../../components/i18n-link';
import type { Locale } from '../../../i18n-config';
import { getTranslation } from '../../../lib/i18n/get-translation';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const { t } = await getTranslation(locale, 'navigation');
  return {
    title: `${t('header.dropdowns.company.resources.label')} | GateFlow`,
    description: 'Learn how to get the most out of the GateFlow access control platform.',
  };
}

export default async function ResourcesPage({ params: { locale } }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(locale, 'resources');

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Header */}
      <section className="pt-20 pb-16 text-center container px-6">
        <h1 className="text-4xl lg:text-7xl font-black tracking-tight mb-6 uppercase">
          {t('ui.knowledgeBaseTitle')} <span className="text-primary italic">{t('ui.knowledgeBaseTitleSpan')}</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('hero.subHeadline')}
        </p>
      </section>

      {/* Grid */}
      <section className="container px-6 grid md:grid-cols-2 gap-8 mb-24">
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
        <ResourceCard 
          icon={<Newspaper />}
          title={t('categories.blog.title')}
          desc={t('categories.blog.description')}
          link="#"
          tag={t('ui.tags.comingSoon')}
          readMore={t('ui.readMore')}
        />
        <ResourceCard 
          icon={<Users />}
          title={t('categories.casestudies.title')}
          desc={t('categories.casestudies.description')}
          link="#"
          tag={t('ui.tags.phase2')}
          readMore={t('ui.readMore')}
        />
      </section>

      {/* Help Banner */}
      <section className="container px-6">
         <div className="bg-primary rounded-[3rem] p-12 lg:p-20 text-primary-foreground flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
            <div>
               <h2 className="text-3xl lg:text-5xl font-black mb-4">{t('cta.title')}</h2>
               <p className="text-primary-foreground/80 text-lg">{t('cta.description')}</p>
            </div>
            <Button size="lg" className="bg-white text-primary hover:bg-slate-100 h-14 px-8 rounded-xl font-bold" asChild>
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

function ResourceCard({ icon, title, desc, link, tag, readMore }: any) {
   return (
      <div className="p-8 rounded-[2.5rem] border bg-card hover:border-primary transition-all group flex flex-col">
         <div className="flex justify-between items-start mb-6">
            <div className="bg-primary/5 text-primary p-4 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
               {React.cloneElement(icon, { size: 28 })}
            </div>
            {tag && (
               <span className="px-3 py-1 rounded-full bg-muted text-[10px] font-black uppercase tracking-widest">
                  {tag}
               </span>
            )}
         </div>
         <h3 className="text-2xl font-bold mb-3">{title}</h3>
         <p className="text-muted-foreground leading-relaxed mb-8 flex-1">{desc}</p>
         <Button variant="ghost" className="w-fit p-0 h-auto font-bold hover:bg-transparent hover:text-primary" asChild>
            <a href={link}>
               {readMore || "Read More"}
               <ArrowRight className="ml-2 h-4 w-4" />
            </a>
         </Button>
      </div>
   )
}
