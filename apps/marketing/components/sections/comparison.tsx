import { getTranslation } from '../../lib/i18n/get-translation';
import type { Locale } from '../../i18n-config';
import { Check, X } from 'lucide-react';

export async function ComparisonSection({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'landing');

  const features = [
    {
      name: t('comparison.features.offline'),
      gateflow: true,
      whatsapp: false,
      paper: false,
    },
    {
      name: t('comparison.features.analytics'),
      gateflow: true,
      whatsapp: false,
      paper: false,
    },
    {
      name: t('comparison.features.qrCodes'),
      gateflow: true,
      whatsapp: true,
      paper: false,
    },
    {
      name: t('comparison.features.auditLog'),
      gateflow: true,
      whatsapp: false,
      paper: false,
    },
    {
      name: t('comparison.features.residentPortal'),
      gateflow: true,
      whatsapp: false,
      paper: false,
    },
    {
      name: t('comparison.features.pushNotifications'),
      gateflow: true,
      whatsapp: true,
      paper: false,
    },
    {
      name: t('comparison.features.multiGate'),
      gateflow: true,
      whatsapp: false,
      paper: false,
    },
    {
      name: t('comparison.features.apiAccess'),
      gateflow: true,
      whatsapp: false,
      paper: false,
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary mb-4">
            {t('comparison.badge')}
          </h2>
          <p className="text-4xl lg:text-5xl font-black tracking-tight">
            {t('comparison.title')}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <th className="text-left py-6 px-4 font-bold text-lg">
                  {t('comparison.features_col')}
                </th>
                <th className="text-center py-6 px-4">
                  <div className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-full font-bold">
                    GateFlow
                  </div>
                </th>
                <th className="text-center py-6 px-4">
                  <div className="inline-flex items-center justify-center px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-full font-bold">
                    WhatsApp
                  </div>
                </th>
                <th className="text-center py-6 px-4">
                  <div className="inline-flex items-center justify-center px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-full font-bold">
                    {t('comparison.paper')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="py-4 px-4 font-medium">{feature.name}</td>
                  <td className="text-center py-4 px-4">
                    {feature.gateflow ? (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                        <Check className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">
                        <X className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                  <td className="text-center py-4 px-4">
                    {feature.whatsapp ? (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                        <Check className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">
                        <X className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                  <td className="text-center py-4 px-4">
                    {feature.paper ? (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                        <Check className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">
                        <X className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
