'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Columns3,
  Sparkles,
  MoreHorizontal,
  Clock,
  AlertCircle,
  User,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Link2,
} from 'lucide-react';
import {
  Button,
  Input,
  Card,
  CardContent,
  Badge,
  Avatar,
  cn,
  Tabs,
  TabsList,
  TabsTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Skeleton,
} from '@gateflow/ui';
import { useTranslation } from 'react-i18next';
import { useOrganization } from '@/providers/organization-provider';
import { toast } from 'sonner';

/**
 * Task Hub Component
 * The central Operating System for GateFlow departments.
 * Features: AI Task Drafter, Departmental Kanban, and Cross-linking.
 */
interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  department: string;
  dueDate?: string;
  linkedType?: string;
  linkedId?: string;
}

export function TaskHub() {
  const { orgId } = useOrganization();
  const [activeBoard, setActiveBoard] = React.useState<string>('SALES');
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [draftPrompt, setDraftPrompt] = React.useState('');
  const [isDrafting, setIsDrafting] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  React.useEffect(() => {
    async function fetchTasks() {
      if (!orgId) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/tasks?orgId=${orgId}&department=${activeBoard}`
        );
        if (response.ok) {
          const data = await response.json();
          setTasks(data.tasks || []);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTasks();
  }, [orgId, activeBoard]);

  const handleAiDraft = async () => {
    if (!draftPrompt) return;
    setIsDrafting(true);
    toast.promise(
      fetch('/api/tasks/generate', {
        method: 'POST',
        body: JSON.stringify({
          prompt: draftPrompt,
          orgId,
          department: activeBoard,
        }),
      }).then(async (res) => {
        if (!res.ok) throw new Error('Failed to generate tasks');
        const data = await res.json();
        setTasks((prev) => [...data.tasks, ...prev]);
        setDraftPrompt('');
        return data;
      }),
      {
        loading: 'AI is drafting your task list...',
        success: 'Tasks generated and added to board!',
        error: 'AI generation failed.',
      }
    );
    setIsDrafting(false);
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
        );
        toast.success(`Task moved to ${newStatus}`);
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const columns = [
    { id: 'TODO', label: 'To Do', color: 'bg-ds-background-neutral' },
    {
      id: 'IN_PROGRESS',
      label: 'In Progress',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      id: 'IN_REVIEW',
      label: 'In Review',
      color: 'bg-amber-500/10 text-amber-500',
    },
    { id: 'DONE', label: 'Done', color: 'bg-emerald-500/10 text-emerald-500' },
  ];

  return (
    <div className="flex flex-col gap-6 p-1 animate-in fade-in duration-700">
      {/* AI Task Drafter Inline */}
      <Card className="border-primary/20 bg-primary/5 shadow-inner overflow-hidden border-dashed">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="bg-ds-background-brand-bold p-2 rounded-xl h-10 w-10 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5 text-ds-icon-inverse" />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-black uppercase tracking-tight text-ds-text">
                AI Task Drafter
              </h3>
              <p className="text-[10px] font-bold text-ds-text-subtler uppercase tracking-wider">
                Turn natural language into a structured project roadmap
              </p>
            </div>
            <div className="flex w-full md:w-2/3 gap-2">
              <Input
                placeholder="e.g., Plan the Al Rimal compound launch with 8 tasks..."
                className="bg-background/50 border-primary/20 font-bold text-xs h-10 ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary/30"
                value={draftPrompt}
                onChange={(e) => setDraftPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiDraft()}
              />
              <Button
                onClick={handleAiDraft}
                disabled={isDrafting || !draftPrompt}
                className="h-10 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] px-6 gap-2"
              >
                {isDrafting ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Draft
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toolbar & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Tabs
          value={activeBoard}
          onValueChange={setActiveBoard}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-muted/50 border border-border/50 p-1 h-11">
            {['SALES', 'MARKETING', 'DEV', 'SUPPORT'].map((dept) => (
              <TabsTrigger
                key={dept}
                value={dept}
                className="px-4 text-[10px] font-black uppercase tracking-widest gap-2"
              >
                {dept}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ds-text-subtler" />
            <Input
              placeholder="Search tasks..."
              className="pl-9 h-9 text-xs font-bold border-border/50 bg-muted/20"
            />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button className="h-9 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] gap-2 px-4 shrink-0">
            <Plus className="h-4 w-4" /> New Task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4 custom-scrollbar min-h-[600px]">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col gap-4 min-w-[280px]">
            <div className="flex items-center justify-between px-2">
              <h4
                className={cn(
                  'text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2',
                  col.color
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {col.label} ({tasks.filter((t) => t.status === col.id).length})
              </h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-ds-text-subtler"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-3 h-full rounded-2xl bg-muted/20 p-2 border border-border/30">
              {isLoading ? (
                Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                  ))
              ) : (
                <AnimatePresence>
                  {tasks
                    .filter((t) => t.status === col.id)
                    .map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -2 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                        onClick={() => setSelectedTask(task)}
                      >
                        <Card className="border-border/50 bg-card/60 backdrop-blur-sm cursor-pointer hover:border-primary/40 transition-colors shadow-sm group">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex flex-col gap-1 min-w-0">
                                <h5 className="text-[13px] font-black leading-tight text-ds-text truncate group-hover:text-primary transition-colors uppercase tracking-tight">
                                  {task.title}
                                </h5>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      'text-[8px] font-black uppercase tracking-widest h-4 ring-0 border-0 bg-muted/50',
                                      task.priority === 'URGENT'
                                        ? 'text-rose-500 bg-rose-500/10'
                                        : task.priority === 'HIGH'
                                          ? 'text-amber-500 bg-amber-500/10'
                                          : 'text-ds-text-subtler'
                                    )}
                                  >
                                    {task.priority}
                                  </Badge>
                                  {task.linkedType && (
                                    <Badge className="bg-primary/5 text-primary border-primary/20 text-[8px] font-black h-4 gap-1">
                                      <Link2 className="h-2 w-2" />
                                      {task.linkedType}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Avatar className="h-6 w-6 border-none ring-1 ring-border shadow-sm">
                                <User className="h-3 w-3" />
                              </Avatar>
                            </div>

                            <p className="text-[11px] text-ds-text-subtle font-bold line-clamp-2 leading-relaxed italic opacity-80">
                              {task.description || 'No description provided.'}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-border/30">
                              <div className="flex items-center gap-1.5 text-[10px] font-black text-ds-text-subtler uppercase tracking-tight">
                                <Clock className="h-3 w-3" />
                                {task.dueDate
                                  ? new Date(task.dueDate).toLocaleDateString()
                                  : 'No Due Date'}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-ds-text-brand hover:bg-ds-background-brand-subtle rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextCol =
                                    columns[
                                      (columns.findIndex(
                                        (c) => c.id === task.status
                                      ) +
                                        1) %
                                        columns.length
                                    ];
                                  updateTaskStatus(task.id, nextCol.id);
                                }}
                              >
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </AnimatePresence>
              )}

              {!isLoading &&
                tasks.filter((t) => t.status === col.id).length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-20 filter grayscale">
                    <Columns3 className="h-8 w-8 mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      Empty
                    </span>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Details & Linked Entity Sheet */}
      <Sheet open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <SheetContent
          side="right"
          className="sm:max-w-md bg-card/95 backdrop-blur-xl border-l border-border/50 p-0"
        >
          {selectedTask && (
            <div className="flex flex-col h-full bg-noise">
              <SheetHeader className="p-6 border-b border-border/30 space-y-4">
                <div className="flex justify-between items-start">
                  <Badge className="bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[9px]">
                    {selectedTask.department}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <SheetTitle className="text-2xl font-black uppercase tracking-tight leading-tight text-ds-text">
                  {selectedTask.title}
                </SheetTitle>
                <div className="flex items-center gap-4 text-xs font-bold text-ds-text-subtle">
                  <div className="flex items-center gap-1.5 uppercase tracking-wide">
                    <Clock className="h-4 w-4" />{' '}
                    {selectedTask.dueDate
                      ? new Date(selectedTask.dueDate).toLocaleDateString()
                      : 'Set Due Date'}
                  </div>
                  <div className="flex items-center gap-1.5 uppercase tracking-wide">
                    <AlertCircle className="h-4 w-4" /> {selectedTask.priority}
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Metadata Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-ds-text-subtler">
                    Description
                  </h4>
                  <p className="text-sm font-bold leading-relaxed text-ds-text opacity-90 whitespace-pre-wrap">
                    {selectedTask.description ||
                      'No detailed description available for this task.'}
                  </p>
                </div>

                {/* Linked Entity Section (Phase 3 Requirement) */}
                {selectedTask.linkedType && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-ds-text-subtler flex items-center gap-2">
                      <Link2 className="h-4 w-4" /> Linked{' '}
                      {selectedTask.linkedType}
                    </h4>
                    <Card className="border-primary/20 bg-primary/5 shadow-inner p-4 space-y-3 cursor-pointer hover:bg-primary/10 transition-colors">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-black uppercase tracking-tight text-primary">
                          Identity Verified Lead
                        </span>
                        <ChevronRight className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-[10px] font-bold text-ds-text-subtle">
                        Linked ID: {selectedTask.linkedId}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[9px] font-black uppercase tracking-widest text-primary p-0 h-auto"
                      >
                        Open in CRM Hub
                      </Button>
                    </Card>
                  </div>
                )}

                {/* Bot Activity / Audit Log */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-ds-text-subtler">
                    Audit History
                  </h4>
                  <div className="space-y-3 border-l border-border/50 pl-4">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-ds-background-brand-bold border-2 border-background" />
                      <p className="text-[11px] font-black text-ds-text uppercase tracking-tight">
                        AI Generated
                      </p>
                      <p className="text-[10px] font-bold text-ds-text-subtler">
                        2 hours ago
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-muted border-2 border-background" />
                      <p className="text-[11px] font-black text-ds-text uppercase tracking-tight opacity-50">
                        Assigned by Super Admin
                      </p>
                      <p className="text-[10px] font-bold text-ds-text-subtler italic opacity-50">
                        Awaiting status update...
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border/30 bg-muted/20 flex gap-3">
                <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] h-10 gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Mark as Done
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-rose-500/20 text-rose-500 hover:bg-rose-500/5 font-black uppercase tracking-widest text-[10px] h-10 gap-2"
                >
                  <XCircle className="h-4 w-4" /> Blocked
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
