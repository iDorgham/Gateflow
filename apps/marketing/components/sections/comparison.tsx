import { getTranslation } from '../../lib/i18n/get-translation';
import type { Locale } from '../../i18n-config';
import { Check, X } from 'lucide-react';

export async function ComparisonSection({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'landing');

  const features = [
    { name: t('comparison.features.offline'), gateflow: true, whatsapp: false, paper: false },
    { name: t('comparison.features.analytics'), gateflow: true, whatsapp: false, paper: false },
    { name: t('comparison.features.qrCodes'), gateflow: true, whatsapp: true, paper: false },
    { name: t('comparison.features.auditLog'), gateflow: true, whatsapp: false, paper: false },
    { name: t('comparison.features.residentPortal'), gateflow: true, whatsapp: false, paper: false },
    { name: t('comparison.features.pushNotifications'), gateflow: true, whatsapp: true, paper: false },
    { name: t('comparison.features.multiGate'), gateflow: true, whatsapp: false, paper: false },
    { name: t('comparison.features.apiAccess'), gateflow: true, whatsapp: false, paper: false },
  ];

  return (
    <section className="py-24 bg-[var(--ds-background-default,#FFFFFF)]">
      <div className="container px-[var(--ds-grid-margin-xs,1rem)] md:px-[var(--ds-grid-margin-md,2rem)] lg:px-[var(--ds-grid-margin-lg,4rem)] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--ds-text-brand,#0052CC)] mb-4">
            {t('comparison.badge')}
          </h2>
          <p className="text-3xl lg:text-5xl font-bold tracking-tight text-[var(--ds-text,#172B4D)] leading-tight">
            {t('comparison.title')}
          </p>
        </div>

        <div className="overflow-hidden border border-[var(--ds-border,#DFE1E6)] rounded-lg shadow-[0_8px_32px_rgba(9,30,66,0.08)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="bg-[var(--ds-background-subtle,#F4F5F7)] border-b border-[var(--ds-border,#DFE1E6)]">
                  <th className="text-left rtl:text-right py-8 px-8 font-bold text-[14px] text-[var(--ds-text-subtle,#42526E)] uppercase tracking-wider">
                    {t('comparison.features_col')}
                  </th>
                  <th className="py-8 px-4 text-center">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 bg-[var(--ds-background-brand-bold,#0052CC)] text-white text-xs font-bold rounded-sm uppercase tracking-widest">
                      GateFlow
                    </div>
                  </th>
                  <th className="py-8 px-4 text-center text-[14px] font-bold text-[var(--ds-text-subtle,#42526E)]">
                    WhatsApp/SMS
                  </th>
                  <th className="py-8 px-4 text-center text-[14px] font-bold text-[var(--ds-text-subtle,#42526E)]">
                    Manual/Paper
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--ds-border,#DFE1E6)] last:border-0 hover:bg-[var(--ds-background-subtle,#F4F5F7)] transition-colors group"
                  >
                    <td className="py-6 px-8 font-semibold text-[var(--ds-text,#172B4D)]">{feature.name}</td>
                    <td className="py-6 px-4 text-center bg-[var(--ds-background-selected,#DEEBFF)]/20">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-[var(--ds-background-success-bold,#36B37E)] text-white flex items-center justify-center shadow-md">
                          <Check size={18} strokeWidth={3} />
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4 text-center">
                      <div className="flex justify-center">
                        {feature.whatsapp ? (
                          <div className="w-8 h-8 rounded-full bg-[var(--ds-background-success-subtle,#E3FCEF)] text-[var(--ds-text-success,#006644)] flex items-center justify-center border border-[var(--ds-border-success,#36B37E)]">
                            <Check size={18} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[var(--ds-background-danger-subtle,#FFEBE6)] text-[var(--ds-text-danger,#BF2600)] flex items-center justify-center border border-[var(--ds-border-danger,#FF5630)]">
                            <X size={18} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-6 px-4 text-center">
                      <div className="flex justify-center">
                        {feature.paper ? (
                          <div className="w-8 h-8 rounded-full bg-[var(--ds-background-success-subtle,#E3FCEF)] text-[var(--ds-text-success,#006644)] flex items-center justify-center border border-[var(--ds-border-success,#36B37E)]">
                            <Check size={18} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[var(--ds-background-danger-subtle,#FFEBE6)] text-[var(--ds-text-danger,#BF2600)] flex items-center justify-center border border-[var(--ds-border-danger,#FF5630)]">
                            <X size={18} />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
