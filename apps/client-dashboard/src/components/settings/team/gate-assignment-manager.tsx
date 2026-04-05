'use client';

import { useState, useTransition } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  cn,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Label,
} from '@gateflow/ui';
import {
  ShieldAlert,
  Trash2,
  Search,
  Clock,
  MapPin,
  UserPlus,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  getGateAssignments,
  assignGates,
  unassignGate,
  GateAssignment,
  LiteGate,
  TeamMember,
} from '../../../app/[locale]/dashboard/settings/team/actions';

interface GateAssignmentManagerProps {
  assignments: GateAssignment[];
  users: TeamMember[];
  gates: LiteGate[];
}

export function GateAssignmentManager({
  assignments: initialAssignments,
  users,
  gates,
}: GateAssignmentManagerProps) {
  const { t } = useTranslation('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const [assignments, setAssignments] = useState(initialAssignments);

  // Sheet state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedGateIds, setSelectedGateIds] = useState<string[]>([]);
  const [shiftStart, setShiftStart] = useState('');
  const [shiftEnd, setShiftEnd] = useState('');

  const filteredAssignments = assignments.filter(
    (a) =>
      a.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.gate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUnassign = async (id: string) => {
    if (
      !confirm(
        t('settings.team.unassignConfirm', 'Remove this gate assignment?')
      )
    )
      return;

    startTransition(async () => {
      const res = await unassignGate(id);
      if (res.success) {
        toast.success(t('settings.team.unassigned', 'Assignment removed'));
        // Refresh list
        const refreshed = await getGateAssignments();
        if (refreshed.success) setAssignments(refreshed.data || []);
      } else {
        toast.error(res.error || t('common.error', 'An error occurred'));
      }
    });
  };

  const handleAssign = async () => {
    if (!selectedUserId || selectedGateIds.length === 0) {
      toast.error('Please select a user and at least one gate.');
      return;
    }

    startTransition(async () => {
      const res = await assignGates(
        selectedUserId,
        selectedGateIds,
        shiftStart,
        shiftEnd
      );
      if (res.success) {
        toast.success('Gates assigned successfully');
        setIsOpen(false);
        // Reset form
        setSelectedUserId('');
        setSelectedGateIds([]);
        setShiftStart('');
        setShiftEnd('');
        // Refresh list
        const refreshed = await getGateAssignments();
        if (refreshed.success) setAssignments(refreshed.data || []);
      } else {
        toast.error(res.error || 'Failed to assign gates');
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t(
              'settings.team.searchAssignments',
              'Search assignments...'
            )}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <Button
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto gap-2 rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[11px]"
          >
            <UserPlus className="h-4 w-4" />
            {t('settings.team.assignGates', 'Assign Gates')}
          </Button>
          <SheetContent className="w-full sm:max-w-md bg-background border-l border-primary/10 shadow-2xl overflow-y-auto">
            <SheetHeader className="pb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <ShieldAlert className="h-5 w-5 text-primary" />
              </div>
              <SheetTitle className="text-xl font-black uppercase tracking-tight">
                Assign Gates
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Authorize a team member to access specific gates and define
                their shift schedule.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 py-6 border-t border-primary/5">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
                  Select Member
                </Label>
                <Select
                  value={selectedUserId}
                  onValueChange={setSelectedUserId}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-primary/5 focus:ring-primary/20">
                    <SelectValue placeholder="Choose a member..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl p-1 border-primary/10 shadow-2xl">
                    {users.map((user) => (
                      <SelectItem
                        key={user.id}
                        value={user.id}
                        className="rounded-lg py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatarUrl || undefined} />
                            <AvatarFallback className="text-[8px] font-black">
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-sm">{user.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
                  Gates
                </Label>
                <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto p-2 border border-primary/5 rounded-xl bg-muted/20">
                  {gates.map((gate) => (
                    <div
                      key={gate.id}
                      className={cn(
                        'flex items-center space-x-3 p-3 rounded-xl transition-all cursor-pointer border border-transparent',
                        selectedGateIds.includes(gate.id)
                          ? 'bg-primary/5 border-primary/10'
                          : 'hover:bg-muted/50'
                      )}
                      onClick={() => {
                        setSelectedGateIds((prev) =>
                          prev.includes(gate.id)
                            ? prev.filter((id) => id !== gate.id)
                            : [...prev, gate.id]
                        );
                      }}
                    >
                      <Checkbox
                        checked={selectedGateIds.includes(gate.id)}
                        className="rounded-md h-5 w-5"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold leading-none">
                          {gate.name}
                        </span>
                        {gate.location && (
                          <span className="text-[10px] text-muted-foreground">
                            {gate.location}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
                    Shift Start
                  </Label>
                  <Input
                    type="time"
                    value={shiftStart}
                    onChange={(e) => setShiftStart(e.target.value)}
                    className="h-12 rounded-xl bg-muted/30 border-primary/5 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
                    Shift End
                  </Label>
                  <Input
                    type="time"
                    value={shiftEnd}
                    onChange={(e) => setShiftEnd(e.target.value)}
                    className="h-12 rounded-xl bg-muted/30 border-primary/5 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <SheetFooter className="pt-6 border-t border-primary/5">
              <Button
                onClick={handleAssign}
                disabled={
                  isPending || !selectedUserId || selectedGateIds.length === 0
                }
                className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs gap-2"
              >
                {isPending ? 'Assigning...' : 'Assign Gates'}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-black uppercase tracking-widest text-[10px] h-11">
                {t('settings.team.member', 'Member')}
              </TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] h-11">
                {t('settings.team.authorizedGates', 'Authorized Gates')}
              </TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] h-11 text-center">
                {t('settings.team.shift', 'Shift')}
              </TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] h-11 text-right">
                {t('common.actions', 'Actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssignments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-40 text-center text-muted-foreground italic bg-muted/5"
                >
                  <div className="flex flex-col items-center gap-2">
                    <ShieldAlert className="h-6 w-6 opacity-20" />
                    <span className="text-sm">
                      {t(
                        'settings.team.noAssignments',
                        'No gate assignments active.'
                      )}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAssignments.map((a) => (
                <TableRow
                  key={a.id}
                  className="group hover:bg-muted/30 transition-colors border-b border-primary/5 last:border-0"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={a.user.avatarUrl || undefined} />
                        <AvatarFallback className="font-bold bg-primary/10 text-primary text-xs">
                          {a.user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm">
                          {a.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {a.user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <MapPin className="h-3.5 w-3.5 text-orange-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">
                          {a.gate.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                          {a.gate.location || 'Global'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {a.shiftStart || a.shiftEnd ? (
                      <Badge
                        variant="outline"
                        className="font-black uppercase tracking-widest text-[9px] gap-1 px-2 py-0.5 border-primary/20 bg-primary/5 text-primary"
                      >
                        <Clock className="h-3 w-3" />
                        {a.shiftStart || '??'} — {a.shiftEnd || '??'}
                      </Badge>
                    ) : (
                      <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase opacity-40">
                        24/7 Access
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      onClick={() => handleUnassign(a.id)}
                      className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
