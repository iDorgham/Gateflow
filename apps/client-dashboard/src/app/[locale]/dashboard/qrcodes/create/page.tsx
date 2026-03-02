'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label } from '@gate-access/ui';
import { QrCode, ArrowLeft } from 'lucide-react';

export default function CreateQRCodePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en-US';
  const { t } = useTranslation('dashboard');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('overview.createQr', { defaultValue: 'Create QR Code' })}</h1>
          <p className="text-sm text-muted-foreground">
            {t('overview.sub.activeQRs', { defaultValue: 'Generate a new access code for your gates' })}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/${locale}/dashboard/qrcodes`}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            {t('common.back', { defaultValue: 'Back' })}
          </Link>
        </Button>
      </div>

      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            {t('overview.createQr', { defaultValue: 'Create QR Code' })}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('overview.noScansDesc', { defaultValue: 'Configure and generate a new QR code. Full form coming soon.' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestName" className="text-foreground">{t('common.guestName', { defaultValue: 'Guest name' })}</Label>
            <Input
              id="guestName"
              placeholder={t('common.guestName', { defaultValue: 'Guest name' })}
              className="border-border bg-background text-foreground"
            />
          </div>
          <Button className="bg-primary text-primary-foreground">
            {t('overview.createQr', { defaultValue: 'Create QR Code' })}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
