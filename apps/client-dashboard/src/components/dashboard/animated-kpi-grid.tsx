'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn, Card, CardContent, CardHeader, CardTitle } from '@gate-access/ui';

export interface StatCardData {
  title: string;
  value: number | string;
  sub: string;
  icon: React.ReactNode;
  href: string;
  iconBg: string;
  valueColor: string;
}

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 80, damping: 25, restDelta: 0.5 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    mv.set(value);
  }, [mv, value]);

  return <motion.span>{display}</motion.span>;
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

interface AnimatedKpiGridProps {
  cards: StatCardData[];
}

export function AnimatedKpiGrid({ cards }: AnimatedKpiGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      role="region"
      aria-label="Key metrics"
    >
      {cards.map((card) => (
          <motion.div key={card.title} variants={itemVariants}>
            <Link
              href={card.href}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-focused,#4C9AFF)] rounded-xl"
            >
              <Card className="h-full border border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-surface-raised,#FFFFFF)] dark:bg-[#1D2125] shadow-[0_1px_1px_rgba(9,30,66,0.08),0_0_1px_rgba(9,30,66,0.08)] hover:shadow-[0_4px_8px_-2px_rgba(9,30,66,0.16),0_0_1px_rgba(9,30,66,0.08)] hover:border-[var(--ds-border-bold,#B3BAC5)] transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-[var(--ds-text-subtlest,#6B778C)]">
                      {card.title}
                    </CardTitle>
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', card.iconBg)}>
                      {card.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className={cn('text-3xl font-black tabular-nums leading-none', card.valueColor)}>
                        {typeof card.value === 'number' ? (
                          <AnimatedNumber value={card.value} />
                        ) : (
                          card.value
                        )}
                      </p>
                      <p className="mt-1.5 text-xs text-[var(--ds-text-subtlest,#6B778C)]">{card.sub}</p>
                    </div>
                    <ArrowRight
                      className="h-4 w-4 text-[var(--ds-icon-subtle,#6B778C)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--ds-icon,#172B4D)]"
                      aria-hidden="true"
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
      ))}
    </motion.div>
  );
}
