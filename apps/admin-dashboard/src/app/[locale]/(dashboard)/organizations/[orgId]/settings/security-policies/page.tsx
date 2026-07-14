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
  Badge,
} from '@gateflow/ui';
import { Shield, Lock, Eye, KeyRound, AlertTriangle } from 'lucide-react';

export default async function SecurityPoliciesPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  const { t } = await getTranslation(locale, 'admin');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-ds-text uppercase">
          {t('settings.securityPolicies')}
        </h2>
        <p className="text-ds-text-subtle text-sm mt-1">
          {t('settings.securityPoliciesDesc')}
        </p>
      </div>

      <Card className="border-ds-border bg-ds-background-default shadow-sm">
        <CardHeader className="border-b border-ds-border bg-ds-background-neutral-subtle/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-ds-background-brand-bold/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-ds-text-brand" />
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
        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* MFA Policy */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-ds-background-neutral-subtle flex items-center justify-center">
                    <Lock className="h-4 w-4 text-ds-text-subtle" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                      {t('settings.mfaPolicy')}
                    </span>
                    <span className="text-sm font-bold text-ds-text">
                      {t('settings.enforced')}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="success"
                  className="h-5 px-2 font-black uppercase text-[9px] tracking-widest"
                >
                  ACTIVE
                </Badge>
              </div>
              <div className="h-1.5 w-full bg-ds-background-neutral-subtle rounded-full overflow-hidden">
                <div className="bg-ds-background-success-bold h-full w-[100%]" />
              </div>
            </div>

            {/* Session TTL */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-ds-background-neutral-subtle flex items-center justify-center">
                    <Eye className="h-4 w-4 text-ds-text-subtle" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                      {t('settings.sessionTtl')}
                    </span>
                    <span className="text-sm font-bold text-ds-text">
                      12 Hours
                    </span>
                  </div>
                </div>
                <Badge
                  variant="subtle"
                  className="h-5 px-2 font-black uppercase text-[9px] tracking-widest"
                >
                  PRODUCTION
                </Badge>
              </div>
              <div className="h-1.5 w-full bg-ds-background-neutral-subtle rounded-full overflow-hidden">
                <div className="bg-ds-background-brand-bold h-full w-[70%]" />
              </div>
            </div>

            {/* Password Complexity */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-ds-background-neutral-subtle flex items-center justify-center">
                    <KeyRound className="h-4 w-4 text-ds-text-subtle" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                      {t('settings.passwordComplexity')}
                    </span>
                    <span className="text-sm font-bold text-ds-text">
                      High (12+ Chars, Symbols)
                    </span>
                  </div>
                </div>
                <Badge
                  variant="success"
                  className="h-5 px-2 font-black uppercase text-[9px] tracking-widest"
                >
                  SECURE
                </Badge>
              </div>
              <div className="h-1.5 w-full bg-ds-background-neutral-subtle rounded-full overflow-hidden">
                <div className="bg-ds-background-success-bold h-full w-[90%]" />
              </div>
            </div>

            {/* Idle Timeout */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-ds-background-neutral-subtle flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-ds-text-subtle" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                      {t('settings.idleTimeout')}
                    </span>
                    <span className="text-sm font-bold text-ds-text">
                      30 Minutes
                    </span>
                  </div>
                </div>
                <Badge
                  variant="warning"
                  className="h-5 px-2 font-black uppercase text-[9px] tracking-widest"
                >
                  STRICT
                </Badge>
              </div>
              <div className="h-1.5 w-full bg-ds-background-neutral-subtle rounded-full overflow-hidden">
                <div className="bg-ds-background-warning-bold h-full w-[40%]" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
