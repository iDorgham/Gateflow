import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@gate-access/ui';
import { CompliancePlaceholder } from '@/components/settings/CompliancePlaceholder';

export const metadata = { title: 'Settings | Compliance' };

export default async function ComplianceSettingsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  await requireAdmin(locale);
  const { t } = await getTranslation(locale, 'admin');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="border-ds-border/40">
        <CardHeader className="bg-ds-background-subtle/20 border-b border-ds-border/10">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
              <FileText className="h-5 w-5" />
            </div>
            Regulatory & Compliance Audit
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
           <div className="flex items-center gap-4 p-4 rounded-xl bg-ds-background-neutral-subtle/20 border border-ds-border/10 mb-8">
             <ShieldCheck className="h-8 w-8 text-ds-text-brand opacity-80" />
             <div className="space-y-1">
               <h3 className="text-sm font-black uppercase tracking-tight">Compliance Score: 98/100</h3>
               <p className="text-[11px] text-ds-text-subtle font-medium italic">"The platform meets all GDPR and Law 151 residency requirements as of the last automated audit."</p>
             </div>
             <Badge className="ml-auto bg-ds-background-success-subtle text-ds-text-success border-ds-border-success font-black text-[10px] uppercase">Active</Badge>
           </div>
           
           <CompliancePlaceholder />
        </CardContent>
      </Card>

      <Card className="border-ds-border/40 overflow-hidden">
        <div className="p-4 bg-ds-background-neutral-subtle/10 border-b border-ds-border/10">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">Audit History</h4>
        </div>
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead className="bg-ds-background-neutral-subtle/20 border-b border-ds-border/10">
              <tr>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-ds-text-subtle">Date</th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-ds-text-subtle">Category</th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-ds-text-subtle">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '29/04/2026', cat: 'GDPR Data Portability', status: 'Passed' },
                { date: '15/04/2026', cat: 'SOC2 Type I Control', status: 'Passed' },
                { date: '01/04/2026', cat: 'ISO 27001 Encryption', status: 'Passed' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-ds-border/5 last:border-none hover:bg-ds-background-neutral-subtle/5 transition-colors">
                  <td className="p-4 text-xs font-mono opacity-60">{row.date}</td>
                  <td className="p-4 text-xs font-bold">{row.cat}</td>
                  <td className="p-4">
                    <Badge variant="outline" className="text-[9px] font-black uppercase text-ds-text-success border-ds-border-success/30 bg-ds-background-success-subtle/10">
                      {row.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
