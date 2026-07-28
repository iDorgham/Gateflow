'use client';

import { Card, CardContent, CardHeader, CardTitle, Button } from '@gateflow/ui';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
}

interface PlanCardsProps {
  plans: Plan[];
  currentPlan: string;
  onUpgrade: (planName: string) => Promise<void>;
  loadingPlan?: string | null;
}

export function PlanCards({
  plans,
  currentPlan,
  onUpgrade,
  loadingPlan,
}: PlanCardsProps) {
  const currentPlanIndex = plans.findIndex((p) => p.name === currentPlan);

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {plans.map((plan, i) => {
        const isCurrent = plan.name === currentPlan;
        const isUpgrade = i > currentPlanIndex;
        const isLoading = loadingPlan === plan.name;

        return (
          <Card
            key={plan.name}
            className={cn(
              'relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300',
              isCurrent
                ? 'border-info ring-2 ring-info/20 shadow-lg scale-[1.02] z-10 bg-card'
                : 'border-border shadow-sm hover:shadow-md hover:border-muted-foreground/30 bg-card'
            )}
          >
            {isCurrent && (
              <div className="absolute top-0 right-0">
                <div className="bg-info text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                  Active
                </div>
              </div>
            )}

            <CardHeader className="pb-5 pt-6">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-sm font-bold tracking-wider uppercase text-muted-foreground">
                  {plan.name}
                </CardTitle>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-foreground">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-xs font-medium text-muted-foreground">
                    /{plan.period}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-6 pt-0">
              <ul className="space-y-3.5 text-sm text-muted-foreground flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <div className="mt-0.5 rounded-full bg-success-subtle p-0.5">
                      <Check
                        className="h-3 w-3 text-success-bold font-bold"
                        aria-hidden="true"
                      />
                    </div>
                    <span className="font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={cn(
                  'w-full rounded-xl font-bold transition-all',
                  isCurrent
                    ? 'bg-info-subtle hover:bg-info-subtle/70 text-info-bold border-none'
                    : 'bg-foreground hover:bg-foreground/90 text-background'
                )}
                variant={isCurrent ? 'outline' : 'default'}
                disabled={isCurrent || !!loadingPlan}
                onClick={() => onUpgrade(plan.name)}
              >
                {isLoading
                  ? 'Processing...'
                  : isCurrent
                    ? 'Current plan'
                    : isUpgrade
                      ? 'Upgrade'
                      : 'Downgrade'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
