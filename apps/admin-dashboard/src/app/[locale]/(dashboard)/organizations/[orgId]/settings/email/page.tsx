import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { Mail, Shield, Wrench, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@gateflow/ui';

export const metadata = { title: 'Settings | Email SMTP' };

export default async function EmailSettingsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  await requireAdmin(locale);
  const { t } = await getTranslation(locale, 'admin');

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-black uppercase tracking-tight text-ds-text">
          Email Infrastructure
        </h2>
        <p className="text-xs text-ds-text-subtlest">
          Configure global SMTP settings for system-wide communications and
          notifications.
        </p>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-ds-background-brand-bold/5 rounded-3xl blur-xl group-hover:bg-ds-background-brand-bold/10 transition-all" />
        <Card className="relative shadow-sm border border-ds-border overflow-hidden rounded-3xl">
          <CardHeader className="border-b border-ds-border/50 pb-5 bg-ds-background-subtle/30">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2.5 text-ds-text">
              <div className="p-1.5 rounded-lg text-amber-600 bg-amber-500/10">
                <Mail className="h-3.5 w-3.5" />
              </div>
              Global SMTP Relay
            </CardTitle>
          </CardHeader>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center gap-6 min-h-[300px]">
            <div className="h-16 w-16 rounded-full bg-ds-background-neutral-subtle flex items-center justify-center animate-pulse">
              <Wrench className="h-8 w-8 text-ds-text-subtlest" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-black tracking-tight text-ds-text uppercase">
                Module Under Deployment
              </h3>
              <p className="text-xs text-ds-text-subtlest max-w-sm">
                We are currently re-architecting the email relay system to
                support high-throughput delivery and custom template engines.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-ds-background-brand-bold rounded-xl text-ds-text-inverse font-black text-[10px] uppercase tracking-widest cursor-wait shadow-lg shadow-ds-background-brand-bold/20">
                Notify Me on Release
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-ds-text-brand hover:underline cursor-pointer">
                Read RFC 4.1.2 <ExternalLink className="h-3 w-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
