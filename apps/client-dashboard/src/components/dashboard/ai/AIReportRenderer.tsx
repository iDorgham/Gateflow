'use client';

import * as React from 'react';
import { 
  Card, 
  CardContent, 
  Button, 
  cn 
} from '@gate-access/ui';
import { FileText, Download, FileSpreadsheet, Loader2 } from 'lucide-react';

export interface ReportDataBlock {
  type: 'report';
  reportType: 'pdf' | 'csv';
  title: string;
  params: {
    dateFrom?: string;
    dateTo?: string;
    projectId?: string;
    gateId?: string;
    unitType?: string;
    search?: string;
  };
}

interface AIReportRendererProps {
  config: ReportDataBlock;
  isRtl?: boolean;
}

export function AIReportRenderer({ config, isRtl }: AIReportRendererProps) {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const { reportType, title, params } = config;

  const t = (en: string, ar: string) => (isRtl ? ar : en);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const sp = new URLSearchParams();
      if (params.dateFrom) sp.set('dateFrom', params.dateFrom);
      if (params.dateTo) sp.set('dateTo', params.dateTo);
      if (params.projectId) sp.set('projectId', params.projectId);
      if (params.gateId) sp.set('gateId', params.gateId);
      if (params.unitType) sp.set('unitType', params.unitType);
      if (params.search) sp.set('search', params.search);
      if (reportType === 'pdf') sp.set('locale', isRtl ? 'ar' : 'en');
      sp.set('type', reportType);

      const url = `/api/ai/reports/generate?${sp.toString()}`;

      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = ''; // Filename is handled by Content-Disposition header
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download report:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const Icon = reportType === 'pdf' ? FileText : FileSpreadsheet;
  const typeLabel = reportType.toUpperCase();

  return (
    <Card className="my-4 border-[var(--ds-border-discovery,#998DD9)]/30 bg-background/80 shadow-sm overflow-hidden group">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={cn(
          "h-12 w-12 rounded-lg flex items-center justify-center shrink-0 transition-colors",
          reportType === 'pdf' 
            ? "bg-red-50 text-red-600 group-hover:bg-red-100" 
            : "bg-green-50 text-green-600 group-hover:bg-green-100"
        )}>
          <Icon size={24} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
            {typeLabel} {t('Report', 'تقرير')}
          </p>
          <h4 className="text-sm font-medium text-[var(--ds-text,#172B4D)] truncate">
            {title}
          </h4>
          {params.dateFrom && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {params.dateFrom} {params.dateTo ? `→ ${params.dateTo}` : ''}
            </p>
          )}
        </div>

        <Button
          size="sm"
          variant="outline"
          className="shrink-0 gap-2 border-[var(--ds-border-discovery,#998DD9)]/40 hover:bg-[var(--ds-background-discovery-subtle,#EAE6FF)]/30"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Download size={14} />
          )}
          <span className="hidden sm:inline">
            {isDownloading ? t('Generating...', 'جاري الإنشاء...') : t('Download', 'تحميل')}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
}
