import { getTranslation } from '../../lib/i18n/get-translation';
import type { Locale } from '../../i18n-config';

export async function SocialProof({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'landing');

  return (
    <section className="py-12 border-y border-border/40 bg-muted/30">
      <div className="container mx-auto px-6">
        <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-8">
          {t('socialProof.tagline')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
          {[
            t('socialProof.stat1'),
            t('socialProof.stat2'),
            t('socialProof.stat3'),
          ].map((stat) => (
            <div
              key={stat}
              className="px-5 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm"
            >
              {stat}
            </div>
          ))}
        </div>

        {/* Logo placeholder row — replace with real customer logos */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-28 rounded-lg bg-muted border border-border/50 flex items-center justify-center"
              aria-label={t('socialProof.logoAlt')}
            >
              {/* TODO: replace with <Image src={logo} alt={name} /> */}
              <div className="w-16 h-3 rounded bg-border/70" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
