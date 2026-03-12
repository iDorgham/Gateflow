import { getTranslation } from '../../lib/i18n/get-translation';
import type { Locale } from '../../i18n-config';

interface MockupPanelProps {
  caption: string;
  desc: string;
  accentClass: string;
}

function MockupPanel({ caption, desc, accentClass }: MockupPanelProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Device frame */}
      <div
        className={`w-full rounded-[2rem] shadow-2xl border-2 ${accentClass} overflow-hidden`}
      >
        {/* Window chrome bar */}
        <div className="bg-muted/80 px-4 py-2.5 flex items-center gap-1.5 border-b border-border/40">
          {['bg-red-400', 'bg-yellow-400', 'bg-green-400'].map((c, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full ${c} opacity-70`} />
          ))}
        </div>
        {/* Placeholder screenshot area */}
        {/* TODO: replace with real screenshots at public/screenshots/ */}
        <div className="aspect-video bg-gradient-to-br from-muted via-muted/60 to-muted/20 flex items-center justify-center">
          <div className="space-y-3 w-3/4">
            <div className="h-3 rounded bg-border/50 w-1/2" />
            <div className="h-2 rounded bg-border/30 w-full" />
            <div className="h-2 rounded bg-border/30 w-4/5" />
            <div className="h-8 rounded-lg bg-border/20 w-full mt-4" />
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 rounded bg-border/20" />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Caption */}
      <div className="text-center">
        <p className="font-bold text-sm">{caption}</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">{desc}</p>
      </div>
    </div>
  );
}

export async function ProductScreenshots({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'landing');

  const panels = [
    {
      caption: t('screenshots.dashboard.caption'),
      desc: t('screenshots.dashboard.desc'),
      accentClass: 'border-primary/30',
    },
    {
      caption: t('screenshots.scanner.caption'),
      desc: t('screenshots.scanner.desc'),
      accentClass: 'border-blue-400/30',
    },
    {
      caption: t('screenshots.portal.caption'),
      desc: t('screenshots.portal.desc'),
      accentClass: 'border-violet-400/30',
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary mb-4">
            {t('screenshots.badge')}
          </h2>
          <p className="text-4xl lg:text-5xl font-black tracking-tight">
            {t('screenshots.title')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 items-start">
          {panels.map((panel) => (
            <MockupPanel key={panel.caption} {...panel} />
          ))}
        </div>
      </div>
    </section>
  );
}
