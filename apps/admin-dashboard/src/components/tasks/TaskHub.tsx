'use client';

import * as React from 'react';
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Button,
  Input,
  Separator,
  cn
} from '@gate-access/ui';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  List, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  User as UserIcon,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BLOCKED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  department: string;
  dueDate: string | null;
  assigneeName?: string;
  linkedType?: string | null;
}

interface TaskHubProps {
  initialTasks: Task[];
  department: string;
  translations: any;
  organizationId: string;
  boardId: string;
}

/**
 * Task Hub Command Center
 * 
 * A high-performance, multi-view task manager with AI-driven planning
 * and departmental scoping.
 */
export function TaskHub({ initialTasks, department, translations, organizationId, boardId }: TaskHubProps) {
  const [tasks, setTasks] = useState(tasksByStatus(initialTasks));
  const [activeTab, setActiveTab] = useState('kanban');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  function tasksByStatus(taskList: Task[]) {
    return {
      TODO: taskList.filter(t => t.status === 'TODO'),
      IN_PROGRESS: taskList.filter(t => t.status === 'IN_PROGRESS'),
      IN_REVIEW: taskList.filter(t => t.status === 'IN_REVIEW'),
      DONE: taskList.filter(t => t.status === 'DONE'),
    };
  }

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    
    try {
      const res = await fetch('/api/tasks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: aiPrompt, 
          organizationId, 
          boardId 
        }),
      });

      if (!res.ok) throw new Error('AI generation failed');
      
      const result = await res.json();
      toast.success(`Generated ${result.tasks.length} tasks for this initiative.`);
      
      // Update local state (simplified)
      setTasks(prev => ({
        ...prev,
        TODO: [...prev.TODO, ...result.tasks]
      }));
      setAiPrompt('');
    } catch (err) {
      toast.error('Failed to generate tasks. Please check your API configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'URGENT': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'HIGH': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'MEDIUM': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-ds-background-neutral-subtle text-ds-text-subtle border-ds-border/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Task Drafter Header */}
      <Card className="border-ds-border-brand/30 bg-ds-background-neutral-subtle/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Sparkles className="h-32 w-32 text-ds-text-brand" />
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-ds-text-brand" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtle">Agentic Task Planning</span>
            </div>
            <div className="flex gap-3">
              <Input 
                placeholder="e.g., Plan the Al Rimal compound launch event including marketing, security setup, and staff onboarding..." 
                className="flex-1 bg-ds-background-default border-ds-border/50 focus:border-ds-border-brand/50 h-12"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                disabled={isGenerating}
              />
              <Button 
                onClick={handleAiGenerate}
                disabled={isGenerating || !aiPrompt.trim()}
                className="h-12 px-6 bg-ds-background-brand-bold hover:bg-ds-background-brand-bold-hover font-bold uppercase tracking-widest gap-2 shrink-0"
              >
                {isGenerating ? <Sparkles className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Generate Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-black tracking-tight uppercase">{department} Board</h1>
          <div className="flex bg-ds-background-neutral-subtle/50 p-1 rounded-lg border border-ds-border/20">
            <Button variant="ghost" size="sm" className="h-8 gap-2 px-3 font-bold text-[10px] tracking-widest">
              <Filter className="h-3 w-3" /> Filters
            </Button>
            <Separator orientation="vertical" className="mx-1 h-8" />
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-ds-text-subtle" />
              <Input placeholder="Search tasks..." className="h-8 pl-8 text-[11px] bg-transparent border-none w-48 focus-visible:ring-0" />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-ds-background-neutral-subtle/30 p-1 rounded-xl border border-ds-border/30">
          <TabsList className="bg-transparent border-none">
            <TabsTrigger value="kanban" className="data-[state=active]:bg-ds-background-default data-[state=active]:shadow-sm gap-2 font-bold text-[10px] tracking-widest uppercase">
              <LayoutDashboard className="h-3 w-3" /> Kanban
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-ds-background-default data-[state=active]:shadow-sm gap-2 font-bold text-[10px] tracking-widest uppercase">
              <CalendarIcon className="h-3 w-3" /> Calendar
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-ds-background-default data-[state=active]:shadow-sm gap-2 font-bold text-[10px] tracking-widest uppercase">
              <List className="h-3 w-3" /> List
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[600px]">
        {(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'] as const).map(status => (
          <div key={status} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">{status}</span>
                <Badge variant="outline" className="h-5 px-1.5 text-[9px] font-bold bg-ds-background-neutral-subtle/50 text-ds-text-subtle border-none">
                  {(tasks as any)[status].length}
                </Badge>
              </div>
              <Button size="icon" variant="ghost" className="h-6 w-6 opacity-40 hover:opacity-100">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex-1 rounded-2xl bg-ds-background-neutral-subtle/10 border border-ds-border/10 p-3 space-y-3">
              {(tasks as any)[status].map((task: Task) => (
                <Card key={task.id} className="group border-ds-border/40 hover:border-ds-border-brand/40 transition-all hover:shadow-md hover:shadow-brand/5 cursor-pointer bg-ds-background-default">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-bold leading-snug group-hover:text-ds-text-brand transition-colors line-clamp-2">
                        {task.title}
                      </h3>
                      <Badge variant="outline" className={cn("shrink-0 text-[8px] font-black tracking-tighter uppercase px-1.5", getPriorityColor(task.priority))}>
                        {task.priority}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <div className="flex items-center gap-1 text-[10px] text-ds-text-subtle font-medium">
                        <Clock className="h-3 w-3" />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'}
                      </div>
                      <Separator orientation="vertical" className="h-3" />
                      <div className="flex items-center gap-1 text-[10px] text-ds-text-subtle font-medium">
                        <UserIcon className="h-3 w-3" />
                        {task.assigneeName ?? 'Unassigned'}
                      </div>
                      {task.linkedType && (
                        <>
                          <Separator orientation="vertical" className="h-3" />
                          <Badge variant="outline" className="text-[7px] font-black tracking-widest bg-ds-background-brand-subtle/30 text-ds-text-brand border-none">
                            LINKED: {task.linkedType}
                          </Badge>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
