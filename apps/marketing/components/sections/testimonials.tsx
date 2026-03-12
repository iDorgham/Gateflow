import { getTranslation } from '../../lib/i18n/get-translation';
import type { Locale } from '../../i18n-config';

export async function TestimonialsSection({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'landing');

  const testimonials = [
    {
      quote: t('testimonials.palmHills.quote'),
      author: t('testimonials.palmHills.author'),
      role: t('testimonials.palmHills.role'),
      company: 'Palm Hills Developments',
    },
    {
      quote: t('testimonials.eventManager.quote'),
      author: t('testimonials.eventManager.author'),
      role: t('testimonials.eventManager.role'),
      company: 'MENA Events Co.',
    },
    {
      quote: t('testimonials.security.quote'),
      author: t('testimonials.security.author'),
      role: t('testimonials.security.role'),
      company: 'SecureGuard Solutions',
    },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary mb-4">
            {t('testimonials.badge')}
          </h2>
          <p className="text-4xl lg:text-5xl font-black tracking-tight">
            {t('testimonials.title')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <svg
                    key={j}
                    className="w-5 h-5 text-yellow-500 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1.5 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1.5 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1.5 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1.5 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1.5 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-lg font-medium mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div>
                <div className="font-bold">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}
                </div>
                <div className="text-sm text-primary font-medium mt-1">
                  {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
