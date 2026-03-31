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
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="container mx-auto px-6">
        <p className="mb-10 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {t('trust.badge')}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-80 hover:opacity-100 transition-all duration-500">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-3 group cursor-default"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {p.logo}
              </span>
              <span className="text-xl font-bold tracking-tighter uppercase text-muted-foreground">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
