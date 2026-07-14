'use client';

import React, { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  MoreVertical,
  Filter,
  ArrowRight,
  Sparkles,
  TrendingUp,
  DollarSign,
  Calendar,
  Building2,
  ChevronRight,
  Clock,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Skeleton,
  cn,
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Progress,
} from '@gateflow/ui';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
  { id: 'LEAD', label: 'Lead Discovery', color: 'bg-blue-500' },
  { id: 'QUALIFIED', label: 'Qualification', color: 'bg-amber-500' },
  { id: 'PROPOSAL', label: 'Proposal Sent', color: 'bg-purple-500' },
  { id: 'NEGOTIATION', label: 'Negotiation', color: 'bg-indigo-500' },
  { id: 'CLOSED_WON', label: 'Closed Won', color: 'bg-emerald-500' },
];

interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: string;
  probability: number;
  expectedClose: string;
  score: number;
  owner: {
    name: string;
    avatar?: string;
  };
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetch for deals
    setTimeout(() => {
      setDeals([
        {
          id: '1',
          title: 'Enterprise Gate Access v5',
          company: 'Al Rimal Developments',
          value: 450000,
          stage: 'PROPOSAL',
          probability: 70,
          expectedClose: '2026-06-15',
          score: 88,
          owner: { name: 'Dorgham' },
        },
        {
          id: '2',
          title: 'Scanner Hub Expansion',
          company: 'Global Tech Solutions',
          value: 125000,
          stage: 'QUALIFIED',
          probability: 45,
          expectedClose: '2026-08-20',
          score: 62,
          owner: { name: 'Sarah' },
        },
        {
          id: '3',
          title: 'MENA Regional License',
          company: 'Dubai Holding',
          value: 2800000,
          stage: 'NEGOTIATION',
          probability: 85,
          expectedClose: '2026-05-10',
          score: 95,
          owner: { name: 'Omar' },
        },
        {
          id: '4',
          title: 'Residential Suite Pack',
          company: 'Rossi Luxury Villas',
          value: 85000,
          stage: 'LEAD',
          probability: 20,
          expectedClose: '2026-10-01',
          score: 41,
          owner: { name: 'Elena' },
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStageDeals = (stageId: string) =>
    deals.filter((d) => d.stage === stageId);

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <Target className="h-8 w-8 text-ds-icon-brand" />
            Deals Pipeline
          </h1>
          <p className="text-xs font-bold text-ds-text-subtler uppercase tracking-widest mt-1">
            Visualizing high-value capital flows and deal vector trajectories
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-11 border-ds-border gap-2 text-[10px] font-black uppercase tracking-widest px-4"
          >
            <TrendingUp className="h-4 w-4" /> Forecasting
          </Button>
          <Button className="h-11 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] gap-2 px-6">
            <Plus className="h-4 w-4" /> Create Deal
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-6 custom-scrollbar">
        <div className="flex gap-6 min-w-max h-full px-1">
          {STAGES.map((stage) => (
            <div key={stage.id} className="w-80 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn('h-2.5 w-2.5 rounded-full', stage.color)}
                  />
                  <h3 className="text-xs font-black uppercase tracking-widest text-ds-text-subtler">
                    {stage.label}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 px-1.5 border-border/40 font-bold bg-muted/30"
                  >
                    {getStageDeals(stage.id).length}
                  </Badge>
                </div>
                <div className="text-[10px] font-black text-ds-text-subtler opacity-60">
                  $
                  {getStageDeals(stage.id)
                    .reduce((acc, d) => acc + d.value, 0)
                    .toLocaleString()}
                </div>
              </div>

              <div className="flex-1 bg-muted/20 border border-dashed border-border/40 rounded-2xl p-3 flex flex-col gap-3 min-h-[500px]">
                {isLoading ? (
                  <Skeleton className="h-40 w-full rounded-xl" />
                ) : (
                  <AnimatePresence>
                    {getStageDeals(stage.id).map((deal) => (
                      <motion.div
                        key={deal.id}
                        layoutId={deal.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group"
                      >
                        <Card className="border-border/50 bg-card/60 backdrop-blur-sm cursor-grab active:cursor-grabbing hover:border-ds-border-brand/40 transition-all shadow-sm">
                          <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col gap-1">
                                <h4 className="text-sm font-black text-ds-text uppercase tracking-tight group-hover:text-ds-text-brand transition-colors">
                                  {deal.title}
                                </h4>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-ds-text-subtler">
                                  <Building2 className="h-3 w-3" />{' '}
                                  {deal.company}
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-ds-text-subtler"
                                  >
                                    <MoreVertical className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-40 border-ds-border"
                                >
                                  <DropdownMenuItem className="text-[10px] font-black uppercase">
                                    Edit Deal
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-[10px] font-black uppercase text-rose-500">
                                    Archive
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-ds-text-brand">
                                <DollarSign className="h-3.5 w-3.5" />
                                <span className="text-base font-black">
                                  {deal.value.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-noise border border-border/30">
                                <Sparkles
                                  className={cn(
                                    'h-3 w-3',
                                    deal.score > 80
                                      ? 'text-amber-500'
                                      : 'text-ds-icon-disabled'
                                  )}
                                />
                                <span className="text-[10px] font-black">
                                  {deal.score}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest opacity-60">
                                <span>Closing Prob.</span>
                                <span>{deal.probability}%</span>
                              </div>
                              <Progress
                                value={deal.probability}
                                className="h-1 bg-muted"
                              />
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-border/20">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6 border border-border/30">
                                  <AvatarFallback className="text-[8px] font-black uppercase">
                                    {deal.owner.name.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-black uppercase">
                                    {deal.owner.name}
                                  </span>
                                  <div className="flex items-center gap-1 text-[8px] font-bold text-ds-text-subtler">
                                    <Calendar className="h-2.5 w-2.5" />{' '}
                                    {deal.expectedClose}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 rounded-full hover:bg-ds-background-brand-subtle group-hover:text-ds-text-brand"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}

                <Button
                  variant="ghost"
                  className="w-full h-12 border border-dashed border-border/30 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:bg-muted/50 mt-auto"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Deal
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
