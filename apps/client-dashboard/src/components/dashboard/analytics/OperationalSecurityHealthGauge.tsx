'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';
import type { SecurityHealthBreakdown } from '../../../lib/analytics/operational-intelligence';

interface OperationalSecurityHealthGaugeProps {
  health: SecurityHealthBreakdown;
  className?: string;
  isArabic?: boolean;
}

export function OperationalSecurityHealthGauge({
  health,
  className = '',
  isArabic = false,
}: OperationalSecurityHealthGaugeProps) {
  const { score, grade, denialRate, openIncidentsCount, activeShiftsCount } =
    health;

  const gradeConfig = {
    OPTIMAL: {
      label: isArabic ? 'آمن ومستقر' : 'Optimal Security',
      colorVar: 'var(--ds-text-success, #1f845a)',
      bgVar: 'var(--ds-background-success-subtle, rgba(31,132,90,0.1))',
      borderVar: 'var(--ds-border-success, #1f845a)',
      icon: ShieldCheck,
    },
    WARNING: {
      label: isArabic ? 'تحذير تشغيلي' : 'Operational Warning',
      colorVar: 'var(--ds-text-warning-inverse, #d97706)',
      bgVar: 'var(--ds-background-warning-subtle, rgba(217,119,6,0.1))',
      borderVar: 'var(--ds-border-warning, #d97706)',
      icon: AlertTriangle,
    },
    CRITICAL: {
      label: isArabic ? 'حالة حرجة' : 'Critical Incident Action Required',
      colorVar: 'var(--ds-text-danger, #ca3521)',
      bgVar: 'var(--ds-background-danger-subtle, rgba(202,53,33,0.1))',
      borderVar: 'var(--ds-border-danger, #ca3521)',
      icon: AlertOctagon,
    },
  }[grade];

  const Icon = gradeConfig.icon;

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 ${className}`}
      style={{
        borderColor: 'var(--ds-border, #dcdfe4)',
        backgroundColor: 'var(--ds-surface-raised, #ffffff)',
      }}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              backgroundColor: gradeConfig.bgVar,
              color: gradeConfig.colorVar,
            }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3
              className="text-xs font-black uppercase tracking-wider"
              style={{ color: 'var(--ds-text-subtle, #626f86)' }}
            >
              {isArabic ? 'مؤشر أمان البوابات' : 'Gate Security Health'}
            </h3>
            <p
              className="text-xs font-semibold"
              style={{ color: gradeConfig.colorVar }}
            >
              {gradeConfig.label}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span
            className="text-3xl font-black tabular-nums leading-none"
            style={{ color: gradeConfig.colorVar }}
          >
            {score}
          </span>
          <span
            className="text-xs font-bold ml-1"
            style={{ color: 'var(--ds-text-subtlest, #8590a2)' }}
          >
            /100
          </span>
        </div>
      </div>

      {/* Progress Bar Gauge */}
      <div
        className="h-2 w-full rounded-full overflow-hidden mb-4"
        style={{
          backgroundColor: 'var(--ds-background-neutral-subtle, #f1f2f4)',
        }}
      >
        <div
          className="h-full transition-all duration-500 rounded-full"
          style={{
            width: `${score}%`,
            backgroundColor: gradeConfig.colorVar,
          }}
        />
      </div>

      {/* Metric Breakdown Grid */}
      <div
        className="grid grid-cols-3 gap-2 pt-2 border-t"
        style={{ borderColor: 'var(--ds-border-subtle, #ebecf0)' }}
      >
        <div className="flex flex-col">
          <span
            className="text-[10px] font-bold uppercase"
            style={{ color: 'var(--ds-text-subtlest, #8590a2)' }}
          >
            {isArabic ? 'نسبة الرفض' : 'Denial Rate'}
          </span>
          <span
            className="text-sm font-black tabular-nums mt-0.5"
            style={{
              color:
                denialRate > 10
                  ? 'var(--ds-text-danger, #ca3521)'
                  : 'var(--ds-text, #172b4d)',
            }}
          >
            {denialRate}%
          </span>
        </div>

        <div className="flex flex-col">
          <span
            className="text-[10px] font-bold uppercase"
            style={{ color: 'var(--ds-text-subtlest, #8590a2)' }}
          >
            {isArabic ? 'بلاغات مفتوحة' : 'Open Incidents'}
          </span>
          <span
            className="text-sm font-black tabular-nums mt-0.5"
            style={{
              color:
                openIncidentsCount > 0
                  ? 'var(--ds-text-danger, #ca3521)'
                  : 'var(--ds-text, #172b4d)',
            }}
          >
            {openIncidentsCount}
          </span>
        </div>

        <div className="flex flex-col">
          <span
            className="text-[10px] font-bold uppercase"
            style={{ color: 'var(--ds-text-subtlest, #8590a2)' }}
          >
            {isArabic ? 'ورديات الحراسة' : 'Active Shifts'}
          </span>
          <span
            className="text-sm font-black tabular-nums mt-0.5"
            style={{ color: 'var(--ds-text, #172b4d)' }}
          >
            {activeShiftsCount}
          </span>
        </div>
      </div>
    </div>
  );
}
