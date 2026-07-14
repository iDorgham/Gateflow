'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Sheet,
  SheetContent,
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
} from '@gateflow/ui';
import { DoorOpen, Plus, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Gate name must be at least 2 characters.' }),
  location: z.string().optional(),
  projectId: z.string().min(1, { message: 'Please select a project.' }),
});

interface AddGateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: { id: string; name: string }[];
}

export function AddGateSheet({
  open,
  onOpenChange,
  projects,
}: AddGateSheetProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      location: '',
      projectId: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log('Commissioning gate:', values);
      toast.success('Gate commissioned successfully');
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to commission gate');
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md p-0 flex flex-col overflow-hidden border-l border-ds-border">
        <div className="flex flex-col space-y-2 text-center sm:text-left p-8 border-b border-ds-border bg-ds-background-subtle/30 shrink-0">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ds-background-success-bold text-ds-text-inverse shadow-lg shadow-ds-background-success-bold/20">
              <DoorOpen className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <SheetTitle className="text-xl font-black uppercase tracking-tight text-ds-text truncate">
                Commission Gate
              </SheetTitle>
              <SheetDescription className="text-xs text-ds-text-subtlest font-medium uppercase tracking-wider">
                Register a new access point
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
                      Gate Identifier
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Main Entrance North"
                        className="h-12 rounded-xl bg-ds-background-neutral-subtle border-ds-border focus:ring-2 focus:ring-ds-background-success-bold/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold uppercase" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                      Physical Location (Optional)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest pointer-events-none" />
                        <Input
                          placeholder="e.g. Building A, Floor 1"
                          className="pl-11 h-12 rounded-xl bg-ds-background-neutral-subtle border-ds-border focus:ring-2 focus:ring-ds-background-success-bold/20"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold uppercase" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                      Target Project
                    </FormLabel>
                    <FormControl>
                      <NativeSelect
                        className="h-12 rounded-xl bg-ds-background-neutral-subtle border-ds-border"
                        {...field}
                      >
                        <option value="">Select Project...</option>
                        {projects.map((proj) => (
                          <option key={proj.id} value={proj.id}>
                            {proj.name}
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
                  className="w-full h-14 rounded-2xl bg-ds-background-success-bold hover:bg-ds-background-success-bold/90 text-ds-text-inverse font-black uppercase tracking-[0.2em] shadow-xl shadow-ds-background-success-bold/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
                >
                  <Plus className="ltr:mr-2 rtl:ml-2 h-5 w-5" /> Commission Now
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
