'use client';

import React from 'react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Navigation,
  ExternalLink,
  User,
  Building,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, Badge, Button, Separator } from '@gate-access/ui';
import { useTranslation } from '../../hooks/use-translation';
import { cn } from '../../lib/utils';
import { updateVisitorName } from '@/lib/actions/invitation';

interface BrandedPassProps {
  qrId: string; // Add qrId to props
  qrCode: string;
  visitorName: string | null;
  projectName: string;
  organizationName: string;
  expiresAt: string | null;
  unitName: string | null;
  coordinates?: { lat: number; lng: number };
  isVerified: boolean;
  lang: string;
}

export const BrandedPass: React.FC<BrandedPassProps> = ({
  qrId,
  qrCode,
  visitorName: initialVisitorName,
  projectName,
  organizationName,
  expiresAt,
  unitName,
  coordinates,
  isVerified,
  lang,
}) => {
  const { t } = useTranslation('invitation');
  const [visitorName, setVisitorName] = React.useState(initialVisitorName);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const isArabic = lang === 'ar-EG';

  const formatExpiry = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString(lang, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  const openNavigation = (app: 'google' | 'apple' | 'waze') => {
    if (!coordinates) return;
    const { lat, lng } = coordinates;

    let url = '';
    switch (app) {
      case 'google':
        url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        break;
      case 'apple':
        url = `maps://maps.apple.com/?q=${lat},${lng}`;
        break;
      case 'waze':
        url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
        break;
    }
    window.open(url, '_blank');
  };

  const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('fullName') as string;

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const result = await updateVisitorName(qrId, name);
      if (result.success) {
        setVisitorName(name);
      } else {
        setError(result.message || 'Failed to update.');
      }
    } catch {
      setError('Connection error.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto space-y-6"
    >
      {/* Branded Card */}
      <Card className="overflow-hidden border-2 border-primary/20 shadow-2xl bg-white dark:bg-slate-900">
        {/* Header / Brand Gradient */}
        <div className="h-3 bg-gradient-to-r from-primary via-accent to-secondary" />

        <CardContent className="p-8 pt-6 space-y-8">
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Building className="w-3 h-3" />
                {organizationName}
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {projectName}
              </h2>
            </div>

            {isVerified ? (
              <Badge
                variant="success"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 px-3 py-1 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {t('verification')}
              </Badge>
            ) : (
              <Badge variant="danger" className="gap-1 px-3 py-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Unverified
              </Badge>
            )}
          </div>

          {/* QR Code Container */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 aspect-square"
          >
            <div className="p-4 bg-white rounded-2xl shadow-xl">
              <QRCode
                value={qrCode}
                size={200}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                fgColor="#0F172A"
              />
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                {t('verificationDesc')}
              </p>
              <div className="h-0.5 w-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>
          </motion.div>

          {/* Details Grid or Name Capture */}
          {visitorName ? (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {t('fullName')}
                </p>
                <p className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  <User className="w-4 h-4 text-primary" />
                  {visitorName}
                </p>
              </div>
              {unitName && (
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Unit / Apartment
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {unitName}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <form
              onSubmit={handleUpdateName}
              className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-dashed"
            >
              <div className="space-y-1.5 text-center mb-4">
                <p className="text-sm font-bold tracking-tight">
                  {t('guestDetails')}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {t('guestDetailsDesc')}
                </p>
              </div>
              <div className="space-y-2">
                <input
                  name="fullName"
                  placeholder={t('fullNamePlaceholder')}
                  className="w-full h-11 px-4 rounded-xl border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                  disabled={isUpdating}
                  required
                />
                {error && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full h-11 rounded-xl bg-primary text-white font-bold text-sm tracking-tight"
                >
                  {isUpdating ? 'Activating...' : t('activatePass')}
                </Button>
              </div>
            </form>
          )}

          <Separator className="opacity-50" />

          {/* Expiry / Timing */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{t('validUntil')}</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {expiresAt ? formatExpiry(expiresAt) : 'Permanent'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Action Sections */}
      <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Navigation Section */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">
            {t('oneTapNav')}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-14 rounded-2xl border-2 hover:bg-slate-50 gap-2 font-semibold text-xs"
              onClick={() => openNavigation('google')}
            >
              <Navigation className="w-4 h-4 text-blue-500" />
              {t('googleMaps')}
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-14 rounded-2xl border-2 hover:bg-slate-50 gap-2 font-semibold text-xs"
              onClick={() => openNavigation('apple')}
            >
              <ExternalLink className="w-4 h-4 text-slate-900 dark:text-slate-100" />
              {t('appleMaps')}
            </Button>
          </div>
        </div>

        {/* Wallet / Save Section */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 h-14 rounded-2xl bg-slate-900 text-white hover:bg-black font-bold tracking-tight gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {t('addToWallet')}
          </Button>
          <Button
            variant="outline"
            className="h-14 w-14 rounded-2xl border-2 p-0"
          >
            <ExternalLink className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground opacity-60">
        &copy; {new Date().getFullYear()} GateFlow Security. All rights
        reserved.
      </p>
    </motion.div>
  );
};
