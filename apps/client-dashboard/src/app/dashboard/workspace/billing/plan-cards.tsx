'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@gate-access/ui';
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
}

export function PlanCards({ plans, currentPlan }: PlanCardsProps) {
  const currentPlanIndex = plans.findIndex((p) => p.name === currentPlan);

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {plans.map((plan, i) => {
        const isCurrent = plan.name === currentPlan;
        const isUpgrade = i > currentPlanIndex;
        
        return (
          <Card
            key={plan.name}
            className={cn(
              'relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300',
              isCurrent 
                ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg scale-[1.02] z-10 bg-white dark:bg-slate-800' 
                : 'border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
            )}
          >
            {isCurrent && (
              <div className="absolute top-0 right-0">
                <div className="bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                  Active
                </div>
              </div>
            )}
            
            <CardHeader className="pb-5 pt-6">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-sm font-bold tracking-wider uppercase text-slate-500">{plan.name}</CardTitle>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                {plan.period && <span className="text-xs font-medium text-slate-400">/{plan.period}</span>}
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-6 pt-0">
              <ul className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <div className="mt-0.5 rounded-full bg-green-100 dark:bg-green-900/30 p-0.5">
                      <Check className="h-3 w-3 text-green-600 font-bold" aria-hidden="true" />
                    </div>
                    <span className="font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={cn(
                  "w-full rounded-xl font-bold transition-all",
                  isCurrent 
                    ? "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-none" 
                    : "bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900"
                )}
                variant={isCurrent ? 'outline' : 'default'}
                disabled={isCurrent}
                onClick={() => {
                  if (plan.name === 'ENTERPRISE') {
                    window.location.href = 'mailto:sales@gateflow.io';
                  } else {
                    alert(`Stripe integration coming soon. Contact sales@gateflow.io to upgrade.`);
                  }
                }}
              >
                {isCurrent ? 'Current plan' : isUpgrade ? 'Upgrade' : 'Downgrade'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
