'use client';

import { PageHeader } from '@gateflow/components';
import { TokenExplorer } from '../../../components/token-explorer/TokenExplorer';
import { useLocale } from '../../../components/providers/LocaleProvider';
import { translations } from '../../../lib/translations';

export default function TokensPage() {
  const { locale, isRTL } = useLocale();
  const t = translations[locale as keyof typeof translations].pages.tokens;

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        packageName="@gateflow/tokens"
        breadcrumbs={[
          { label: isRTL ? 'التوثيق' : 'Documentation', href: '/' },
          { label: t.title },
        ]}
      />

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 max-w-2xl">
          <h2 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text)]">
            {isRTL ? 'مستكشف الرموز' : 'Token Explorer'}
          </h2>
          <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed">
            {isRTL
              ? 'استخدم المستكشف أدناه لتصفح مكتبة الرموز الدلالية الخاصة بنا. يمكنك معاينة كيف تبدو الرموز في كل من الأوضاع الفاتحة والداكنة.'
              : 'Use the explorer below to browse our semantic token library. You can preview how tokens look in both light and dark modes.'}
          </p>
        </div>

        <TokenExplorer />
      </section>
    </div>
  );
}
