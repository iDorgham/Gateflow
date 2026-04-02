'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  MultiSelect,
} from '@gate-access/ui';
import { UnitType } from '@gate-access/db/prisma';
import { useTranslation } from 'react-i18next';

const unitSchema = z.object({
  name: z.string().min(1, 'Unit name is required'),
  type: z.nativeEnum(UnitType),
  building: z.string().optional().nullable(),
  sizeSqm: z.number().int().positive().optional().nullable(),
  contactIds: z.array(z.string()).optional(),
});

type UnitFormValues = z.infer<typeof unitSchema>;

interface UnitFormProps {
  initialData?: Partial<UnitFormValues>;
  contactOptions: { label: string; value: string }[];
  onSubmit: (data: UnitFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function UnitForm({
  initialData,
  contactOptions,
  onSubmit,
  isLoading,
}: UnitFormProps) {
  const { t } = useTranslation('dashboard');
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: (initialData?.type as UnitType) || UnitType.STUDIO,
      building: initialData?.building || '',
      sizeSqm: initialData?.sizeSqm || null,
      contactIds: initialData?.contactIds || [],
    },
  });

  const selectedType = watch('type');
  const selectedContacts = watch('contactIds') || [];

  return (
    <form
      id="unit-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">
          {t('crm.units.name', 'Unit Name / Number')}
        </Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="e.g. A-101"
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label>{t('crm.units.type', 'Unit Category')}</Label>
        <RadioGroup
          value={selectedType}
          onValueChange={(v) => setValue('type', v as UnitType)}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          {Object.values(UnitType).map((type) => (
            <div
              key={type}
              className="flex items-center space-x-2 rounded-lg border border-border p-3 hover:bg-accent transition-colors"
            >
              <RadioGroupItem value={type} id={`type-${type}`} />
              <Label
                htmlFor={`type-${type}`}
                className="text-xs font-bold flex-1 cursor-pointer"
              >
                {type.replace('_', ' ')}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="building">
            {t('crm.units.building', 'Building / Block')}
          </Label>
          <Input
            id="building"
            {...register('building')}
            placeholder="Tower 1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sizeSqm">
            {t('crm.units.sizeSqm', 'Surface Area (sqm)')}
          </Label>
          <Input
            id="sizeSqm"
            type="number"
            {...register('sizeSqm', { valueAsNumber: true })}
            placeholder="120"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          {t('crm.units.linkedContacts', 'Linked Residents / Contacts')}
        </Label>
        <MultiSelect
          options={contactOptions}
          selected={selectedContacts}
          onChange={(vals) =>
            setValue('contactIds', vals, { shouldDirty: true })
          }
          placeholder="Assign contacts to this unit..."
        />
      </div>
    </form>
  );
}
