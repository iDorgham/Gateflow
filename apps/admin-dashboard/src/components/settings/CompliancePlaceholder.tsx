import { Badge } from '@gate-access/ui';
import { FileText, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CompliancePlaceholder() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 shrink-0">
          <FileText className="h-6 w-6 text-muted-foreground/60" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="text-sm font-black uppercase tracking-tight text-foreground">Compliance Reporting</p>
            <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground border-border">
              Coming Q4 2026
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-4 max-w-lg">
            SOC 2 and GDPR compliance reporting will be available in a future release. This will include automated audit report generation, data processing agreements, and retention policy enforcement.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
            {[
              'SOC 2 Type II report',
              'GDPR data export',
              'DPA template',
              'Retention enforcement',
              'Audit trail export',
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-muted-foreground/40" />
                {item}
              </span>
            ))}
          </div>
          <Link
            href="../audit-logs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
          >
            View audit logs now
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
