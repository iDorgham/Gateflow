import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { 
  Database, 
  ShieldCheck, 
  Lock, 
  Globe, 
  Settings, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Badge, 
  cn,
  Button
} from '@gate-access/ui';
import Link from 'next/link';

export const metadata = { title: 'Settings | Overview' };

export default async function SettingsOverviewPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  await requireAdmin(locale);
  const { t } = await getTranslation(locale, 'admin');

  const summaries = [
    { 
      title: 'Database', 
      href: '/settings/database', 
      icon: Database, 
      color: 'text-blue-500 bg-blue-500/10',
      desc: 'Masked connection strings, pooling status, and persistence health.',
      status: !!process.env.DATABASE_URL ? 'Connected' : 'Error'
    },
    { 
      title: 'Authentication', 
      href: '/settings/auth', 
      icon: ShieldCheck, 
      color: 'text-emerald-500 bg-emerald-500/10',
      desc: 'NextAuth secrets, admin access keys, and session strategies.',
      status: !!process.env.NEXTAUTH_SECRET ? 'Secured' : 'Missing Keys'
    },
    { 
      title: 'Security & QR', 
      href: '/settings/security', 
      icon: Lock, 
      color: 'text-rose-500 bg-rose-500/10',
      desc: 'QR signing algorithms, token lifespans, and hashing policies.',
      status: !!process.env.QR_SIGNING_SECRET ? 'Validated' : 'Action Required'
    },
    { 
      title: 'Infrastructure', 
      href: '/settings/infrastructure', 
      icon: Globe, 
      color: 'text-cyan-500 bg-cyan-500/10',
      desc: 'Public URLs, API endpoints, and rate limiting connectivity.',
      status: !!process.env.NEXT_PUBLIC_APP_URL ? 'Active' : 'Unconfigured'
    },
    { 
      title: 'Style Hub', 
      href: '/settings/style-hub', 
      icon: Settings, 
      color: 'text-purple-500 bg-purple-500/10',
      desc: 'Live theme editor, brand tokens, and style snapshots.',
      status: 'Ready'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {summaries.map((s) => (
          <Link key={s.href} href={`/${locale}${s.href}`} className="group">
            <Card className="h-full border-ds-border/40 hover:border-ds-border-brand/40 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className={cn("p-2 rounded-xl", s.color)}>
                  <s.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className={cn(
                  "text-[9px] font-black uppercase tracking-widest",
                  s.status === 'Connected' || s.status === 'Secured' || s.status === 'Validated' || s.status === 'Active'
                    ? "text-ds-text-success border-ds-border-success/30 bg-ds-background-success-subtle/10"
                    : "text-ds-text-warning border-ds-border-warning/30 bg-ds-background-warning-subtle/10"
                )}>
                  {s.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase tracking-tight group-hover:text-ds-text-brand transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-[11px] text-ds-text-subtle leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-ds-text-brand opacity-0 group-hover:opacity-100 transition-all">
                  Configure Settings <ArrowRight className="h-3 w-3 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-ds-border-warning/30 bg-ds-background-warning-subtle/10 p-6 flex items-start gap-4">
        <Settings className="h-5 w-5 text-ds-text-warning mt-1 shrink-0" />
        <div className="space-y-2">
           <h4 className="text-xs font-black uppercase tracking-tight">Configuration Environment Notice</h4>
           <p className="text-[11px] text-ds-text-subtle leading-relaxed max-w-2xl">
             All settings shown are derived from the active environment variables. Changes require a server restart or deployment update. Local overrides can be managed via your <code className="bg-ds-background-subtle px-1 rounded font-mono">.env.local</code> file for development environments.
           </p>
           <Button variant="outline" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest px-4 border-ds-border-warning/30 text-ds-text-warning hover:bg-ds-background-warning-subtle/30">
             Restart Instance
           </Button>
        </div>
      </div>
    </div>
  );
}
