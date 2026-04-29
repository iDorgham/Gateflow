'use client';

import * as React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  Badge,
  Button,
  Separator,
  ScrollArea
} from '@gate-access/ui';
import { 
  Link2, 
  ExternalLink, 
  User, 
  Building, 
  Mail, 
  Phone, 
  Calendar,
  Tag,
  MessageSquare
} from 'lucide-react';

interface TaskPanelProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskPanel({ task, isOpen, onClose }: TaskPanelProps) {
  if (!task) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md flex flex-col gap-0 p-0">
        <SheetHeader className="p-6 border-b bg-gray-50/50">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] tracking-wider uppercase">
                  {task.department}
                </Badge>
                <Badge variant="outline" className="text-[10px] tracking-wider uppercase bg-blue-50 text-blue-700 border-blue-100">
                  {task.status.replace('_', ' ')}
                </Badge>
              </div>
              <SheetTitle className="text-xl font-bold mt-2">{task.title}</SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                Description
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {task.description || 'No description provided.'}
              </p>
            </div>

            {task.linkedId && (
              <>
                <Separator />
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Link2 className="w-4 h-4" />
                    Linked {task.linkedType?.replace('_', ' ')}
                  </h4>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center text-blue-600">
                        {task.linkedType === 'LEAD' ? <User className="w-5 h-5" /> : <Building className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {task.linkedType === 'LEAD' ? 'Lead Details' : 'Related Entity'}
                        </div>
                        <div className="text-xs text-gray-500">ID: {task.linkedId}</div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full gap-2 bg-white" asChild>
                      <a href={`/crm?selected=${task.linkedId}`}>
                        <ExternalLink className="w-3.5 h-3.5" />
                        View in CRM
                      </a>
                    </Button>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Priority</span>
                <Badge variant="outline" className="w-fit">{task.priority}</Badge>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Created</span>
                <span className="text-sm text-gray-600 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-gray-50/50 flex gap-2">
          <Button className="flex-1" variant="outline">Edit Task</Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700">Mark as Done</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
