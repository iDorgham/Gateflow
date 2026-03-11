'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button, Input, Badge, cn } from '@gate-access/ui';
import { CheckSquare, Square, Plus, Trash2, Loader2, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
}

const STATUS_FILTERS: { label: string; value: TaskStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'To Do', value: 'TODO' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Done', value: 'DONE' },
];

const STATUS_BADGE: Record<TaskStatus, string> = {
  TODO: 'bg-muted text-muted-foreground border-border',
  IN_PROGRESS: 'bg-primary/10 text-primary border-primary/20',
  DONE: 'bg-success/10 text-success border-success/20',
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export function TasksPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [newTitle, setNewTitle] = useState('');
  const [isPending, startTransition] = useTransition();

  // Load tasks
  useEffect(() => {
    fetch('/api/tasks')
      .then((r) => r.json())
      .then((res: { success: boolean; data?: Task[] }) => {
        if (res.success && res.data) setTasks(res.data);
      })
      .catch(() => toast.error('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? tasks : tasks.filter((t) => t.status === filter);

  // Toggle task status (TODO ↔ DONE)
  const toggleTask = (task: Task) => {
    const nextStatus: TaskStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    // Optimistic update
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: nextStatus } : t));

    startTransition(async () => {
      const res = await csrfFetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        // Revert on failure
        setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: task.status } : t));
        toast.error('Failed to update task');
      }
    });
  };

  // Add task
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const title = newTitle.trim();
    setNewTitle('');

    startTransition(async () => {
      const res = await csrfFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ title }),
      });
      const data = (await res.json()) as { success: boolean; data?: Task; error?: string };
      if (data.success && data.data) {
        setTasks((prev) => [data.data!, ...prev]);
      } else {
        toast.error(data.error ?? 'Failed to add task');
        setNewTitle(title); // restore input
      }
    });
  };

  // Delete task
  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    startTransition(async () => {
      const res = await csrfFetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        toast.error('Failed to delete task');
        // Re-fetch to restore
        const r = await fetch('/api/tasks');
        const j = await r.json() as { success: boolean; data?: Task[] };
        if (j.success && j.data) setTasks(j.data);
      }
    });
  };

  return (
    <div className="flex h-full flex-col bg-card" aria-label="Tasks panel">

      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 bg-muted/20">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-xs font-black uppercase tracking-widest">Tasks</span>
          {tasks.filter((t) => t.status !== 'DONE').length > 0 && (
            <Badge variant="outline" className="text-[9px] font-black px-1.5 py-0 border-primary/20 bg-primary/10 text-primary">
              {tasks.filter((t) => t.status !== 'DONE').length} open
            </Badge>
          )}
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex shrink-0 gap-1 px-3 py-2 border-b border-border bg-muted/10">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              'rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest transition-all',
              filter === f.value
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:bg-muted/50 border border-transparent'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
              <ClipboardList className="h-6 w-6 text-muted-foreground/40" aria-hidden="true" />
            </div>
            <p className="text-sm font-bold text-foreground">
              {filter === 'ALL' ? 'No tasks yet' : `No ${STATUS_LABEL[filter as TaskStatus]} tasks`}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Add a task below to get started.
            </p>
          </div>
        ) : (
          filtered.map((task) => (
            <div
              key={task.id}
              className={cn(
                'group flex items-start gap-2.5 rounded-xl border p-3 transition-all min-h-[44px]',
                task.status === 'DONE'
                  ? 'border-border/50 bg-muted/20 opacity-60'
                  : 'border-border bg-card hover:border-primary/20 hover:bg-primary/5'
              )}
            >
              {/* Checkbox toggle */}
              <button
                type="button"
                onClick={() => toggleTask(task)}
                disabled={isPending}
                className="shrink-0 mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                aria-label={task.status === 'DONE' ? 'Mark as to do' : 'Mark as done'}
              >
                {task.status === 'DONE'
                  ? <CheckSquare className="h-4 w-4 text-success" />
                  : <Square className="h-4 w-4" />
                }
              </button>

              {/* Title + meta */}
              <div className="flex-1 min-w-0 space-y-1">
                <p className={cn('text-xs font-bold leading-snug', task.status === 'DONE' && 'line-through text-muted-foreground')}>
                  {task.title}
                </p>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className={cn('text-[9px] font-black px-1.5 py-0', STATUS_BADGE[task.status])}>
                    {STATUS_LABEL[task.status]}
                  </Badge>
                  {task.dueDate && (
                    <span className="text-[10px] text-muted-foreground">
                      Due {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleDelete(task.id)}
                disabled={isPending}
                className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                aria-label="Delete task"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add task input */}
      <form
        onSubmit={handleAdd}
        className="shrink-0 border-t border-border p-3 bg-muted/10"
      >
        <div className="flex gap-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a task… press Enter"
            className="h-9 rounded-xl text-xs flex-1"
            disabled={isPending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isPending || !newTitle.trim()}
            className="h-9 w-9 rounded-xl shrink-0"
            aria-label="Add task"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
