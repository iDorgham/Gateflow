'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { Calendar, Clock, Info, ChevronLeft, ChevronRight, CheckCircle2, Lock, Sparkles, MapPin } from 'lucide-react';
import { cn } from '@gateflow/ui/utils';
import { Button, Badge, ScrollArea } from '@gateflow/ui';
import { motion } from 'framer-motion';

const calendarPrinciples = [
  {
    title: 'Satin-Charcoal Selection',
    description: 'Active date selections use the accent profile glow, while background cells use the Satin-Charcoal hierarchy for contrast.',
    icon: Calendar,
  },
  {
    title: 'Institutional Availability',
    description: 'Available slots use --gf-color-success (Emerald), while restricted or blocked slots use --ds-border-bold with low opacity.',
    icon: Lock,
  },
  {
    title: 'Time-Flow Transitions',
    description: 'Changing months or clicking through time slots uses horizontal sliding animations (0.3s) to maintain temporal continuity.',
    icon: Clock,
  },
];

export default function CalendarPatternsPage() {
  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto py-10 px-6">
      <PageHeader
        title="Calendar & Scheduling"
        subtitle="Custom patterns for booking, schedule rotation, and temporal management across the GateFlow ecosystem."
        breadcrumbs={[
          { label: 'Patterns', href: '/patterns' },
          { label: 'Calendar' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {calendarPrinciples.map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-4 p-6 rounded-2xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-2 w-fit rounded-lg bg-[var(--ds-background-brand-bold)] text-white shadow-lg transition-transform group-hover:rotate-6">
              <p.icon size={22} strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--ds-text-primary)]">
              {p.title}
            </h3>
            <p className="text-xs text-[var(--ds-text-subtle)] leading-relaxed font-medium">
              {p.description}
            </p>
          </div>
        ))}
      </section>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
            Schedule Lab
          </h2>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-60">
            Interactive demonstration of date selection, range picking, and availability logic.
          </p>
        </div>
        <ScheduleLab />
      </div>

      <section className="p-8 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] relative overflow-hidden group">
        <div className="absolute top-2 right-2 p-2 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-all duration-700">
            <Sparkles size={120} className="text-[var(--ds-primary-accent)]" />
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="p-2 w-fit rounded-lg bg-[var(--ds-background-brand-bold)] text-white shadow-md">
            <Info size={18} />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Temporal Continuity
            </h4>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-medium">
              In GateFlow, time is a high-stakes resource. Calendars must be dense enough to show full schedules but clear enough to prevent booking errors. We leverage <strong>--ds-border-bold</strong> for day cells and <strong>--ds-text-accent</strong> for today&apos;s date indicator.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ScheduleLab() {
  const [selectedDate, setSelectedDate] = React.useState(14);
  const [selectedTime, setSelectedTime] = React.useState('09:00 AM');
  
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const times = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'];
  
  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Calendar Card */}
      <div className="p-8 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-background-default)] shadow-2xl flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-black uppercase tracking-tight text-white leading-none">April 2026</h3>
                <span className="text-[10px] font-bold text-[var(--ds-text-subtle)] uppercase tracking-widest">Global Schedule Sync</span>
            </div>
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-[var(--ds-surface-subtle)] border border-white/5">
                    <ChevronLeft size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-[var(--ds-surface-subtle)] border border-white/5">
                    <ChevronRight size={16} />
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} className="h-8 flex items-center justify-center text-[9px] font-black text-[var(--ds-text-subtlest)]">{d}</div>
            ))}
            {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-10 opacity-20" />
            ))}
            {days.map(d => {
                const isActive = selectedDate === d;
                const isAvailable = d % 3 !== 0;
                return (
                    <button
                        key={d}
                        onClick={() => isAvailable && setSelectedDate(d)}
                        className={cn(
                            "h-10 rounded-lg flex items-center justify-center text-[10px] font-black transition-all",
                            isActive ? "bg-[var(--ds-background-brand-bold)] text-white shadow-[var(--ds-primary-accent)]/10 ring-2 ring-[var(--ds-primary-accent)]/20 shadow-lg" : 
                            isAvailable ? "hover:bg-[var(--ds-surface-subtle)] text-[var(--ds-text-primary)] border border-white/5" :
                            "bg-[var(--ds-surface-subtle)] text-[var(--ds-text-subtlest)] opacity-20 cursor-not-allowed"
                        )}
                    >
                        {d}
                    </button>
                );
            })}
        </div>
      </div>

      {/* Slots Card */}
      <div className="p-8 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] flex flex-col gap-8">
         <div className="flex flex-col gap-1">
            <Badge variant="outline" className="w-fit bg-[var(--ds-background-brand-bold)]/10 text-[var(--ds-text-brand)] border-[var(--ds-border-brand)]/20 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {selectedDate} April Selected
            </Badge>
            <h3 className="text-xl font-black uppercase tracking-tight text-white leading-none">Available Shifts</h3>
         </div>

         <ScrollArea className="flex-1">
            <div className="flex flex-col gap-3">
                {times.map(time => {
                    const isActive = selectedTime === time;
                    return (
                        <div 
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                                "p-4 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between",
                                isActive ? "bg-[var(--ds-background-default)] border-[var(--ds-primary-accent)] shadow-xl" : "bg-[var(--ds-surface-subtle)] border-white/5 hover:border-white/10"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-2 rounded-lg bg-[var(--ds-surface-subtle)] transition-colors",
                                    isActive ? "text-[var(--ds-primary-accent)]" : "text-[var(--ds-text-subtlest)]"
                                )}>
                                    <Clock size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-white">{time}</span>
                                    <span className="text-[9px] font-bold text-[var(--ds-text-subtlest)] uppercase tracking-tight">Main Gate Protocol</span>
                                </div>
                            </div>
                            {isActive && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    <CheckCircle2 size={16} className="text-[var(--gf-color-success)]" />
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>
         </ScrollArea>

         <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4">
             <div className="flex items-center gap-2 text-[var(--ds-text-subtlest)]">
                 <MapPin size={12} />
                 <span className="text-[9px] font-black uppercase tracking-widest">South Entry Point Alpha</span>
             </div>
             <Button className="w-full h-12 bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-[10px] shadow-xl rounded-xl">
                Confirm Deployment
             </Button>
         </div>
      </div>
    </div>
  );
}
