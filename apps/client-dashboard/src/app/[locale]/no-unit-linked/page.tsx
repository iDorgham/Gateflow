import { getSessionClaims } from '@/lib/auth-cookies';
import { redirect } from 'next/navigation';
import { Button } from '@gate-access/ui';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { getTranslation } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n-config';

export default async function NoUnitLinkedPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const claims = await getSessionClaims();
  if (!claims) redirect(`/${params.locale}/login`);

  const { t } = await getTranslation(params.locale, 'dashboard');

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {t('resident.noUnitLinked', { defaultValue: 'No unit linked to your account' })}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t('resident.noUnitLinkedDesc', {
              defaultValue:
                'Your account has the Resident role but is not linked to any unit yet. Please contact your organization administrator to link your account to a unit from the Units page.',
            })}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/${params.locale}/login`}>
            {t('resident.backToLogin', { defaultValue: 'Back to login' })}
          </Link>
        </Button>
      </div>
    </div>
  );
}
