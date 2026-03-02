'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@gate-access/ui';
import { MoreHorizontal, Pencil, Trash2, Layers, DoorOpen, LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProjectSheet } from './project-sheet';
import { deleteProject } from '../../app/[locale]/dashboard/settings/projects/actions';
import { toast } from 'sonner';

interface Project {
  id: string;
  name: string;
  description: string | null;
  gateMode: string;
  _count: {
    gates: number;
    qrCodes: number;
    units: number;
  };
}

interface ProjectTableProps {
  projects: Project[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  const { t } = useTranslation('dashboard');
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm(t('projects.deleteConfirm', 'Are you sure you want to delete this project?'))) return;
    
    const result = await deleteProject(id);
    if (result.success) {
      toast.success(t('projects.deleted', 'Project deleted successfully'));
    } else {
      toast.error(result.error || t('projects.deleteError', 'Failed to delete project'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          {t('projects.title', 'Active Projects')}
        </h3>
        <ProjectSheet mode="create">
          <Button size="sm" className="gap-2">
            <Layers className="h-4 w-4" />
            {t('projects.add', 'Add Project')}
          </Button>
        </ProjectSheet>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t('projects.name', 'Project Name')}</TableHead>
              <TableHead>{t('projects.mode', 'Gate Mode')}</TableHead>
              <TableHead className="text-center">{t('projects.stats.gates', 'Gates')}</TableHead>
              <TableHead className="text-center">{t('projects.stats.units', 'Units')}</TableHead>
              <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                  {t('projects.empty', 'No projects found. Create one to get started.')}
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{project.name}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {project.description || t('projects.noDescription', 'No description')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-bold tracking-tight uppercase text-[10px]">
                      {project.gateMode}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <DoorOpen className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-bold tabular-nums">{project._count.gates}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-bold tabular-nums">{project._count.units}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <ProjectSheet mode="edit" project={project}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Pencil className="h-4 w-4 mr-2" />
                            {t('common.edit', 'Edit')}
                          </DropdownMenuItem>
                        </ProjectSheet>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('common.delete', 'Delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
