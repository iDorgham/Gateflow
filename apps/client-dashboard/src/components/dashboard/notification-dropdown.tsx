'use client';

import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  cn,
} from '@gate-access/ui';
import { Bell, CheckCircle2, QrCode } from 'lucide-react';

interface ExpiredQR {
  id: string;
  code: string;
  expiresAt: string;
  gateName: string | null;
}

interface NotificationDropdownProps {
  items: ExpiredQR[];
  locale: string;
}

function formatCode(code: string): string {
  // Show first 14 chars + ellipsis for long signed payloads
  return code.length > 20 ? `${code.slice(0, 14)}…${code.slice(-6)}` : code;
}

export function NotificationDropdown({ items, locale }: NotificationDropdownProps) {
  const isRtl = locale === 'ar-EG';
  const count = items.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground transition-colors"
          aria-label={isRtl ? `${count} تنبيهات` : `${count} notifications`}
        >
          <Bell className="h-[17px] w-[17px]" />
          {count > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-black text-destructive-foreground shadow-sm"
              aria-hidden="true"
            >
              {count > 9 ? '9+' : count}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align={isRtl ? 'start' : 'end'}
        className="w-[340px] p-0 rounded-2xl border-border shadow-2xl"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-[11px] font-black uppercase tracking-widest text-foreground">
              {isRtl ? 'التنبيهات' : 'Notifications'}
            </span>
          </div>
          {count > 0 && (
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-black text-destructive">
              {count}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="max-h-[320px] overflow-y-auto p-3 space-y-2">
          {count === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="h-12 w-12 rounded-2xl bg-success/10 flex items-center justify-center mb-3">
                <CheckCircle2 className="h-6 w-6 text-success" aria-hidden="true" />
              </div>
              <p className="text-sm font-bold text-foreground">
                {isRtl ? 'كل شيء على ما يرام' : 'All clear'}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {isRtl ? 'لا توجد رموز QR منتهية الصلاحية' : 'No expired QR codes'}
              </p>
            </div>
          ) : (
            items.map((qr) => (
              <Link
                key={qr.id}
                href={`/${locale}/dashboard/qrcodes?q=${encodeURIComponent(qr.code)}`}
                className={cn(
                  'group flex items-start gap-3 rounded-xl border border-border p-3 transition-all hover:border-destructive/20 hover:bg-destructive/5',
                )}
              >
                <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                  <QrCode className="h-4 w-4 text-destructive" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs font-bold text-foreground truncate">
                    {formatCode(qr.code)}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {isRtl ? 'انتهت في' : 'Expired'}{' '}
                    <span className="font-medium text-foreground/70">
                      {new Date(qr.expiresAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    {qr.gateName && (
                      <span className="ml-1 text-muted-foreground/60">· {qr.gateName}</span>
                    )}
                  </p>
                </div>
                <div className="h-2 w-2 rounded-full bg-destructive shrink-0 mt-2 opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2.5">
          <Link
            href={`/${locale}/dashboard/qrcodes`}
            className="block text-center text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
          >
            {isRtl ? 'عرض جميع رموز QR ←' : 'View All QR Codes →'}
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
