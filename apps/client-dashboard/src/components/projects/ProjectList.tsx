'use client';

import { Card, Button, Badge } from '@gate-access/ui';
import { Building, Users, ArrowRight, MapPin, Layers } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Project {
  id: string;
  name: string;
  description?: string | null;
  location?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  _count: {
    gates: number;
    qrCodes: number;
    units: number;
    contacts: number;
  };
}

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';

  if (projects.length === 0) {
    return (
      <Card className="border-dashed border-2 py-20 flex flex-col items-center justify-center bg-muted/20">
        <Layers className="h-12 w-12 text-muted-foreground/20 mb-4" />
        <h3 className="text-lg font-bold">No Projects Found</h3>
        <p className="text-sm text-muted-foreground mb-6">Start by creating your first project in settings.</p>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href={`/${locale}/dashboard/settings?tab=projects`}>
            Add Project
          </Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card 
          key={project.id} 
          className="group relative flex flex-col overflow-hidden rounded-3xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/20"
        >
          {/* Cover */}
          <div className="relative h-40 w-full overflow-hidden bg-muted/30">
            {project.coverUrl ? (
              <img 
                src={project.coverUrl} 
                alt={project.name} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 to-muted">
                <Building className="h-10 w-10 text-primary/10" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Logo & Info */}
          <div className="relative px-6 pb-6 pt-0">
            <div className="-mt-10 mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-card bg-background shadow-lg overflow-hidden shrink-0">
               {project.logoUrl ? (
                <img src={project.logoUrl} alt={project.name} className="h-full w-full object-cover" />
               ) : (
                <Building className="h-8 w-8 text-muted-foreground/20" />
               )}
            </div>

            <Link href={`/${locale}/dashboard/projects/${project.id}`} className="block group/title">
              <h3 className="text-xl font-black text-foreground tracking-tight group-hover/title:text-primary transition-colors truncate">
                {project.name}
              </h3>
            </Link>

            {project.location && (
              <p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                <MapPin className="h-3 w-3" />
                {project.location}
              </p>
            )}

            {/* Metrics Grid */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-muted/30 p-2.5 border border-border/50">
                <div className="bg-blue-500/10 text-blue-500 p-1.5 rounded-lg shrink-0">
                  <Users className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-foreground leading-none">{project._count.contacts}</span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase mt-0.5">Contacts</span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-muted/30 p-2.5 border border-border/50">
                <div className="bg-indigo-500/10 text-indigo-500 p-1.5 rounded-lg shrink-0">
                  <Building className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-foreground leading-none">{project._count.units}</span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase mt-0.5">Units</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
               <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[9px] font-bold border-border/60">
                    {project._count.gates} Gates
                  </Badge>
                  <Badge variant="outline" className="text-[9px] font-bold border-border/60">
                    {project._count.qrCodes} Keys
                  </Badge>
               </div>
               <Button 
                asChild
                variant="ghost" 
                size="sm" 
                className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary gap-1.5 group/btn"
               >
                  <Link href={`/${locale}/dashboard/projects/${project.id}`}>
                    Manage
                    <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
               </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

