import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@gate-access/ui';

export const metadata = { title: 'Settings | Security' };

function envMasked(name: string, chars = 6): string {
  const val = process.env[name];
  if (!val) return '— not set —';
  if (val.length <= chars) return '●'.repeat(val.length);
  return (
    val.slice(0, chars) +
    '●'.repeat(Math.max(0, val.length - chars - 4)) +
    val.slice(-4)
  );
}

export default async function SecuritySettingsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  await requireAdmin(locale);
  const { t } = await getTranslation(locale, 'admin');

  const items = [
    {
      label: 'QR_SIGNING_SECRET',
      value: envMasked('QR_SIGNING_SECRET'),
      ok: !!process.env.QR_SIGNING_SECRET,
    },
    { label: 'Algorithm', value: 'HMAC-SHA256', ok: true },
    { label: 'Access Token TTL', value: '15 Minutes', ok: true },
    { label: 'Refresh Token TTL', value: '30 Days', ok: true },
    { label: 'Password Hashing', value: 'Argon2id', ok: true },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-ds-border/40">
        <CardHeader className="bg-ds-background-subtle/20 border-b border-ds-border/10">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
              <Lock className="h-5 w-5" />
            </div>
            Security Policies & QR Integrity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-3 border-b border-ds-border/10 last:border-none"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                {item.label}
              </p>
              <div className="flex items-center gap-3">
                {item.ok ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                )}
                <code className="text-xs font-mono font-bold bg-ds-background-subtle/50 px-2 py-1 rounded border border-ds-border/10">
                  {item.value}
                </code>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
