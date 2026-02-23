'use client';

import { createContext, useContext } from 'react';

export interface ProjectFilterProject {
  id: string;
  name: string;
}

export interface ProjectFilterContextValue {
  /** null means "All Projects" is active — no projectId filter applied */
  currentProjectId: string | null;
  projects: ProjectFilterProject[];
  /** true when no specific project is selected */
  isAllProjects: boolean;
  /** The active project object, or undefined when "All Projects" is selected */
  currentProject: ProjectFilterProject | undefined;
}

const ProjectFilterContext = createContext<ProjectFilterContextValue>({
  currentProjectId: null,
  projects: [],
  isAllProjects: true,
  currentProject: undefined,
});

export function ProjectFilterProvider({
  currentProjectId,
  projects,
  children,
}: {
  currentProjectId: string | null;
  projects: ProjectFilterProject[];
  children: React.ReactNode;
}) {
  const isAllProjects = currentProjectId === null;
  const currentProject = projects.find((p) => p.id === currentProjectId);

  return (
    <ProjectFilterContext.Provider
      value={{ currentProjectId, projects, isAllProjects, currentProject }}
    >
      {children}
    </ProjectFilterContext.Provider>
  );
}

export function useProjectFilter(): ProjectFilterContextValue {
  return useContext(ProjectFilterContext);
}
