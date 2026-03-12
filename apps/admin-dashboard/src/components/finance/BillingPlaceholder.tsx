import { Badge } from '@gate-access/ui';
import { CreditCard, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function BillingPlaceholder() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
          <CreditCard className="h-7 w-7 text-muted-foreground/60" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mb-2">
        <p className="text-sm font-black uppercase tracking-tight text-foreground">Stripe Integration</p>
        <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground border-border">
          Coming Q4 2026
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
        Connect Stripe to enable real billing data, invoice management, subscription lifecycle webhooks, and automated dunning.
      </p>
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
          Invoice management
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
          Subscription webhooks
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
          Automated dunning
        </span>
      </div>
      <div className="mt-4 pt-4 border-t border-border/50">
        <Link
          href="/audit-logs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
        >
          View audit logs
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
