'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Label, MultiSelect } from '@gateflow/ui';
import { useTranslation } from 'react-i18next';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  unitIds: z.array(z.string()).optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  initialData?: Partial<ContactFormValues>;
  unitOptions: { label: string; value: string }[];
  onSubmit: (data: ContactFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function ContactForm({
  initialData,
  unitOptions,
  onSubmit,
  _isLoading,
}: ContactFormProps & { _isLoading?: boolean }) {
  const { t } = useTranslation('dashboard');
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      jobTitle: initialData?.jobTitle || '',
      company: initialData?.company || '',
      unitIds: initialData?.unitIds || [],
    },
  });

  const selectedUnits = watch('unitIds') || [];

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            {t('crm.contacts.firstName', 'First Name')}
          </Label>
          <Input
            id="firstName"
            {...register('firstName')}
            placeholder="John"
            className={errors.firstName ? 'border-destructive' : ''}
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">
            {t('crm.contacts.lastName', 'Last Name')}
          </Label>
          <Input
            id="lastName"
            {...register('lastName')}
            placeholder="Doe"
            className={errors.lastName ? 'border-destructive' : ''}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          {t('crm.contacts.email', 'Email Address')}
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="john.doe@example.com"
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{t('crm.contacts.phone', 'Phone Number')}</Label>
        <Input id="phone" {...register('phone')} placeholder="+1 234 567 890" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jobTitle">
            {t('crm.contacts.jobTitle', 'Job Title')}
          </Label>
          <Input
            id="jobTitle"
            {...register('jobTitle')}
            placeholder="Property Manager"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">
            {t('crm.contacts.company', 'Company')}
          </Label>
          <Input
            id="company"
            {...register('company')}
            placeholder="Acme Corp"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('crm.contacts.linkedUnits', 'Linked Units')}</Label>
        <MultiSelect
          options={unitOptions}
          selected={selectedUnits}
          onChange={(vals) => setValue('unitIds', vals, { shouldDirty: true })}
          placeholder="Select units to link..."
        />
      </div>
    </form>
  );
}
