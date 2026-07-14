import type { Metadata } from 'next';
import { getTranslation } from '../../../lib/i18n/get-translation';
import type { Locale } from '../../../i18n-config';
import { templatedMarketingTitle } from '../../../lib/metadata-title';
import {
  Zap,
  Shield,
  Smartphone,
  Globe,
  Cpu,
  Cloud,
  Lock,
  BarChart3,
} from 'lucide-react';
import { I18nLink } from '../../../components/i18n-link';
import { Button } from '@gateflow/ui';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'product');
  return {
    title: templatedMarketingTitle(t('hero.headline') as string),
    description: t('hero.subHeadline') as string,
  };
}

export default async function FeaturesPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'product');

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Hero */}
      <section className="pt-48 pb-32 text-center container px-6">
        <h1 className="text-4xl lg:text-7xl font-black tracking-tight mb-6">
          {t('hero.headline') as string}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('hero.subHeadline') as string}
        </p>
      </section>

      {/* Feature Grid */}
      <section className="container px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
        <FeatureDetail
          icon={<Smartphone />}
          title={t('features.items.scanner.title') as string}
          desc={t('features.items.scanner.description') as string}
        />
        <FeatureDetail
          icon={<Shield />}
          title={t('features.items.hmac.title') as string}
          desc={t('features.items.hmac.description') as string}
        />
        <FeatureDetail
          icon={<Cloud />}
          title={t('features.items.offline.title') as string}
          desc={t('features.items.offline.description') as string}
        />
        <FeatureDetail
          icon={<Lock />}
          title={t('features.items.hardware.title') as string}
          desc={t('features.items.hardware.description') as string}
        />
        <FeatureDetail
          icon={<BarChart3 />}
          title={t('features.items.audit.title') as string}
          desc={t('features.items.audit.description') as string}
        />
        <FeatureDetail
          icon={<Zap />}
          title={t('features.items.api.title') as string}
          desc={t('features.items.api.description') as string}
        />
      </section>

      {/* Technical Deep Dive */}
      <section className="bg-muted/30 py-24 border-y">
        <div className="container px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-black tracking-tight">
                {t('deepDives.title') as string}
              </h2>
              <div className="space-y-6">
                <TechItem
                  icon={<Cpu />}
                  title={t('deepDives.items.edge.title') as string}
                  desc={t('deepDives.items.edge.description') as string}
                />
                <TechItem
                  icon={<Cloud />}
                  title={t('deepDives.items.cloud.title') as string}
                  desc={t('deepDives.items.cloud.description') as string}
                />
                <TechItem
                  icon={<Globe />}
                  title={t('deepDives.items.region.title') as string}
                  desc={t('deepDives.items.region.description') as string}
                />
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl border border-border bg-card p-8 font-mono text-sm text-foreground shadow-2xl ltr:text-left rtl:text-left rtl:dir-ltr">
                <div className="flex gap-1.5 mb-6">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                </div>
                <div className="space-y-2 opacity-80">
                  <p className="text-primary font-bold">
                    {t('deepDives.code.verifying') as string}
                  </p>
                  <p>const isValid = await verifyHMAC(qrData, secret);</p>
                  <p>if (isValid) {'{'}</p>
                  <p className="pl-4 text-success">
                    {t('deepDives.code.authorized') as string}
                  </p>
                  <p className="pl-4">timestamp: Date.now(),</p>
                  <p className="pl-4 text-sky-500">
                    {t('deepDives.code.queued') as string}
                  </p>
                  <p>{'}'}</p>
                  <p className="mt-6 text-muted-foreground">
                    {t('deepDives.code.processed') as string}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Features CTA */}
      <section className="container px-6 pt-24 text-center">
        <h2 className="text-3xl font-black mb-8">
          {t('cta.headline') as string}
        </h2>
        <div className="flex justify-center gap-4">
          <I18nLink locale={locale} href="/contact">
            <Button size="lg" variant="brand" className="h-14 px-8">
              {t('cta.buttonDemo') as string}
            </Button>
          </I18nLink>
          <I18nLink locale={locale} href="/pricing">
            <Button size="lg" variant="outline" className="h-14 px-8">
              {t('cta.buttonPricing') as string}
            </Button>
          </I18nLink>
        </div>
      </section>
    </div>
  );
}

function FeatureDetail({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-8 bg-card border rounded-2xl hover:border-primary transition-colors group">
      <div className="bg-primary/5 text-primary p-3 rounded-xl w-fit mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function TechItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="text-primary mt-1">{icon}</div>
      <div>
        <h4 className="font-bold mb-1">{title}</h4>
        <p className="text-muted-foreground text-sm">{desc}</p>
      </div>
    </div>
  );
}
