import { useState } from 'react';
import {
  Shield,
  Plus,
  Edit2,
  QrCode,
  Clock,
  Navigation,
  X,
} from 'lucide-react';
import type { PatrolRouteDto, PatrolRunDto } from '@gate-access/types';
import { PatrolRouteModal } from './PatrolRouteModal';
import { generateCheckpointPlacardSvg } from '@/lib/patrols/checkpoint-qr';

interface PatrolRouteManagerProps {
  isOpen: boolean;
  onClose: () => void;
  routes: PatrolRouteDto[];
  activeRuns?: PatrolRunDto[];
  onRouteSaved: (route: PatrolRouteDto) => void;
}

export function PatrolRouteManager({
  isOpen,
  onClose,
  routes,
  activeRuns = [],
  onRouteSaved,
}: PatrolRouteManagerProps) {
  const [selectedRouteForEdit, setSelectedRouteForEdit] =
    useState<PatrolRouteDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleOpenCreate = () => {
    setSelectedRouteForEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (route: PatrolRouteDto) => {
    setSelectedRouteForEdit(route);
    setIsModalOpen(true);
  };

  const handleDownloadAllPlacards = (route: PatrolRouteDto) => {
    route.checkpoints.forEach((cp, idx) => {
      const svg = generateCheckpointPlacardSvg({
        checkpointName: cp.name,
        routeName: route.name,
        orderIndex: idx,
      });

      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `checkpoint-${idx + 1}-${cp.name.toLowerCase().replace(/\s+/g, '-')}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 end-0 z-50 flex w-full max-w-md flex-col border-s border-slate-200 bg-white shadow-2xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Patrol Routes & Checkpoints
              </h3>
              <p className="text-xs text-slate-500">
                Manage perimeter guard patrol paths and stations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Button */}
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <button
            onClick={handleOpenCreate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Configure New Patrol Route
          </button>
        </div>

        {/* Route List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {routes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
              <Shield className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              <p className="mt-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                No Patrol Routes Configured
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Create your first route to track perimeter patrols on the map
              </p>
            </div>
          ) : (
            routes.map((route) => {
              const activeRun = activeRuns.find(
                (r) => r.routeId === route.id && r.status === 'IN_PROGRESS'
              );

              return (
                <div
                  key={route.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {route.name}
                        </h4>
                        {activeRun && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                            Live Patrol
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Every {route.frequencyMinutes}m
                        </span>
                        <span>•</span>
                        <span>{route.checkpoints.length} Stations</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownloadAllPlacards(route)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700"
                        title="Download All Checkpoint QR Placards"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(route)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700"
                        title="Edit Route"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Checkpoint Station Dots */}
                  <div className="mt-3 flex items-center gap-1.5 border-t border-slate-200/60 pt-3 dark:border-slate-800">
                    {route.checkpoints.map((cp, idx) => (
                      <div
                        key={cp.id || idx}
                        className="group relative flex h-6 w-6 items-center justify-center rounded-md bg-white text-[10px] font-bold text-slate-700 shadow-xs border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"
                        title={`Station ${idx + 1}: ${cp.name}`}
                      >
                        {idx + 1}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <PatrolRouteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={onRouteSaved}
        initialRoute={selectedRouteForEdit}
      />
    </>
  );
}
