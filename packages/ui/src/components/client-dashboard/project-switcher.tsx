import * as React from "react";
import { Building2, ChevronsUpDown, Check, PlusCircle } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";

export type Project = {
  id: string;
  name: string;
  role: string;
};

interface ProjectSwitcherProps {
  projects: Project[];
  selectedProject: Project;
  onSelectProject: (project: Project) => void;
  onCreateProject?: () => void;
  className?: string;
}

export function ProjectSwitcher({
  projects,
  selectedProject,
  onSelectProject,
  onCreateProject,
  className,
}: ProjectSwitcherProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a project"
          className={cn("w-[250px] justify-between", className)}
        >
          <div className="flex items-center gap-2 truncate">
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate font-semibold">{selectedProject.name}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search project..." />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup heading="Projects">
              {projects.map((project) => (
                <CommandItem
                  key={project.id}
                  onSelect={() => {
                    onSelectProject(project);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{project.name}</span>
                    <span className="text-xs text-muted-foreground">{project.role}</span>
                  </div>
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedProject.id === project.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {onCreateProject && (
            <>
              <CommandSeparator />
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      onCreateProject();
                    }}
                    className="cursor-pointer text-primary"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Project
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
