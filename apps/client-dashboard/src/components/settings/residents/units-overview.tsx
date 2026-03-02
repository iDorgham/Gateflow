'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Input,
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { UnitType } from '@gate-access/db';
import { Search, MapPin, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnitWithStats {
  id: string;
  name: string;
  type: UnitType;
  building: string | null;
  qrQuota: number | null;
  _count: {
    visitorQRs: number;
  };
}

interface QuotaLimit {
  unitType: UnitType;
  monthlyQuota: number;
}

interface UnitsOverviewProps {
  units: UnitWithStats[];
  limits: QuotaLimit[];
}

function QuotaProgress({ used, total }: { used: number; total: number }) {
  const percentage = Math.min(Math.round((used / total) * 100), 100);
  const isHigh = percentage >= 80;
  const isFull = percentage >= 100;

  return (
    <div className="w-full max-w-[120px] space-y-1.5">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest leading-none">
        <span className={cn(isFull ? "text-destructive" : isHigh ? "text-warning" : "text-muted-foreground")}>
          {used} / {total}
        </span>
        <span className="text-muted-foreground/50">{percentage}%</span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500 rounded-full",
            isFull ? "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.4)]" : 
            isHigh ? "bg-warning shadow-[0_0_8px_rgba(245,158,11,0.4)]" : 
            "bg-primary shadow-[0_0_8px_rgba(59,130,246,0.4)]"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function UnitsOverview({ units, limits }: UnitsOverviewProps) {
  const { t } = useTranslation('dashboard');
  const [search, setSearch] = useState('');

  const filteredUnits = units.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.building?.toLowerCase().includes(search.toLowerCase())
  );

  const getEffectiveQuota = (unit: UnitWithStats) => {
    if (unit.qrQuota !== null) return unit.qrQuota;
    const limit = limits.find(l => l.unitType === unit.type);
    return limit?.monthlyQuota ?? 10; // Default fallback
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('settings.residents.searchUnits', 'Search units or buildings...')}
          className="pl-9 h-10 rounded-xl bg-card border-border/50 focus-visible:ring-primary/20 transition-all font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 border-b border-border/50">
              <TableHead className="font-bold text-[10px] uppercase tracking-[0.2em]">{t('settings.residents.unit', 'Unit')}</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-[0.2em]">{t('settings.residents.type', 'Type')}</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-[0.2em]">{t('settings.residents.building', 'Building')}</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-[0.2em]">{t('settings.residents.quotaUsage', 'Quota Usage')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                  {t('settings.residents.noUnits', 'No units matching your search.')}
                </TableCell>
              </TableRow>
            ) : (
              filteredUnits.map((unit) => {
                const quota = getEffectiveQuota(unit);
                return (
                  <TableRow key={unit.id} className="group hover:bg-muted/30 transition-colors border-b border-border/20 last:border-0">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4 text-primary opacity-60" />
                        <span className="font-black text-foreground">{unit.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-bold tracking-tight uppercase text-[9px] border-border/50">
                        {unit.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {unit.building || '—'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <QuotaProgress used={unit._count.visitorQRs} total={quota} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
