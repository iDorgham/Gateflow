'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Switch,
  Label,
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { updateResidentDefaults } from '../../app/[locale]/dashboard/settings/residents/actions';
import { Shield, Eye, EyeOff } from 'lucide-react';

const residentSettingsSchema = z.object({
  maskResidentNameOnLandingPage: z.boolean(),
  showUnitOnLandingPage: z.boolean(),
});

type ResidentSettingsValues = z.infer<typeof residentSettingsSchema>;

interface ResidentSettingsFormProps {
  initialData: ResidentSettingsValues;
}

export function ResidentSettingsForm({ initialData }: ResidentSettingsFormProps) {
  const { t } = useTranslation('dashboard');
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResidentSettingsValues>({
    resolver: zodResolver(residentSettingsSchema),
    defaultValues: initialData,
  });

  const onSubmit = (values: ResidentSettingsValues) => {
    startTransition(async () => {
      const result = await updateResidentDefaults(values);
      if (result.success) {
        toast.success(t('settings.residents.updated', 'Resident settings updated successfully'));
      } else {
        toast.error(result.error || t('settings.residents.updateError', 'Failed to update settings'));
      }
    });
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          {t('settings.residents.privacyTitle', 'Resident Privacy & Defaults')}
        </CardTitle>
        <CardDescription>
          {t('settings.residents.privacyDesc', 'Control how resident information is displayed on public landing pages and scan results.')}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
              <div className="space-y-0.5">
                <Label className="text-base font-bold flex items-center gap-2">
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                  {t('settings.residents.maskName', 'Mask Resident Name')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.residents.maskNameDesc', 'Hide the resident name on the temporary access landing page.')}
                </p>
              </div>
              <Switch
                checked={form.watch('maskResidentNameOnLandingPage')}
                onCheckedChange={(checked) => form.setValue('maskResidentNameOnLandingPage', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
              <div className="space-y-0.5">
                <Label className="text-base font-bold flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  {t('settings.residents.showUnit', 'Show Unit Number')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.residents.showUnitDesc', 'Display the unit number/name on scan success pages for guards.')}
                </p>
              </div>
              <Switch
                checked={form.watch('showUnitOnLandingPage')}
                onCheckedChange={(checked) => form.setValue('showUnitOnLandingPage', checked)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isPending || !form.formState.isDirty} className="gap-2">
              {isPending ? t('common.saving', 'Saving...') : t('common.save', 'Save Preferences')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
