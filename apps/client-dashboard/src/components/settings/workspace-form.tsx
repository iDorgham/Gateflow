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
  Separator,
  Switch,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@gateflow/ui';
import { toast } from 'sonner';
import { token } from '@atlaskit/tokens';
import {
  Building2,
  Mail,
  Palette,
  ShieldCheck,
  Upload,
  History,
  Info,
} from 'lucide-react';

const MAX_LOGO_BYTES = 5 * 1024 * 1024;
const ALLOWED_LOGO_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
];

// Nullable = keep data indefinitely, matching Organization.*RetentionMonths
const retentionMonthsField = z.number().int().min(1).max(120).nullable();

const workspaceSchema = z.object({
  name: z.string().min(2, 'Workspace name must be at least 2 characters'),
  adminEmail: z.string().email('Invalid administrative email'),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  logoUrl: z.string().url().nullable(),
  scanLogRetentionMonths: retentionMonthsField,
  visitorHistoryRetentionMonths: retentionMonthsField,
  idArtifactRetentionMonths: retentionMonthsField,
  incidentRetentionMonths: retentionMonthsField,
  retentionLegalHold: z.boolean(),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

interface WorkspaceSettingsFormProps {
  initialData?: {
    id: string;
    name: string;
    adminEmail?: string;
    logoUrl?: string | null;
    accentColor?: string | null;
    scanLogRetentionMonths?: number | null;
    visitorHistoryRetentionMonths?: number | null;
    idArtifactRetentionMonths?: number | null;
    incidentRetentionMonths?: number | null;
    retentionLegalHold?: boolean;
  };
}

const RETENTION_CATEGORIES = [
  {
    field: 'scanLogRetentionMonths',
    label: 'Scan Logs',
    description: 'Gate scan events and access decisions.',
  },
  {
    field: 'visitorHistoryRetentionMonths',
    label: 'Visitor History',
    description: 'Visitor check-in/out records.',
  },
  {
    field: 'idArtifactRetentionMonths',
    label: 'ID Artifacts',
    description: 'Captured ID photos and OCR data.',
  },
  {
    field: 'incidentRetentionMonths',
    label: 'Incidents',
    description: 'Reported incidents and their resolution records.',
  },
] as const;

export function WorkspaceSettingsForm({
  initialData,
}: WorkspaceSettingsFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData?.logoUrl || null
  );
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: initialData?.name || '',
      adminEmail: initialData?.adminEmail || '',
      accentColor:
        initialData?.accentColor || token('color.background.brand.bold'),
      logoUrl: initialData?.logoUrl ?? null,
      scanLogRetentionMonths: initialData?.scanLogRetentionMonths ?? null,
      visitorHistoryRetentionMonths:
        initialData?.visitorHistoryRetentionMonths ?? null,
      idArtifactRetentionMonths: initialData?.idArtifactRetentionMonths ?? null,
      incidentRetentionMonths: initialData?.incidentRetentionMonths ?? null,
      retentionLegalHold: initialData?.retentionLegalHold ?? false,
    },
  });

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      toast.error('Logo must be a PNG, JPEG, WebP, or SVG image');
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      toast.error('Logo must be 5MB or smaller');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);
    setIsUploadingLogo(true);

    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/workspace/logo', {
        method: 'POST',
        body,
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Upload failed');
      }
      setLogoPreview(result.data.logoUrl);
      form.setValue('logoUrl', result.data.logoUrl, { shouldDirty: true });
      toast.success('Logo uploaded');
    } catch (error) {
      toast.error('Failed to upload logo');
      console.error(error);
      setLogoPreview(initialData?.logoUrl || null);
    } finally {
      URL.revokeObjectURL(objectUrl);
      setIsUploadingLogo(false);
    }
  };

  async function onSubmit(data: WorkspaceFormValues) {
    try {
      if (!initialData?.id) return;

      const response = await fetch('/api/workspace/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: data.name,
          email: data.adminEmail,
          accentColor: data.accentColor,
          logoUrl: data.logoUrl,
          scanLogRetentionMonths: data.scanLogRetentionMonths,
          visitorHistoryRetentionMonths: data.visitorHistoryRetentionMonths,
          idArtifactRetentionMonths: data.idArtifactRetentionMonths,
          incidentRetentionMonths: data.incidentRetentionMonths,
          retentionLegalHold: data.retentionLegalHold,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Update failed');
      }
      toast.success('Workspace settings updated successfully');
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
                  <AvatarImage src={logoPreview || undefined} />
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                    {form.getValues('name')?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="relative">
                  <Input
                    type="file"
                    className="hidden"
                    id="logo-upload"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    disabled={isUploadingLogo}
                    onChange={handleLogoChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-[10px] h-8"
                    disabled={isUploadingLogo}
                    onClick={() =>
                      document.getElementById('logo-upload')?.click()
                    }
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    {isUploadingLogo ? 'Uploading...' : 'Change Logo'}
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
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center gap-2 text-base font-medium">
              <History className="h-4 w-4 text-muted-foreground" />
              Data Retention Periods
            </div>

            {RETENTION_CATEGORIES.map((category) => (
              <FormField
                key={category.field}
                control={form.control}
                name={category.field}
                render={({ field }) => {
                  const indefinite = field.value === null;
                  return (
                    <FormItem className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <FormLabel>{category.label}</FormLabel>
                          <FormDescription>
                            {category.description}
                          </FormDescription>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={120}
                              disabled={indefinite}
                              className="w-20 bg-background/50 border-border/50 text-right"
                              value={field.value ?? ''}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ''
                                    ? null
                                    : parseInt(e.target.value, 10)
                                )
                              }
                            />
                          </FormControl>
                          <span className="text-xs text-muted-foreground w-12">
                            months
                          </span>
                          <label className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                            <Switch
                              checked={indefinite}
                              onCheckedChange={(checked: boolean) =>
                                field.onChange(checked ? null : 12)
                              }
                            />
                            Keep indefinitely
                          </label>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            ))}

            <Separator className="bg-border/30" />

            <FormField
              control={form.control}
              name="retentionLegalHold"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl border border-warning/20 bg-warning/5 p-4">
                  <div className="space-y-0.5 pr-4">
                    <FormLabel className="text-sm">Legal Hold</FormLabel>
                    <FormDescription>
                      Blocks all automated retention purges for this workspace
                      until released.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="rounded-xl border border-info/20 bg-info/5 p-4 flex gap-3">
              <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Data older than each period is automatically purged daily,
                unless Legal Hold is active.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" className="rounded-xl px-6">
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-xl px-10 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
          >
            Update Workspace
          </Button>
        </div>
      </form>
    </Form>
  );
}
