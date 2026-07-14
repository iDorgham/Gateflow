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
import { Shield, Zap, Globe, Link2 } from 'lucide-react';

export default async function AppUrlsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  const { t } = await getTranslation(locale, 'admin');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-ds-text uppercase">
          {t('settings.appUrls')}
        </h2>
        <p className="text-ds-text-subtle text-sm mt-1">
          {t('settings.appUrlsDesc')}
        </p>
      </div>

      <Card className="border-ds-border bg-ds-background-default shadow-sm">
        <CardHeader className="border-b border-ds-border bg-ds-background-neutral-subtle/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-ds-background-brand-bold/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-ds-text-brand" />
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
                htmlFor="adminUrl"
                className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle"
              >
                {t('settings.adminUrl')}
              </Label>
              <div className="relative">
                <Input
                  id="adminUrl"
                  disabled
                  value="https://admin.gateflow.io"
                  className="bg-ds-background-neutral-subtle/50 border-ds-border font-bold h-11 ltr:pl-10"
                />
                <Link2 className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest" />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="clientUrl"
                className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle"
              >
                {t('settings.clientUrl')}
              </Label>
              <div className="relative">
                <Input
                  id="clientUrl"
                  disabled
                  value="https://app.gateflow.io"
                  className="bg-ds-background-neutral-subtle/50 border-ds-border font-bold h-11 ltr:pl-10"
                />
                <Link2 className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest" />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="mobileUrl"
                className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle"
              >
                {t('settings.mobileUrl')}
              </Label>
              <div className="relative">
                <Input
                  id="mobileUrl"
                  disabled
                  value="https://scanner.gateflow.io"
                  className="bg-ds-background-neutral-subtle/50 border-ds-border font-bold h-11 ltr:pl-10"
                />
                <Link2 className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest" />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="apiBaseUrl"
                className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle"
              >
                {t('settings.apiBaseUrl')}
              </Label>
              <div className="relative">
                <Input
                  id="apiBaseUrl"
                  disabled
                  value="https://api.gateflow.io/v1"
                  className="bg-ds-background-neutral-subtle/50 border-ds-border font-bold h-11 ltr:pl-10"
                />
                <Link2 className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
