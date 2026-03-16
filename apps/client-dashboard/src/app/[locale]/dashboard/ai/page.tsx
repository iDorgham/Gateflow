'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from 'ai/react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button,
  cn
} from '@gate-access/ui';
import { Sparkles, Brain, BarChart3, FileText, QrCode } from 'lucide-react';
import { ChatPanel } from '@/components/dashboard/ai/ChatPanel';

export default function GateAIPage() {
  const { t, i18n } = useTranslation('dashboard');
  const isRtl = i18n.language === 'ar';
  const [showChat, setShowChat] = React.useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/ai/chat',
  });

  if (showChat) {
    return (
      <div className="flex flex-col gap-6 p-6 h-[calc(100vh-120px)] max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[var(--ds-text-discovery,#403294)]">
            {t('ai.hubTitle', 'GateAI Hub')}
          </h1>
          <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
            {t('ai.backToInfo', 'Back to Overview')}
          </Button>
        </div>
        
        {error && (
          <div className="p-4 bg-[var(--ds-background-danger,#FFEBE6)] text-[var(--ds-text-danger,#BF2600)] rounded-lg text-sm mb-4">
            {t('ai.chatError', 'Failed to connect to GateAI. Please check your credentials or try again later.')}
            <pre className="mt-2 text-[10px] opacity-70">{(error as any).message || error.toString()}</pre>
          </div>
        )}

        <ChatPanel 
          messages={messages} 
          input={input} 
          handleInputChange={handleInputChange} 
          handleSubmit={handleSubmit} 
          isLoading={isLoading} 
          isRtl={isRtl}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[var(--ds-border-radius-400,8px)] bg-[var(--ds-background-discovery,#EAE6FF)] p-8">
        <div className="relative z-10 flex flex-col gap-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded bg-[var(--ds-background-discovery-bold,#5243AA)] text-white text-[10px] font-bold uppercase tracking-wider">
              mediaBubble AI
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[var(--ds-text-discovery,#403294)]">
            {t('ai.welcomeTitle', 'Meet GateAI: Your Intelligent Operations Agent')}
          </h1>
          <p className="text-lg text-[var(--ds-text-discovery,#403294)]/80 leading-relaxed">
            {t('ai.welcomeDesc', 'Streamline your property operations with natural language. Ask questions about scans, generate reports, or create bulk QRs in seconds.')}
          </p>
          <div className="flex gap-3 mt-2">
            <Button 
              variant="discovery" 
              size="lg" 
              className="shadow-lg"
              onClick={() => setShowChat(true)}
            >
              {t('ai.getStarted', 'Get Started')}
            </Button>
            <Button variant="discovery-subtle" size="lg">
              {t('ai.viewGuide', 'View Guide')}
            </Button>
          </div>
        </div>
        
        {/* Background Decorative Icon */}
        <div className={cn(
          "absolute top-1/2 -translate-y-1/2 opacity-10",
          isRtl ? "left-8" : "right-8"
        )}>
          <Brain size={240} className="text-[var(--ds-text-discovery,#403294)]" />
        </div>
      </div>

      {/* Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-[var(--ds-border-discovery,#998DD9)] bg-[var(--ds-background-discovery-subtle,#EAE6FF)]/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[var(--ds-text-discovery,#403294)]">
              <BarChart3 className="h-5 w-5" />
              {t('ai.capAnalytics', 'Data Q&A & Analytics')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[var(--ds-text-subtle,#42526E)]">
            {t('ai.capAnalyticsDesc', 'Ask questions about your projects and visitor trends. GateAI pulls real-time data to give you instant answers.')}
          </CardContent>
        </Card>

        <Card className="border-[var(--ds-border-discovery,#998DD9)] bg-[var(--ds-background-discovery-subtle,#EAE6FF)]/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[var(--ds-text-discovery,#403294)]">
              <FileText className="h-5 w-5" />
              {t('ai.capReporting', 'Automated Reporting')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[var(--ds-text-subtle,#42526E)]">
            {t('ai.capReportingDesc', 'Generate custom PDF and CSV reports on the fly. Schedule them for daily or weekly delivery to your inbox.')}
          </CardContent>
        </Card>

        <Card className="border-[var(--ds-border-discovery,#998DD9)] bg-[var(--ds-background-discovery-subtle,#EAE6FF)]/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[var(--ds-text-discovery,#403294)]">
              <QrCode className="h-5 w-5" />
              {t('ai.capBulkQR', 'Bulk QR Operations')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[var(--ds-text-subtle,#42526E)]">
            {t('ai.capBulkQRDesc', 'Create hundreds of QR codes by simply describing your intent. Tag and assign rules with a single sentence.')}
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Status Alert */}
      <div className="rounded-lg border border-[var(--ds-border-discovery,#998DD9)] bg-[var(--ds-background-discovery-subtle,#EAE6FF)]/20 p-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-[var(--ds-text-discovery,#403294)]" />
          <p className="text-sm font-medium text-[var(--ds-text-discovery,#403294)]">
            {showChat 
              ? t('ai.phase1Active', 'GateAI Phase 1 is now active. You are communicating with Gemini 1.5 Flash.')
              : t('ai.readyToChat', 'GateAI is ready to help. Click "Get Started" to initiate a secure session.')
            }
          </p>
        </div>
      </div>
    </div>
  );
}
