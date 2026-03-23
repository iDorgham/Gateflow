'use client';

import { Pencil, Share2, MapPin, Globe, ExternalLink, ArrowLeft, Building } from 'lucide-react';
import { Button } from '@gate-access/ui';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface ProjectHeroProps {
  project: {
    id: string;
    name: string;
    description?: string | null;
    coverUrl?: string | null;
    logoUrl?: string | null;
    location?: string | null;
    website?: string | null;
    externalUrl?: string | null;
  };
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg transition-all"
    >
      {/* Cover Image */}
      <div className="relative h-48 w-full sm:h-64 lg:h-80 overflow-hidden bg-muted/30">
        {project.coverUrl ? (
          <img
            src={project.coverUrl}
            alt={`${project.name} cover`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
            <Globe className="h-16 w-16 text-primary/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button — start-6 for RTL flip */}
        <Link
          href={`/${locale}/dashboard/projects`}
          className="absolute top-6 start-6 flex h-10 w-10 items-center justify-center rounded-xl bg-background/20 backdrop-blur-md text-white hover:bg-background/40 transition-all border border-white/20"
        >
          <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
        </Link>
      </div>

      {/* Content */}
      <div className="relative px-6 pb-8 pt-0 lg:px-10">
        <div className="flex flex-col sm:flex-row items-end gap-6 -mt-12 sm:-mt-16 sm:items-center">
          {/* Logo */}
          <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-3xl border-8 border-card bg-background shadow-2xl overflow-hidden flex items-center justify-center shrink-0 transition-transform hover:scale-105">
            {project.logoUrl ? (
              <img
                src={project.logoUrl}
                alt={`${project.name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building className="h-12 w-12 text-muted-foreground/30" />
            )}
          </div>

          {/* Title & Info */}
          <div className="flex-1 min-w-0 pb-2">
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight truncate leading-none">
              {project.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-semibold text-muted-foreground/80">
              {project.location && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full border border-border/50">
                  <MapPin className="h-3.5 w-3.5 text-primary/60" />
                  <span>{project.location}</span>
                </div>
              )}
              {project.website && (
                <a 
                  href={project.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors hover:underline"
                >
                  <Globe className="h-3.5 w-3.5 text-primary/60" />
                  <span>Website</span>
                </a>
              )}
              {project.externalUrl && (
                <a 
                  href={project.externalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-primary/60" />
                  <span>External Portal</span>
                </a>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 gap-3 pb-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-none h-12 rounded-xl bg-background font-bold gap-2 shadow-sm border-border/60 hover:border-primary/30"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button
              variant="default"
              size="lg"
              className="flex-1 sm:flex-none h-12 rounded-xl font-bold gap-2 px-8 shadow-md hover:shadow-primary/20 transition-all bg-primary text-primary-foreground"
            >
              <Pencil className="h-4 w-4" />
              Edit Project
            </Button>
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <div className="mt-8 max-w-3xl">
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              {project.description}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
