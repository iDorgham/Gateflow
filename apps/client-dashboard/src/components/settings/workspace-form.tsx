'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  toast,
  Separator,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@gate-access/ui';
import { 
  Building2, 
  Mail, 
  Palette, 
  ShieldCheck, 
  Upload, 
  History,
  Info 
} from 'lucide-react';
import { apiClient } from '@gate-access/api-client';

const workspaceSchema = z.object({
  name: z.string().min(2, 'Workspace name must be at least 2 characters'),
  adminEmail: z.string().email('Invalid administrative email'),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  retentionDays: z.number().min(1).max(3650),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

interface WorkspaceSettingsFormProps {
  initialData?: {
    id: string;
    name: string;
    adminEmail?: string;
    logoUrl?: string;
    accentColor?: string;
    retentionDays?: number;
  };
}

export function WorkspaceSettingsForm({ initialData }: WorkspaceSettingsFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logoUrl || null);


  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: initialData?.name || '',
      adminEmail: initialData?.adminEmail || '',
      accentColor: initialData?.accentColor || '#3B82F6',
      retentionDays: initialData?.retentionDays || 365,
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: WorkspaceFormValues) {
    try {
      if (initialData?.id) {
        await apiClient.patch(`/organizations/${initialData.id}`, {
          ...data,
          logoUrl: logoPreview, // Simplified for v6.0 Phase 2
        });
        toast.success('Workspace settings updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update workspace settings');
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-6">
            <CardTitle className="text-xl flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              General Branding
            </CardTitle>
            <CardDescription>
              Identify your workspace with a name and logo.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24 border-2 border-border/50 rounded-2xl">
                  <AvatarImage src={logoPreview || ''} />
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                    {form.getValues('name')?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="relative">
                  <Input
                    type="file"
                    className="hidden"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-[10px] h-8"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Change Logo
                  </Button>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Al-Rehab Heights" 
                          className="bg-background/50 border-border/50 transition-all focus:bg-background"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Administrative Email
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="admin@gateflow.com" 
                          className="bg-background/50 border-border/50 transition-all focus:bg-background"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Used for billing and security notifications.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="bg-border/30" />

            <FormField
              control={form.control}
              name="accentColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    Brand Color
                  </FormLabel>
                  <div className="flex items-center gap-4">
                    <FormControl>
                      <div className="flex items-center gap-3 w-full">
                        <Input 
                          type="color" 
                          className="h-10 w-10 p-0 border-none bg-transparent cursor-pointer rounded-lg overflow-hidden shrink-0"
                          {...field} 
                        />
                        <Input 
                          className="font-mono bg-background/50 border-border/50"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </div>
                    </FormControl>
                  </div>
                  <FormDescription>
                    Affects login page, emails, and scanner backgrounds.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="bg-muted/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Privacy & Compliance
            </CardTitle>
            <CardDescription>
              Control how long GateFlow stores your access data.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <FormField
              control={form.control}
              name="retentionDays"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="flex items-center gap-2 text-base">
                      <History className="h-4 w-4 text-muted-foreground" />
                      Data Retention Period
                    </FormLabel>
                    <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-xs">
                      {field.value} Days
                    </span>
                  </div>
                  <FormControl>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="30"
                        max="3650"
                        step="30"
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        value={field.value}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                        <span>30 Days</span>
                        <span>1 Year</span>
                        <span>5 Years</span>
                        <span>10 Years</span>
                      </div>
                    </div>
                  </FormControl>
                  <div className="rounded-xl border border-info/20 bg-info/5 p-4 flex gap-3">
                    <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Logs older than this period will be automatically purged daily (v6.0 compliance engine).
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" className="rounded-xl px-6">
            Cancel
          </Button>
          <Button type="submit" className="rounded-xl px-10 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
            Update Workspace
          </Button>
        </div>
      </form>
    </Form>
  );
}
