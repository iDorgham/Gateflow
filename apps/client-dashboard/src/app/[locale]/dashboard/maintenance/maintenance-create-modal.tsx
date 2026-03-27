'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  createWorkOrderSchema,
  CreateWorkOrderInput,
  MaintenancePriority,
  MaintenanceCategory,
  MaintenanceLocationType,
  BUILT_IN_ROLES,
  WorkOrderWithRelations,
} from '@gate-access/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gate-access/ui';
import { maintenanceApi } from '@gate-access/api-client';
import { toast } from 'sonner';

interface MaintenanceCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (newWorkOrder: WorkOrderWithRelations) => void;
  role: (typeof BUILT_IN_ROLES)[keyof typeof BUILT_IN_ROLES];
}

export function MaintenanceCreateModal({
  open,
  onOpenChange,
  onSuccess,
  role,
}: MaintenanceCreateModalProps) {
  const { t } = useTranslation(['dashboard', 'common', 'admin']);
  const isResident = role === BUILT_IN_ROLES.RESIDENT;
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(createWorkOrderSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: MaintenancePriority.MEDIUM,
      category: MaintenanceCategory.GENERAL,
      locationType: isResident
        ? MaintenanceLocationType.UNIT
        : MaintenanceLocationType.GATE,
      locationId: '',
    },
  });

  const onSubmit = async (values: CreateWorkOrderInput) => {
    try {
      setIsSubmitting(true);
      const response = await maintenanceApi.createWorkOrder(values);
      if (response.success) {
        toast.success(t('common.success.settingsSaved', { ns: 'admin' }));
        onSuccess?.(response.data as WorkOrderWithRelations);
        onOpenChange(false);
        form.reset();
      } else {
        toast.error(
          response.message || t('common.errors.saveFailed', { ns: 'admin' })
        );
      }
    } catch (error) {
      toast.error(t('common.errors.saveFailed', { ns: 'admin' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isResident
              ? t('maintenance.actions.create', { ns: 'dashboard' })
              : t('maintenance.actions.create', { ns: 'dashboard' })}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('maintenance.table.issue', { ns: 'dashboard' })}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('maintenance.form.issuePlaceholder', {
                        ns: 'dashboard',
                        defaultValue: 'Brief title of the issue',
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('common.description', { ns: 'common' })}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        'maintenance.form.descriptionPlaceholder',
                        { ns: 'dashboard', defaultValue: 'Detail the issue...' }
                      )}
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('maintenance.table.issue', { ns: 'dashboard' })}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('common.select', { ns: 'common' })}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(MaintenanceCategory).map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {t(`common.categories.${cat.toLowerCase()}`, {
                              ns: 'common',
                              defaultValue: cat,
                            })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isResident && (
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('maintenance.table.priority', { ns: 'dashboard' })}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t('common.select', { ns: 'common' })}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(MaintenancePriority).map((prio) => (
                            <SelectItem key={prio} value={prio}>
                              {prio}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="locationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('maintenance.table.asset', { ns: 'dashboard' })}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isResident}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('common.select', { ns: 'common' })}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(MaintenanceLocationType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {t('common.cancel', { ns: 'common' })}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isResident
                  ? t('maintenance.actions.create', { ns: 'dashboard' })
                  : t('maintenance.actions.create', { ns: 'dashboard' })}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
