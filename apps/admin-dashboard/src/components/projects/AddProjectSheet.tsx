'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Button,
  NativeSelect,
} from '@gate-access/ui';
import { FolderOpen, Plus } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Project name must be at least 2 characters.' }),
  organizationId: z
    .string()
    .min(1, { message: 'Please select an organization.' }),
});

interface AddProjectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizations: { id: string; name: string }[];
}

export function AddProjectSheet({
  open,
  onOpenChange,
  organizations,
}: AddProjectSheetProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      organizationId: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // In a real app, this would be a server action or API call
      console.log('Creating project:', values);
      toast.success('Project provisioned successfully');
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to create project');
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md p-0 flex flex-col overflow-hidden border-l border-ds-border">
        <div className="flex flex-col space-y-2 text-center sm:text-left p-8 border-b border-ds-border bg-ds-background-subtle/30 shrink-0">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ds-background-brand-bold text-ds-text-inverse shadow-lg shadow-ds-background-brand-bold/20">
              <FolderOpen className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <SheetTitle className="text-xl font-black uppercase tracking-tight text-ds-text truncate">
                Provision Project
              </SheetTitle>
              <SheetDescription className="text-xs text-ds-text-subtlest font-medium uppercase tracking-wider">
                Create a new management unit
              </SheetDescription>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                      Project Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Burj Khalifa Management"
                        className="h-12 rounded-xl bg-ds-background-neutral-subtle border-ds-border focus:ring-2 focus:ring-ds-background-brand-bold/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold uppercase" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organizationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                      Parent Organization
                    </FormLabel>
                    <FormControl>
                      <NativeSelect
                        className="h-12 rounded-xl bg-ds-background-neutral-subtle border-ds-border"
                        {...field}
                      >
                        <option value="">Select Organization...</option>
                        {organizations.map((org) => (
                          <option key={org.id} value={org.id}>
                            {org.name}
                          </option>
                        ))}
                      </NativeSelect>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold uppercase" />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-ds-background-brand-bold hover:bg-ds-background-brand-bold/90 text-ds-text-inverse font-black uppercase tracking-[0.2em] shadow-xl shadow-ds-background-brand-bold/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
                >
                  <Plus className="ltr:mr-2 rtl:ml-2 h-5 w-5" /> Initialize
                  Project
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
