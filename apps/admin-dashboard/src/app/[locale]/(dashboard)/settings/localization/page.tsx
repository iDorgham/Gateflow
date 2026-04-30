import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { Globe, RefreshCw, Languages, Search } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
} from '@gate-access/ui';

export const metadata = { title: 'Settings | Localization' };

export default async function LocalizationSettingsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  await requireAdmin(locale);
  const { t } = await getTranslation(locale, 'admin');

  const locales = [
    {
      code: 'en',
      name: 'English (US)',
      status: 'Default',
      native: 'English',
      progress: 100,
    },
    {
      code: 'ar',
      name: 'Arabic (KSA)',
      status: 'Active',
      native: 'العربية',
      progress: 98,
    },
    {
      code: 'fr',
      name: 'French (FR)',
      status: 'Beta',
      native: 'Français',
      progress: 65,
    },
    {
      code: 'es',
      name: 'Spanish (ES)',
      status: 'Experimental',
      native: 'Español',
      progress: 40,
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-black uppercase tracking-tight text-ds-text">
          Language & Locales
        </h2>
        <p className="text-xs text-ds-text-subtlest">
          Manage system translations, regional formats, and localization
          coverage.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ds-text-subtlest" />
            <Input
              placeholder="Search locales..."
              className="pl-9 h-10 rounded-xl bg-ds-background-neutral-subtle border-ds-border shadow-none"
            />
          </div>
          <div className="px-4 h-10 flex items-center gap-2 rounded-xl border border-ds-border-brand/40 bg-ds-background-brand-subtle/20 text-ds-text-brand-bold text-[10px] font-black uppercase tracking-widest hover:bg-ds-background-brand-subtle/30 cursor-pointer transition-all">
            <RefreshCw className="h-3.5 w-3.5" /> Sync All Dictionaries
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {locales.map((l) => (
            <Card
              key={l.code}
              className="shadow-sm border border-ds-border transition-all hover:border-ds-border-brand/50 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 flex flex-col items-end gap-1 translate-x-2 group-hover:translate-x-0 transition-transform opacity-30 group-hover:opacity-100">
                <Badge
                  variant="primary"
                  className="text-[8px] h-4 font-black rounded-sm border-none uppercase tracking-tighter shadow-sm bg-ds-background-brand-bold text-ds-text-inverse"
                >
                  {l.status}
                </Badge>
              </div>
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-ds-background-neutral-subtle flex items-center justify-center border border-ds-border/50 group-hover:bg-ds-background-brand-subtle transition-colors">
                    <Languages className="h-5 w-5 text-ds-text-subtle group-hover:text-ds-text-brand-bold transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-ds-text uppercase tracking-tight">
                      {l.name}
                    </span>
                    <span className="text-[10px] text-ds-text-subtlest font-bold font-mono uppercase">
                      {l.native}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-4 flex flex-col gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[9px] font-black uppercase text-ds-text-subtlest">
                    <span>Dictionary Coverage</span>
                    <span>{l.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-ds-background-neutral-subtle rounded-full overflow-hidden border border-ds-border/20">
                    <div
                      className="h-full bg-ds-background-brand-bold transition-all duration-1000 ease-out"
                      style={{ width: `${l.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-[9px] font-black uppercase tracking-widest text-ds-text-brand hover:underline cursor-pointer flex items-center gap-1.5">
                    <Globe className="h-3 w-3" /> Overrides
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
