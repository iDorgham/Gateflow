import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Label,
} from '@gateflow/ui';
import { Shield, Zap, Globe, Lock } from 'lucide-react';

export default async function RateLimitingPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  const { t } = await getTranslation(locale, 'admin');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-ds-text uppercase">
          {t('settings.rateLimiting')}
        </h2>
        <p className="text-ds-text-subtle text-sm mt-1">
          {t('settings.rateLimitingDesc')}
        </p>
      </div>

      <Card className="border-ds-border bg-ds-background-default shadow-sm">
        <CardHeader className="border-b border-ds-border bg-ds-background-neutral-subtle/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-ds-background-brand-bold/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-ds-text-brand" />
            </div>
            <div>
              <CardTitle className="text-base font-black uppercase tracking-tight">
                {t('settings.sections.configuration')}
              </CardTitle>
              <CardDescription className="text-xs">
                {t('settings.allConfigPresent')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="apiThreshold"
                className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle"
              >
                {t('settings.apiThreshold')}
              </Label>
              <div className="relative">
                <Input
                  id="apiThreshold"
                  disabled
                  value="1000"
                  className="bg-ds-background-neutral-subtle/50 border-ds-border font-bold h-11 ltr:pr-24 rtl:pl-24"
                />
                <div className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-ds-text-subtlest uppercase tracking-tighter">
                  {t('settings.requestsPerMinute')}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="authThreshold"
                className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle"
              >
                {t('settings.authThreshold')}
              </Label>
              <div className="relative">
                <Input
                  id="authThreshold"
                  disabled
                  value="20"
                  className="bg-ds-background-neutral-subtle/50 border-ds-border font-bold h-11 ltr:pr-24 rtl:pl-24"
                />
                <div className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-ds-text-subtlest uppercase tracking-tighter">
                  {t('settings.requestsPerMinute')}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="qrThreshold"
                className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle"
              >
                {t('settings.qrThreshold')}
              </Label>
              <div className="relative">
                <Input
                  id="qrThreshold"
                  disabled
                  value="500"
                  className="bg-ds-background-neutral-subtle/50 border-ds-border font-bold h-11 ltr:pr-24 rtl:pl-24"
                />
                <div className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-ds-text-subtlest uppercase tracking-tighter">
                  {t('settings.requestsPerMinute')}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-ds-background-info-subtle border border-ds-border-info/20 flex gap-4">
            <div className="h-8 w-8 rounded-lg bg-ds-background-info-bold/10 flex items-center justify-center shrink-0">
              <Shield className="h-4 w-4 text-ds-text-info" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-ds-text-info uppercase tracking-tight">
                {t('settings.configNoticeTitle')}
              </h4>
              <p className="text-xs text-ds-text-info/80 leading-relaxed">
                {t('settings.configNoticeDesc', {
                  code: (str: string) => (
                    <code className="bg-ds-background-info-bold/10 px-1 rounded font-mono">
                      {str}
                    </code>
                  ),
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
