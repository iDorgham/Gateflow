'use client';

import * as React from 'react';
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Badge, 
  Button, 
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ScrollArea,
  cn,
} from '@gate-access/ui';
import { 
  ClipboardList, 
  Kanban, 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  LayoutList,
  ArrowRight,
  User,
  Clock,
  MoreVertical,
  CheckCircle2,
  Circle,
  AlertCircle,
  Bot,
  BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TASK_STATUSES = [
  { id: 'TODO', label: 'To Do', icon: Circle, color: 'text-gray-500' },
  { id: 'IN_PROGRESS', label: 'In Progress', icon: Clock, color: 'text-blue-500' },
  { id: 'IN_REVIEW', label: 'In Review', icon: AlertCircle, color: 'text-amber-500' },
  { id: 'DONE', label: 'Done', icon: CheckCircle2, color: 'text-green-500' },
  { id: 'BLOCKED', label: 'Blocked', icon: AlertCircle, color: 'text-red-500' },
];

const DEPARTMENTS = [
  { id: 'SALES', label: 'Sales', color: 'bg-blue-100 text-blue-700' },
  { id: 'MARKETING', label: 'Marketing', color: 'bg-purple-100 text-purple-700' },
  { id: 'DEV', label: 'Dev', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'SUPPORT', label: 'Support', color: 'bg-orange-100 text-orange-700' },
];

import { TaskPanel } from './TaskPanel';

export function TaskManagerClient({ initialBoards, orgId }: { initialBoards: any[], orgId: string }) {
  const [activeTab, setActiveTab] = useState('kanban');
  const [activeBoardId, setActiveBoardId] = useState(initialBoards[0]?.id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const activeBoard = initialBoards.find(b => b.id === activeBoardId) || initialBoards[0];
  const tasks = activeBoard?.tasks || [];
  const selectedTask = tasks.find((t: any) => t.id === selectedTaskId) || null;

  const handleGenerateTasks = async () => {
    const prompt = window.prompt("Enter a project description for AI task generation:");
    if (!prompt) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/tasks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          organizationId: orgId,
          boardId: activeBoardId
        })
      });
      const data = await res.json();
      if (data.success) {
        window.location.reload(); // Refresh to see new tasks
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-hidden bg-gray-50/50">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            AI Task Hub
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage departmental workflows and AI automation.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2 border-dashed border-blue-200 bg-blue-50/50 text-blue-600 hover:bg-blue-50"
            onClick={handleGenerateTasks}
            disabled={isGenerating}
          >
            <BrainCircuit className={cn("w-4 h-4", isGenerating && "animate-spin")} />
            AI Generate Tasks
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white p-2 rounded-xl border shadow-sm">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {initialBoards.map(board => (
            <button
              key={board.id}
              onClick={() => setActiveBoardId(board.id)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                activeBoardId === board.id 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              {board.name}
            </button>
          ))}
        </div>
        <div className="h-6 w-px bg-gray-200 mx-2" />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="bg-transparent gap-1">
            <TabsTrigger value="kanban" className="data-[state=active]:bg-gray-100 gap-2">
              <Kanban className="w-4 h-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-gray-100 gap-2">
              <LayoutList className="w-4 h-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-gray-100 gap-2">
              <Calendar className="w-4 h-4" />
              Calendar
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'kanban' && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex gap-4 overflow-x-auto pb-4"
            >
              {TASK_STATUSES.map(status => (
                <div key={status.id} className="flex-shrink-0 w-80 flex flex-col gap-3">
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2">
                      <status.icon className={cn("w-4 h-4", status.color)} />
                      <span className="font-semibold text-gray-700 text-sm uppercase tracking-wider">{status.label}</span>
                      <Badge variant="secondary" className="rounded-full px-2 py-0 h-5">
                        {tasks.filter((t: any) => t.status === status.id).length}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-3 p-1">
                      {tasks
                        .filter((t: any) => t.status === status.id)
                        .map((task: any) => (
                          <div key={task.id} onClick={() => setSelectedTaskId(task.id)}>
                            <TaskCard task={task} />
                          </div>
                        ))
                      }
                    </div>
                  </ScrollArea>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'list' && (
             <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl border shadow-sm overflow-hidden"
            >
               <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                   <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                     <input 
                       className="pl-9 pr-4 py-1.5 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                       placeholder="Search tasks..."
                     />
                   </div>
                   <Button variant="outline" size="sm" className="gap-2">
                     <Filter className="w-4 h-4" />
                     Filters
                   </Button>
                 </div>
               </div>
               <div className="overflow-auto max-h-[calc(100vh-350px)]">
                 <table className="w-full text-left border-collapse">
                   <thead className="bg-gray-50 border-b sticky top-0">
                     <tr>
                       <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Task</th>
                       <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                       <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                       <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignee</th>
                       <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                       <th className="p-4"></th>
                     </tr>
                   </thead>
                   <tbody>
                     {tasks.map((task: any) => (
                       <tr key={task.id} 
                         onClick={() => setSelectedTaskId(task.id)}
                         className="border-b hover:bg-gray-50/80 transition-colors group cursor-pointer">
                         <td className="p-4">
                           <div className="flex flex-col">
                             <span className="font-medium text-gray-900">{task.title}</span>
                             <span className="text-xs text-gray-500 line-clamp-1">{task.description}</span>
                           </div>
                         </td>
                         <td className="p-4">
                            <Badge variant="outline" className="capitalize gap-1.5 border-blue-100 bg-blue-50 text-blue-700">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              {task.status.replace('_', ' ').toLowerCase()}
                            </Badge>
                         </td>
                         <td className="p-4">
                            <PriorityBadge priority={task.priority} />
                         </td>
                         <td className="p-4">
                           <div className="flex items-center gap-2">
                             <div className="w-7 h-7 rounded-full bg-gray-200 border flex items-center justify-center text-[10px] font-bold text-gray-600">
                               UN
                             </div>
                             <span className="text-sm text-gray-600">Unassigned</span>
                           </div>
                         </td>
                         <td className="p-4">
                           <span className="text-sm text-gray-500">No due date</span>
                         </td>
                         <td className="p-4 text-right">
                           <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8">
                             <ChevronRight className="w-4 h-4" />
                           </Button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full bg-white rounded-xl border shadow-sm p-8 flex flex-col items-center justify-center text-center gap-4"
            >
              <Calendar className="w-16 h-16 text-blue-100" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">MENA Region Calendar</h3>
                <p className="text-gray-500 mt-1 max-w-md">Optimized for Fri-Sat weekend schedules. This view is currently under construction.</p>
              </div>
              <Button variant="outline" onClick={() => setActiveTab('kanban')}>Back to Kanban</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <TaskPanel 
        task={selectedTask} 
        isOpen={!!selectedTaskId} 
        onClose={() => setSelectedTaskId(null)} 
      />
    </div>
  );
}

function TaskCard({ task }: { task: any }) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group border-l-4 border-l-blue-500 overflow-hidden">
      <CardContent className="p-3.5 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <h4 className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
            {task.title}
          </h4>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md opacity-0 group-hover:opacity-100">
            <MoreVertical className="w-3.5 h-3.5" />
          </Button>
        </div>
        
        {task.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          <PriorityBadge priority={task.priority} />
          {task.linkedType && (
            <Badge variant="outline" className="text-[10px] uppercase h-5 bg-gray-50">
              {task.linkedType.replace('_', ' ')}
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] text-gray-400">
              <User className="w-3 h-3" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {task.createdById === 'bot' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Bot className="w-4 h-4 text-purple-500" />
                  </TooltipTrigger>
                  <TooltipContent>AI Bot Generated Task</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    LOW: 'bg-gray-100 text-gray-600 border-gray-200',
    MEDIUM: 'bg-blue-50 text-blue-700 border-blue-100',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-100',
    URGENT: 'bg-red-50 text-red-700 border-red-100 animate-pulse',
  };

  return (
    <Badge variant="outline" className={cn("text-[10px] h-5", styles[priority])}>
      {priority}
    </Badge>
  );
}

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@gate-access/ui";
import { ChevronRight } from 'lucide-react';
