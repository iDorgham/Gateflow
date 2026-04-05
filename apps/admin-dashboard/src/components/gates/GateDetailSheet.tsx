'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  Badge,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gate-access/ui';
import {
  ShieldAlert,
  MapPin,
  Settings,
  X,
  DoorOpen,
  Trash2,
  RotateCcw,
  FolderOpen,
  ScanLine,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

interface Gate {
  id: string;
  name: string;
  location: string;
  project: { name: string };
  organization: { name: string };
  scans: { total: number; last24h: number };
  createdAt: string;
  status: 'COMMISSIONED' | 'OFFLINE';
}

interface GateDetailSheetProps {
  gateId: string | null;
  onClose: () => void;
}

export function GateDetailSheet({ gateId, onClose }: GateDetailSheetProps) {
  const [loading, setLoading] = React.useState(false);
  const [gate, setGate] = React.useState<Gate | null>(null);

  React.useEffect(() => {
    if (gateId) {
      setLoading(true);
      setTimeout(() => {
        setGate({
          id: gateId,
          name: 'Main Entrance North',
          location: 'Building A, Floor 1',
          project: { name: 'Modern Skyline Resident' },
          organization: { name: 'GateFlow Global' },
          scans: { total: 456, last24h: 32 },
          createdAt: new Date().toISOString(),
          status: 'COMMISSIONED',
        });
        setLoading(false);
      }, 500);
    } else {
      setGate(null);
    }
  }, [gateId]);

  const handleArchive = () => {
    toast.success('Gate archived successfully');
    onClose();
  };

  const handleRestore = () => {
    toast.success('Gate restored successfully');
    onClose();
  };

  return (
    <Sheet open={!!gateId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl p-0 flex flex-col overflow-hidden border-l border-ds-border">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-ds-border border-t-ds-background-brand-bold" />
          </div>
        ) : gate ? (
          <>
            <div className="flex flex-col space-y-2 text-center sm:text-left p-6 border-b border-ds-border bg-ds-background-neutral-subtle/20 shrink-0">
              <div className="flex items-center gap-3 mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ds-background-success-bold text-ds-text-inverse font-bold text-sm shadow-sm">
                  <DoorOpen className="h-5 w-5" />
                </div>
                <div className="min-w-0 text-left">
                  <h2 className="text-ds-text text-base font-black uppercase tracking-tight truncate leading-tight">
                    {gate.name}
                  </h2>
                  <p className="text-xs text-ds-text-subtle truncate">
                    {gate.location || 'Building A, North Wing'}
                  </p>
                </div>
                <div className="flex-1" />
                <Button
                  variant="subtle"
                  size="icon"
                  className="rounded-full h-8 w-8 hover:bg-ds-background-neutral transition-colors shrink-0"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant={
                    gate.status === 'COMMISSIONED' ? 'success' : 'subtle'
                  }
                  className="font-bold uppercase text-[9px] h-5 px-1.5 tracking-wider"
                >
                  {gate.status === 'COMMISSIONED' ? 'COMMISSIONED' : 'OFFLINE'}
                </Badge>
                <div className="flex items-center gap-1.5 ltr:ml-2 rtl:mr-2">
                  <ShieldAlert className="h-3 w-3 text-ds-text-subtle" />
                  <span className="text-[10px] font-bold text-ds-text-subtle uppercase tracking-tighter">
                    HOST: {gate.id.split('-')[0].toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <Tabs defaultValue="overview" className="w-full">
                <div className="px-8 border-b border-ds-border bg-ds-background-default sticky top-0 z-10">
                  <TabsList className="h-14 bg-transparent p-0 gap-8">
                    <TabsTrigger
                      value="overview"
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-ds-background-brand-bold data-[state=active]:bg-transparent px-0 font-bold uppercase text-[10px] tracking-widest transition-all"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="settings"
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-ds-background-brand-bold data-[state=active]:bg-transparent px-0 font-bold uppercase text-[10px] tracking-widest transition-all"
                    >
                      Config
                    </TabsTrigger>
                    <TabsTrigger
                      value="scans"
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-ds-background-brand-bold data-[state=active]:bg-transparent px-0 font-bold uppercase text-[10px] tracking-widest transition-all"
                    >
                      Scan Logs
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="p-8 space-y-8 m-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-ds-background-neutral-subtle rounded-2xl p-6 border border-ds-border flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtlest">
                        Placement
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="h-4 w-4 text-ds-text-brand" />
                        <span className="font-bold text-ds-text">
                          {gate.location || 'Not Defined'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-ds-background-neutral-subtle rounded-2xl p-6 border border-ds-border flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtlest">
                        Project Shell
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <FolderOpen className="h-4 w-4 text-ds-text-brand" />
                        <span className="font-bold text-ds-text truncate max-w-[120px]">
                          {gate.project.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtlest border-b border-ds-border pb-3">
                      Operational Activity
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-ds-border bg-ds-background-default hover:border-ds-background-selected transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-ds-background-neutral text-ds-text-subtle">
                            <ScanLine className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-ds-text">
                              Total Valid Scans
                            </p>
                            <p className="text-xs text-ds-text-subtle">
                              Aggregated throughput ever
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-black text-ds-text tabular-nums">
                          {gate.scans.total}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl border border-ds-border bg-ds-background-default hover:border-ds-background-selected transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                            <ScanLine className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-ds-text">
                              Throughput (24h)
                            </p>
                            <p className="text-xs text-ds-text-subtle">
                              Recent entrance activity
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-black text-emerald-600 tabular-nums">
                          {gate.scans.last24h}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtlest border-b border-ds-border pb-3">
                      Maintenance Zone
                    </h4>
                    <div className="flex gap-4">
                      {gate.status === 'COMMISSIONED' ? (
                        <Button
                          variant="destructive"
                          onClick={handleArchive}
                          className="flex-1 bg-ds-background-danger-bold hover:bg-ds-background-danger-bold/90 text-ds-text-inverse font-bold uppercase text-[10px] tracking-widest h-12 rounded-xl"
                        >
                          <Trash2 className="ltr:mr-2 rtl:ml-2 h-4 w-4" />{' '}
                          Decommission Gate
                        </Button>
                      ) : (
                        <Button
                          onClick={handleRestore}
                          className="flex-1 bg-ds-background-brand-bold hover:bg-ds-background-brand-bold/90 text-ds-text-inverse font-bold uppercase text-[10px] tracking-widest h-12 rounded-xl"
                        >
                          <RotateCcw className="ltr:mr-2 rtl:ml-2 h-4 w-4" />{' '}
                          Re-commission Gate
                        </Button>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="settings"
                  className="p-8 m-0 flex flex-col items-center justify-center h-64 opacity-40"
                >
                  <Settings className="h-12 w-12 mb-4 text-ds-text-subtlest" />
                  <p className="font-bold uppercase tracking-widest text-[10px]">
                    Hardware Config Coming Soon
                  </p>
                </TabsContent>

                <TabsContent
                  value="scans"
                  className="p-8 m-0 flex flex-col items-center justify-center h-64 opacity-40"
                >
                  <ShieldAlert className="h-12 w-12 mb-4 text-ds-text-subtlest" />
                  <p className="font-bold uppercase tracking-widest text-[10px]">
                    Real-time Logs Coming Soon
                  </p>
                </TabsContent>
              </Tabs>
            </div>

            <div className="p-8 border-t border-ds-border bg-ds-background-neutral-subtle/50 shrink-0">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ds-text-subtlest">
                <Calendar className="h-3 w-3" />
                Last Hardware Sync on{' '}
                {new Date(gate.createdAt).toLocaleDateString()}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-ds-text-subtle">No gate unit found.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
