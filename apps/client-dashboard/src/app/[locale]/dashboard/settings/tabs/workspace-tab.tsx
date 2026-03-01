'use client';

import { useState, useTransition, useRef } from 'react';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Select,
  Checkbox,
} from '@gate-access/ui';
import { updateWorkspaceSettingsAction, updateRetentionAndPrivacyAction } from '../../workspace/settings/actions';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { 
  Building2, 
  Globe, 
  Save, 
  Sparkles, 
  ExternalLink, 
  AlertTriangle,
  Upload,
  Info,
  Calendar,
  Cloud,
  Shield,
  Lock,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrgData {
  id: string;
  name: string;
  email: string | null;
  domain: string;
  plan: string;
  logoUrl?: string | null;
  createdAt: string;
  requiredIdentityLevel?: number;
  scanLogRetentionMonths?: number | null;
  visitorHistoryRetentionMonths?: number | null;
  idArtifactRetentionMonths?: number | null;
  incidentRetentionMonths?: number | null;
  maskResidentNameOnLandingPage?: boolean;
  showUnitOnLandingPage?: boolean;
}

const PLAN_THEMES: Record<string, { badge: string; border: string; bg: string; text: string }> = {
  FREE: {
    badge: 'bg-muted text-muted-foreground',
    border: 'border-border',
    bg: 'bg-muted/5',
    text: 'text-muted-foreground'
  },
  PRO: {
    badge: 'bg-primary/10 text-primary border-primary/20',
    border: 'border-primary/20',
    bg: 'bg-primary/5',
    text: 'text-primary'
  },
  ENTERPRISE: {
    badge: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    border: 'border-indigo-500/20',
    bg: 'bg-indigo-500/5',
    text: 'text-indigo-500'
  }
};

const IDENTITY_LEVELS = [
  { value: 0, label: 'Level 0 — Name & phone only' },
  { value: 1, label: 'Level 1 — ID photo capture' },
  { value: 2, label: 'Level 2 — ID OCR (coming soon)' },
] as const;

const RETENTION_OPTIONS = [
  { value: 'indefinite', label: 'Keep indefinitely' },
  { value: '6', label: '6 months' },
  { value: '12', label: '12 months' },
  { value: '24', label: '24 months' },
];

export function WorkspaceTab({ org }: { org: OrgData }) {
  const { t } = useTranslation('dashboard');
  const [name, setName] = useState(org.name);
  const [email, setEmail] = useState(org.email || '');
  const [domain, setDomain] = useState(org.domain);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [requiredIdentityLevel, setRequiredIdentityLevel] = useState(org.requiredIdentityLevel ?? 0);
  const [scanLogRetentionMonths, setScanLogRetentionMonths] = useState<string>(
    org.scanLogRetentionMonths != null ? String(org.scanLogRetentionMonths) : ''
  );
  const [visitorHistoryRetentionMonths, setVisitorHistoryRetentionMonths] = useState<string>(
    org.visitorHistoryRetentionMonths != null ? String(org.visitorHistoryRetentionMonths) : ''
  );
  const [idArtifactRetentionMonths, setIdArtifactRetentionMonths] = useState<string>(
    org.idArtifactRetentionMonths != null ? String(org.idArtifactRetentionMonths) : ''
  );
  const [incidentRetentionMonths, setIncidentRetentionMonths] = useState<string>(
    org.incidentRetentionMonths != null ? String(org.incidentRetentionMonths) : ''
  );
  const [maskResidentNameOnLandingPage, setMaskResidentNameOnLandingPage] = useState(
    org.maskResidentNameOnLandingPage ?? false
  );
  const [showUnitOnLandingPage, setShowUnitOnLandingPage] = useState(org.showUnitOnLandingPage ?? true);
  const [retentionPending, setRetentionPending] = useState(false);

  const planTheme = PLAN_THEMES[org.plan] || PLAN_THEMES.FREE;

  function handleSave() {
    if (!name.trim()) return toast.error(t('settings.workspace.errors.nameRequired', 'Workspace name is required.'));
    startTransition(async () => {
      const res = await updateWorkspaceSettingsAction({
        name: name.trim(),
        email: email.trim() || null,
        domain: domain.trim() || null,
      });

      if (res.success) {
        toast.success(t('settings.workspace.success.settingsSaved', 'Workspace configuration updated.'));
      } else {
        toast.error(res.message || t('common.errors.generic', 'Operation failed.'));
      }
    });
  }

  const handleLogoClick = () => logoInputRef.current?.click();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        toast.success(t('settings.workspace.success.logoSimulated', 'Logo successfully stored in ecosystem.'));
        setIsUploading(false);
      }, 1500);
    }
  };

  function handleSaveRetention() {
    setRetentionPending(true);
    updateRetentionAndPrivacyAction({
      requiredIdentityLevel,
      scanLogRetentionMonths: scanLogRetentionMonths ? parseInt(scanLogRetentionMonths, 10) : null,
      visitorHistoryRetentionMonths: visitorHistoryRetentionMonths ? parseInt(visitorHistoryRetentionMonths, 10) : null,
      idArtifactRetentionMonths: idArtifactRetentionMonths ? parseInt(idArtifactRetentionMonths, 10) : null,
      incidentRetentionMonths: incidentRetentionMonths ? parseInt(incidentRetentionMonths, 10) : null,
      maskResidentNameOnLandingPage,
      showUnitOnLandingPage,
    }).then((res) => {
      setRetentionPending(false);
      if (res.success) toast.success(t('settings.workspace.success.settingsSaved', 'Settings saved.'));
      else toast.error(res.message || t('common.errors.generic', 'Operation failed.'));
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Branding & Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-border/50">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-primary/5">
              {org.logoUrl ? (
                <img src={org.logoUrl} alt="Logo" className="object-contain h-full w-full p-2" />
              ) : (
                <Building2 className="h-10 w-10 text-muted-foreground/30 group-hover:text-primary transition-colors" />
              )}
            </div>
            <button 
              onClick={handleLogoClick}
              disabled={isUploading}
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {isUploading ? <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Upload className="h-3.5 w-3.5" />}
            </button>
            <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">{org.name}</h1>
            <div className="flex items-center gap-3">
              <Badge className={cn("rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest", planTheme.badge)}>
                <Sparkles className="h-3 w-3 mr-1.5" />
                {org.plan} Plan
              </Badge>
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                Established {new Date(org.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-xl h-10 px-5 font-bold uppercase tracking-widest text-[10px] gap-2 border-border border-2">
            <ExternalLink className="h-3.5 w-3.5" />
            Public Profile
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isPending} className="px-8 h-11 rounded-xl bg-primary shadow-lg shadow-primary/10 hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-widest gap-2">
            {isPending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save className="h-4 w-4" />}
            {t('common.save', 'Save')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Core Configuration */}
          <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="pb-4 pt-6 px-8 border-b border-border/50 bg-muted/5">
                <CardTitle className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-primary" />
                    {t('settings.workspace.systemParams', 'System Parameters')}
                </CardTitle>
                <CardDescription className="text-xs">{t('settings.workspace.systemParamsDesc', 'Define the fundamental operational parameters of your workspace.')}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{t('settings.workspace.legalName', 'Workspace Descriptor')}</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20 font-bold" />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{t('settings.workspace.billingEmail', 'Administrative Inbox')}</Label>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{t('settings.workspace.whiteLabel', 'White-Label Domain Infrastructure')}</Label>
                        {org.plan !== 'ENTERPRISE' && (
                            <Badge variant="outline" className="text-[8px] font-black tracking-widest border-amber-500/20 text-amber-500 uppercase bg-amber-500/5">Enterprise Only</Badge>
                        )}
                    </div>
                    <div className="relative group">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="e.g. secure.yourdomain.com"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            disabled={org.plan !== 'ENTERPRISE'}
                            className="pl-11 h-11 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20 disabled:opacity-50 disabled:bg-muted/20"
                        />
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                        {t('settings.workspace.domainNotice', 'Connect a custom SSL-secured domain to fully white-label your QR codes, guest portals, and automated communications.')}
                    </p>
                </div>
            </CardContent>
          </Card>

          {/* Privacy & Data Retention */}
          <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="pb-4 pt-6 px-8 border-b border-border/50 bg-muted/5">
              <CardTitle className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                {t('settings.workspace.privacyRetention', 'Privacy & Data Retention')}
              </CardTitle>
              <CardDescription className="text-xs">
                {t('settings.workspace.privacyRetentionDesc', 'Visitor identity levels, retention policies, and resident-facing options. After X months, data is eligible for deletion per policy.')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label htmlFor="identity-level" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                  {t('settings.workspace.identityLevel', 'Default visitor identity level')}
                </Label>
                <Select
                  id="identity-level"
                  value={String(requiredIdentityLevel)}
                  onChange={(e) => setRequiredIdentityLevel(parseInt(e.target.value, 10))}
                  className="h-11 rounded-xl"
                >
                  {IDENTITY_LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </Select>
                <p className="text-[10px] text-muted-foreground">
                  {t('settings.workspace.identityLevelHint', 'Gates can override. Level 1 requires ID photo capture at scan.')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                    {t('settings.workspace.scanLogRetention', 'Scan log retention (months)')}
                  </Label>
                  <Select
                    id="scan-log-retention"
                    value={scanLogRetentionMonths || 'indefinite'}
                    onChange={(e) => setScanLogRetentionMonths(e.target.value === 'indefinite' ? '' : e.target.value)}
                    className="h-11 rounded-xl"
                  >
                    {RETENTION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incident-retention" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                    {t('settings.workspace.incidentRetention', 'Incident retention (months)')}
                  </Label>
                  <Select id="incident-retention" value={incidentRetentionMonths || 'indefinite'} onChange={(e) => setIncidentRetentionMonths(e.target.value === 'indefinite' ? '' : e.target.value)} className="h-11">
                    {RETENTION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artifact-retention" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                    {t('settings.workspace.idArtifactRetention', 'ID artifact retention (months)')}
                  </Label>
                  <Select id="artifact-retention" value={idArtifactRetentionMonths || 'indefinite'} onChange={(e) => setIdArtifactRetentionMonths(e.target.value === 'indefinite' ? '' : e.target.value)} className="h-11">
                    {RETENTION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitor-retention" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                    {t('settings.workspace.visitorHistoryRetention', 'Visitor history retention (months)')}
                  </Label>
                  <Select id="visitor-retention" value={visitorHistoryRetentionMonths || 'indefinite'} onChange={(e) => setVisitorHistoryRetentionMonths(e.target.value === 'indefinite' ? '' : e.target.value)} className="h-11">
                    {RETENTION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                  <User className="h-3.5 w-3.5" />
                  {t('settings.workspace.residentOptions', 'Resident-facing options')}
                </Label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="maskResidentName"
                      checked={maskResidentNameOnLandingPage}
                      onChange={(e) => setMaskResidentNameOnLandingPage(e.target.checked)}
                    />
                    <Label htmlFor="maskResidentName" className="cursor-pointer text-sm">
                      {t('settings.workspace.maskResidentName', 'Mask resident name on guest landing page')}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="showUnitOnLanding"
                      checked={showUnitOnLandingPage}
                      onChange={(e) => setShowUnitOnLandingPage(e.target.checked)}
                    />
                    <Label htmlFor="showUnitOnLanding" className="cursor-pointer text-sm">
                      {t('settings.workspace.showUnitOnLanding', 'Show unit number on guest landing page')}
                    </Label>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSaveRetention}
                disabled={retentionPending}
                className="rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[10px] gap-2"
              >
                {retentionPending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Lock className="h-3.5 w-3.5" />}
                {t('common.save', 'Save')}
              </Button>
            </CardContent>
          </Card>

          {/* Infrastructure Health / Danger Zone */}
          <Card className="border-destructive/20 rounded-2xl bg-destructive/[0.02] shadow-sm overflow-hidden border-t-4 border-t-destructive">
            <CardHeader className="pb-4 pt-6 px-8 border-b border-destructive/10">
                <CardTitle className="flex items-center gap-2 text-sm font-black text-destructive uppercase tracking-widest">
                    <AlertTriangle className="h-4 w-4" />
                    {t('settings.workspace.terminalActions', 'Terminal Operations')}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-xl border border-destructive/10 bg-background shadow-sm ring-1 ring-destructive/[0.03]">
                    <div className="space-y-1 text-center sm:text-left">
                        <p className="text-sm font-black text-destructive uppercase tracking-tight">{t('settings.workspace.deprovision', 'Deprovision Node')}</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed max-w-sm">
                            {t('settings.workspace.deprovisionDesc', 'Permanently purge all telemetry, projects, and access keys. This action cannot be reversed.')}
                        </p>
                    </div>
                    <Button
                        variant="destructive"
                        className="w-full sm:w-auto rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 px-8 shadow-lg shadow-destructive/10"
                        onClick={() => {
                            if (confirm(t('common.confirmTerminal', 'DANGER: Confirm permanent node deprovisioning?'))) {
                                toast.error(t('common.errors.accessDenied', 'Action restricted to primary node owner.'));
                            }
                        }}
                    >
                        {t('settings.workspace.purge', 'Purge Node')}
                    </Button>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <CardHeader className="p-6 pb-4 border-b border-border/50 bg-muted/5">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {t('settings.workspace.temporalData', 'Temporal Benchmarks')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-muted-foreground/60">Node Created</span>
                            <span className="text-foreground">{new Date(org.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-muted-foreground/60">Uptime Metric</span>
                            <span className="text-emerald-500">99.99%</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-muted-foreground/60">Geo-Region</span>
                            <span className="text-foreground">Cloud-Standard</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-tight text-primary">Upgrade Insight</p>
                </div>
                <p className="text-[11px] leading-relaxed text-primary/80 font-medium">
                    {t('settings.workspace.upgradeInsight', 'Enterprise nodes unlock high-frequency scan APIs, bespoke SLAs, and advanced data residency controls.')}
                </p>
                <Button variant="ghost" className="w-full text-primary hover:bg-primary/10 text-[10px] font-black uppercase tracking-widest">
                    View Enterprise Features
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
