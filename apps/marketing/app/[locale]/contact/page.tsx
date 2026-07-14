import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTranslation } from '../../../lib/i18n/get-translation';
import type { Locale } from '../../../i18n-config';
import { ContactForm } from '../../../components/contact-form';
import { MessageSquare, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { templatedMarketingTitle } from '../../../lib/metadata-title';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'navigation');
  return {
    title: templatedMarketingTitle(
      t('header.dropdowns.company.contact.label') as string
    ),
    description: 'Get in touch with the GateFlow team in Cairo and Dubai.',
  };
}

export default async function ContactPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { t, dict } = await getTranslation(locale, 'contact');

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Header */}
      <section className="pt-48 pb-32 text-center container px-6">
        <h1 className="text-4xl lg:text-7xl font-black tracking-tight mb-6">
          {t('hero.headline') as string}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('hero.subHeadline') as string}
        </p>
      </section>

      <section className="container px-6 grid lg:grid-cols-5 gap-16 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-8">
          <ContactCard
            icon={<MessageSquare className="text-success" />}
            title={t('cards.whatsapp.title') as string}
            detail={t('cards.whatsapp.detail') as string}
            desc={t('cards.whatsapp.desc') as string}
            link="https://wa.me/201000000000"
            linkBtn={t('cards.whatsapp.linkBtn') as string}
          />
          <ContactCard
            icon={<Mail className="text-indigo-500" />}
            title={t('cards.email.title') as string}
            detail={t('cards.email.detail') as string}
            desc={t('cards.email.desc') as string}
          />
          <ContactCard
            icon={<Phone className="text-primary" />}
            title={t('cards.sales.title') as string}
            detail={t('cards.sales.detail') as string}
            desc={t('cards.sales.desc') as string}
          />

          <div className="p-1 rounded-[2rem] bg-gradient-to-br from-primary/10 to-indigo-500/10 border overflow-hidden">
            <div className="p-8 bg-card rounded-[1.9rem] border border-ds-border">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-primary" />
                <h3 className="font-bold text-lg">
                  {t('cards.regional.title') as string}
                </h3>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="text-2xl">🇪🇬</span>
                  <div>
                    <p className="font-bold">
                      {t('cards.regional.cairo.name') as string}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('cards.regional.cairo.desc') as string}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl">🇦🇪</span>
                  <div>
                    <p className="font-bold">
                      {t('cards.regional.dubai.name') as string}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('cards.regional.dubai.desc') as string}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          <Suspense
            fallback={
              <div className="bg-card border rounded-3xl p-8 lg:p-10 flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary h-8 w-8" />
              </div>
            }
          >
            <ContactForm dict={dict} locale={locale} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  detail: string;
  desc: string;
  link?: string;
  linkBtn?: string;
}

function ContactCard({
  icon,
  title,
  detail,
  desc,
  link,
  linkBtn,
}: ContactCardProps) {
  return (
    <div className="flex gap-5 p-6 rounded-2xl border bg-card hover:bg-muted/30 transition-colors">
      <div className="h-12 w-12 rounded-xl bg-background border flex items-center justify-center shrink-0 shadow-sm">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-1">
          {title}
        </h4>
        <p className="text-lg font-black mb-1">{detail}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
        {link && (
          <a
            href={link}
            className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-success hover:underline"
          >
            {linkBtn}
          </a>
        )}
      </div>
    </div>
  );
}
