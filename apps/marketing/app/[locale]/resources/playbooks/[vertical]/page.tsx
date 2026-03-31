import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Button } from '@gate-access/ui';
import { ArrowRight } from 'lucide-react';
import type { Locale } from '@/i18n-config';
import { getTranslation } from '@/lib/i18n/get-translation';
import { templatedMarketingTitle } from '@/lib/metadata-title';
import { IntentLandingTracker } from '@/components/intent-landing-tracker';
import { IntentLink } from '@/components/intent-link';
import { I18nLink } from '@/components/i18n-link';

const PLAYBOOKS = ['compounds', 'schools', 'events', 'clubs'] as const;
type PlaybookKey = (typeof PLAYBOOKS)[number];

function isPlaybookKey(value: string): value is PlaybookKey {
  return PLAYBOOKS.includes(value as PlaybookKey);
}

function intentForPlaybook(
  key: PlaybookKey
): 'demo' | 'pilot' | 'migration' | 'consult' {
  if (key === 'events') return 'pilot';
  if (key === 'compounds') return 'migration';
  if (key === 'schools') return 'consult';
  return 'demo';
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale; vertical: string }>;
}): Promise<Metadata> {
  const { locale, vertical } = await props.params;
  if (!isPlaybookKey(vertical)) return {};

  const { t } = await getTranslation(locale, 'resources');
  const title = t(`playbooks.${vertical}.title`);
  const summary = t(`playbooks.${vertical}.summary`);

  return {
    title: templatedMarketingTitle(title),
    description: summary,
  };
}

export default async function PlaybookPage(props: {
  params: Promise<{ locale: Locale; vertical: string }>;
}) {
  const { locale, vertical } = await props.params;
  if (!isPlaybookKey(vertical)) {
    notFound();
  }

  const { t } = await getTranslation(locale, 'resources');
  const intent = intentForPlaybook(vertical);
  const title = t(`playbooks.${vertical}.title`);
  const summary = t(`playbooks.${vertical}.summary`);
  const outcomes = t(`playbooks.${vertical}.outcomes`, {
    returnObjects: true,
  }) as string[];
  const steps = t(`playbooks.${vertical}.steps`, {
    returnObjects: true,
  }) as string[];

  return (
    <div className="flex flex-col w-full pb-24">
      <IntentLandingTracker
        locale={locale}
        surface={`playbook_${vertical}_page`}
        intent={intent}
      />

      <section className="pt-20 pb-10 container px-6">
        <I18nLink
          locale={locale}
          href="/resources"
          className="inline-block text-sm font-semibold text-primary hover:underline mb-6"
        >
          {t('playbooks.backToResources')}
        </I18nLink>
        <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">{summary}</p>
      </section>

      <section className="container px-6 grid lg:grid-cols-2 gap-8 mb-16">
        <div className="rounded-3xl border bg-card p-8">
          <h2 className="text-2xl font-black mb-5">
            {t('playbooks.outcomesTitle')}
          </h2>
          <ul className="space-y-3">
            {outcomes.map((outcome) => (
              <li
                key={outcome}
                className="text-sm leading-relaxed text-muted-foreground"
              >
                - {outcome}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border bg-card p-8">
          <h2 className="text-2xl font-black mb-5">
            {t('playbooks.stepsTitle')}
          </h2>
          <ol className="space-y-3">
            {steps.map((step) => (
              <li
                key={step}
                className="text-sm leading-relaxed text-muted-foreground"
              >
                - {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container px-6">
        <div className="rounded-[2rem] border bg-primary/5 p-8 lg:p-12">
          <h3 className="text-2xl lg:text-3xl font-black mb-3">
            {t('playbooks.leadGateTitle')}
          </h3>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            {t('playbooks.leadGateDescription')}
          </p>
          <IntentLink
            locale={locale}
            href="/contact"
            intent={intent}
            surface={`playbook_${vertical}_lead_gate`}
          >
            <Button size="lg" className="h-12 px-8 rounded-xl font-bold">
              {t('playbooks.leadGateCta')}
              <ArrowRight className="ms-2 h-4 w-4" />
            </Button>
          </IntentLink>
        </div>
      </section>
    </div>
  );
}
