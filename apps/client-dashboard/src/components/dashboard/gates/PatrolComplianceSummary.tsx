'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Search,
  Filter,
  User,
} from 'lucide-react';
import type { PatrolRunDto, PatrolRouteDto } from '@gate-access/types';
import type { LivePatrolSummary } from '@/app/api/patrols/live/route';

interface PatrolComplianceSummaryProps {
  activeRuns?: PatrolRunDto[];
  routes?: PatrolRouteDto[];
  summary?: LivePatrolSummary | null;
}

export function PatrolComplianceSummary({
  activeRuns = [],
  routes = [],
  summary,
}: PatrolComplianceSummaryProps) {
  const { t } = useTranslation('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredRuns = activeRuns.filter((run) => {
    const matchesSearch =
      run.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.guardName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'OVERDUE' && run.overdue) ||
      run.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleExportCsv = () => {
    if (activeRuns.length === 0) return;

    const headers = [
      'Run ID',
      'Route Name',
      'Guard Name',
      'Status',
      'Started At',
      'Completed At',
      'Stations Progress',
      'Overdue',
    ];
    const rows = activeRuns.map((r) => [
      r.id,
      `"${r.routeName.replace(/"/g, '""')}"`,
      `"${r.guardName.replace(/"/g, '""')}"`,
      r.status,
      r.startedAt || 'N/A',
      r.completedAt || 'N/A',
      `"${r.completedCheckpoints}/${r.totalCheckpoints}"`,
      r.overdue ? 'YES' : 'NO',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `guard-patrol-compliance-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const completedCount = summary?.completedTodayCount ?? 0;
  const activeCount = summary?.activeRunsCount ?? 0;
  const overdueCount = summary?.overdueRunsCount ?? 0;
  const totalRunsToday = completedCount + activeCount;
  const completionRate =
    totalRunsToday > 0
      ? Math.round((completedCount / totalRunsToday) * 100)
      : 100;

  return (
    <div className="space-y-4">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('shifts.totalRoutes', 'Configured Routes')}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {summary?.totalRoutes ?? routes.length}
            </span>
            <span className="text-xs text-slate-500">Active Paths</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('shifts.completionRate', 'On-Time SLA Rate')}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {completionRate}%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {completedCount} completed today
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('shifts.activeGuards', 'Active Patrollers')}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <User className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {summary?.activePatrolGuardsCount ?? 0}
            </span>
            <span className="text-xs text-slate-500">On Patrol Now</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('shifts.overdueRuns', 'Overdue Warnings')}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {overdueCount}
            </span>
            <span className="text-xs text-slate-500">
              {overdueCount === 0 ? 'All within SLA' : 'Requires Review'}
            </span>
          </div>
        </div>
      </div>

      {/* Compliance Table Container */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Table Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm">
            <div className="relative w-full">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={t(
                  'shifts.searchPatrols',
                  'Search by route or guard name...'
                )}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 ps-9 pe-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <option value="ALL">All Statuses</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="OVERDUE">Overdue SLA</option>
              </select>
            </div>

            <button
              onClick={handleExportCsv}
              disabled={activeRuns.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:bg-slate-800/60 dark:border-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-start">Route & Perimeter</th>
                <th className="px-4 py-3 text-start">Assigned Guard</th>
                <th className="px-4 py-3 text-start">Status</th>
                <th className="px-4 py-3 text-start">Checkpoint Progress</th>
                <th className="px-4 py-3 text-start">Started Time</th>
                <th className="px-4 py-3 text-start">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRuns.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    No patrol activity found matching selected criteria.
                  </td>
                </tr>
              ) : (
                filteredRuns.map((run) => (
                  <tr
                    key={run.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {run.routeName}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {run.guardName.slice(0, 1)}
                        </div>
                        <span>{run.guardName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {run.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </span>
                      ) : run.overdue ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950/60 dark:text-rose-400">
                          <AlertTriangle className="h-3 w-3" />
                          Overdue SLA
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950/60 dark:text-blue-400">
                          <Clock className="h-3 w-3" />
                          In Progress
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {run.completedCheckpoints} / {run.totalCheckpoints}
                        </span>
                        <div className="h-1.5 w-16 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{
                              width: `${(run.completedCheckpoints / (run.totalCheckpoints || 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                      {run.startedAt
                        ? new Date(run.startedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                      {run.startedAt
                        ? `${Math.floor((Date.now() - new Date(run.startedAt).getTime()) / (1000 * 60))}m`
                        : '0m'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
