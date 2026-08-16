'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gateflow/ui';
import { useQuery } from '@tanstack/react-query';

const GateAssignmentSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  gateId: z.string().min(1, 'Gate is required'),
  shiftStart: z.string().optional().nullable(),
  shiftEnd: z.string().optional().nullable(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
});

type GateAssignmentValues = z.infer<typeof GateAssignmentSchema>;

interface GateAssignmentFormProps {
  projectId: string;
  initialData?: Partial<GateAssignmentValues>;
  onSubmit: (values: GateAssignmentValues) => Promise<void>;
}

export function GateAssignmentForm({
  projectId,
  initialData,
  onSubmit,
}: GateAssignmentFormProps) {
  const form = useForm<GateAssignmentValues>({
    resolver: zodResolver(GateAssignmentSchema),
    defaultValues: {
      userId: initialData?.userId || '',
      gateId: initialData?.gateId || '',
      shiftStart: initialData?.shiftStart || '',
      shiftEnd: initialData?.shiftEnd || '',
      startTime: initialData?.startTime
        ? new Date(initialData.startTime).toISOString().slice(0, 16)
        : '',
      endTime: initialData?.endTime
        ? new Date(initialData.endTime).toISOString().slice(0, 16)
        : '',
    },
  });

  const { data: usersData } = useQuery({
    queryKey: ['workspace', 'users'],
    queryFn: async () => {
      const res = await fetch('/api/workspace/users'); // Assuming this exists or using team API
      if (!res.ok) return { data: [] };
      return res.json();
    },
  });

  const { data: projectData } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}`); // Assuming this exists to get gates
      if (!res.ok) return { data: { gates: [] } };
      return res.json();
    },
  });

  const users = usersData?.data || [];
  const gates = projectData?.data?.gates || [];

  return (
    <Form {...form}>
      <form
        id="gate-assignment-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Member</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!!initialData}
              >
                <FormControl>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((u: { id: string; name: string; email: string }) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Gate</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!!initialData}
              >
                <FormControl>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select a gate" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {gates.map((g: { id: string; name: string }) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="shiftStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shift Start (HH:mm)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="08:00"
                    className="h-11 rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shiftEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shift End (HH:mm)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="17:00"
                    className="h-11 rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid From (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="datetime-local"
                    className="h-11 rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid Until (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="datetime-local"
                    className="h-11 rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
