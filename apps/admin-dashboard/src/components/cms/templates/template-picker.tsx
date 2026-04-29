import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Card,
  CardContent,
  Button,
} from '@gateflow/ui';
import { PAGE_TEMPLATES, PageTemplate } from './page-templates';
import { LayoutTemplate, FilePlus } from 'lucide-react';

interface TemplatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: PageTemplate) => void;
}

export function TemplatePicker({
  isOpen,
  onClose,
  onSelect,
}: TemplatePickerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Choose a Page Template</DialogTitle>
          <DialogDescription>
            Select a pre-built structure to accelerate your design workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          {Object.values(PAGE_TEMPLATES).map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer group hover:border-ds-border-brand border-2 transition-all shadow-sm hover:shadow-md"
              onClick={() => onSelect(template)}
            >
              <CardContent className="p-4 flex flex-col h-full">
                <div className="h-24 bg-ds-surface-subtle rounded-lg mb-3 flex items-center justify-center group-hover:bg-ds-background-brand-subtle transition-colors">
                  {template.id === 'blank' ? (
                    <FilePlus className="h-8 w-8 text-ds-icon-subtle group-hover:text-ds-icon-brand" />
                  ) : (
                    <LayoutTemplate className="h-8 w-8 text-ds-icon-subtle group-hover:text-ds-icon-brand" />
                  )}
                </div>
                <h4 className="font-bold text-ds-text text-sm mb-1 uppercase tracking-tight">
                  {template.label}
                </h4>
                <p className="text-xs text-ds-text-subtle line-clamp-2 flex-1">
                  {template.description}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
