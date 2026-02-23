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
    <section className="py-12 border-y bg-muted/30">
      <div className="container mx-auto px-6">
        <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-10">
          {t('trust.badge')}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {partners.map((p) => (
            <div key={p.name} className="flex items-center gap-3">
              <span className="text-2xl">{p.logo}</span>
              <span className="text-xl font-black tracking-tighter uppercase">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
