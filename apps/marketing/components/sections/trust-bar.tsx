import { getTranslation } from '../../lib/i18n/get-translation';
import type { Locale } from '../../i18n-config';

export async function TrustBar({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'landing');
  const partners = [
    { name: 'Palm Hills', logo: '🌴' },
    { name: 'Sodic', logo: '🏢' },
    { name: 'Emaar', logo: '🏗️' },
    { name: 'British School', logo: '🎓' },
    { name: 'Mountain View', logo: '⛰️' },
  ];

  return (
    <section className="border-y border-ds-border bg-ds-surface-sunken py-16 md:py-24">
      <div className="container mx-auto px-8">
        <p className="mb-12 text-center text-[12px] font-black uppercase tracking-[0.3em] text-ds-text-subtle">
          {t('trust.badge')}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-80 hover:opacity-100 transition-all duration-500">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-4 group cursor-default"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {p.logo}
              </span>
              <span className="text-2xl font-black tracking-tighter uppercase text-ds-text-heading">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
