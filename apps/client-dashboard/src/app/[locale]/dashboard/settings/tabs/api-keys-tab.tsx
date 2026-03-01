'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from '@gate-access/ui';
import { 
  KeyRound, 
  Plus, 
  Trash2, 
  Copy, 
  Clock, 
  ShieldCheck, 
  Loader2, 
  ExternalLink,
  ShieldAlert,
  Zap,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { csrfFetch } from '@/lib/csrf';

export interface ApiKeyRow {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  createdBy: string;
}

export function ApiKeysTab({ initialKeys }: { initialKeys: ApiKeyRow[] }) {
  const { t } = useTranslation('dashboard');
  const [keys, setKeys] = useState<ApiKeyRow[]>(initialKeys);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyData, setNewKeyData] = useState<{ key: string; name: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async () => {
    const name = prompt(t('settings.apiKeys.promptName', 'Enter a name for this API key:'));
    if (!name) return;

    setIsCreating(true);
    try {
      const res = await csrfFetch('/api/keys', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewKeyData({ key: data.key, name: data.apiKey.name });
        setKeys([
          {
            ...data.apiKey,
            createdAt: data.apiKey.createdAt,
            lastUsedAt: null,
            expiresAt: null,
          },
          ...keys,
        ]);
        toast.success(t('settings.apiKeys.success.generated', 'Secure access token generated.'));
      } else {
        toast.error(data.message || t('settings.apiKeys.errors.createFailed', 'Generation failed.'));
      }
    } catch {
      toast.error(t('common.errors.network', 'Network connectivity issue.'));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('settings.apiKeys.confirmRevoke', 'DANGER: Revoke this API key? All connected systems using this token will lose access immediately.'))) return;
    setDeletingId(id);
    try {
      const res = await csrfFetch(`/api/keys/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setKeys(keys.filter((k) => k.id !== id));
        toast.success(t('settings.apiKeys.success.revoked', 'Access token revoked.'));
      } else {
        toast.error(t('settings.apiKeys.errors.revokeFailed', 'Revocation failed.'));
      }
    } catch {
      toast.error(t('common.errors.network', 'Network connectivity issue.'));
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('settings.apiKeys.success.copied', 'Token copied to secure clipboard.'));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-border/50">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-primary/5">
                <KeyRound className="h-10 w-10 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">{t('settings.apiKeys.title', 'Programmable Access Tokens')}</h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                {t('settings.apiKeys.description', 'Authenticate external nodes and services via the GateFlow REST API.')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="w-full sm:w-auto gap-2 rounded-xl border-border border-2 font-bold uppercase tracking-widest text-[10px] h-11 px-6 shadow-sm">
            <ExternalLink className="h-4 w-4" />
            {t('settings.apiKeys.docs', 'API Specs')}
          </Button>
          <Button onClick={handleCreate} disabled={isCreating} className="w-full sm:w-auto px-8 h-11 rounded-xl bg-primary shadow-lg shadow-primary/10 hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-widest gap-2">
            {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {t('settings.apiKeys.generateKey', 'Generate Token')}
          </Button>
        </div>
      </div>

      {newKeyData && (
        <Card className="rounded-2xl border-2 border-primary/30 bg-primary/[0.03] shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden">
          <CardHeader className="pb-4 pt-6 px-8 border-b border-primary/10">
            <CardTitle className="flex items-center gap-2 text-primary font-black uppercase text-sm tracking-widest">
              <ShieldCheck className="h-6 w-6" />
              {t('settings.apiKeys.newKeyGenerated', 'Secure Vault Transmission')}
            </CardTitle>
            <CardDescription className="text-primary/70 font-medium text-xs">
              {t('settings.apiKeys.copyWarning', 'This secret will be encrypted and hidden immediately after dismissal. Store it in a secure vault.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-xl bg-background border border-primary/20 shadow-inner">
              <code className="flex-1 font-mono text-sm break-all font-black text-foreground select-all sm:border-r border-border pr-4 rtl:sm:border-r-0 rtl:sm:border-l rtl:pl-4">
                {newKeyData.key}
              </code>
              <Button size="sm" onClick={() => copyToClipboard(newKeyData.key)} className="w-full sm:w-auto gap-2 rounded-lg bg-primary font-black uppercase text-[10px] tracking-widest h-10 px-6">
                <Copy className="h-4 w-4" />
                {t('settings.apiKeys.copyToken', 'Copy Secret')}
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 text-[10px] font-black uppercase tracking-widest text-amber-600">
                <ShieldAlert className="h-4 w-4" />
                {t('settings.apiKeys.vaultWarning', 'Leakage of this token compromises your workspace integrity.')}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setNewKeyData(null)} className="mt-6 text-[10px] font-black uppercase text-muted-foreground hover:text-foreground tracking-[0.2em] w-full border border-dashed border-border h-10 rounded-xl">
              {t('settings.apiKeys.dismiss', 'Securely dismiss secret')}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border border-border shadow-sm overflow-hidden bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t('settings.apiKeys.table.identity', 'System Identity')}</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t('settings.apiKeys.table.prefix', 'Header Prefix')}</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t('settings.apiKeys.table.capabilities', 'Capabilities')}</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t('settings.apiKeys.table.telemetry', 'Last Telemetry')}</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-right rtl:text-left">{t('settings.apiKeys.table.actions', 'Terminal')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {keys.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground/20">
                          <KeyRound className="h-8 w-8" />
                        </div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                          {t('settings.apiKeys.empty', 'No programmable access tokens detected.')}
                        </p>
                        <Button variant="ghost" size="sm" onClick={handleCreate} className="text-[10px] font-black uppercase tracking-widest text-primary">
                          Initialize first token
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  keys.map((k) => (
                    <tr key={k.id} className="group hover:bg-muted/10 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-foreground uppercase tracking-tight text-sm flex items-center gap-2">
                             {k.name}
                             <Zap className="h-3 w-3 text-emerald-500" />
                          </span>
                          <span className="text-[9px] font-bold text-muted-foreground/40 flex items-center gap-1.5 uppercase tracking-widest">
                            <Clock className="h-3 w-3" />
                            Registered {new Date(k.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <code className="text-[10px] font-mono font-bold text-primary bg-primary/5 px-2.5 py-1.5 rounded-lg border border-primary/10 tracking-widest">
                          {k.keyPrefix}••••
                        </code>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-1.5">
                          {k.scopes.map((s) => (
                            <Badge key={s} variant="outline" className="text-[8px] font-black uppercase border-border text-muted-foreground bg-muted/10 py-0.5 px-2.5 tracking-widest">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {k.lastUsedAt ? (
                          <div className="flex flex-col">
                             <span className="text-[11px] font-black text-foreground uppercase tracking-tight">{new Date(k.lastUsedAt).toLocaleDateString()}</span>
                             <span className="text-[8px] uppercase font-black text-emerald-500 tracking-widest flex items-center gap-1">
                                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                                Optimal
                             </span>
                           </div>
                         ) : (
                           <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest italic">{t('settings.apiKeys.inactive', 'Dormant')}</span>
                         )}
                      </td>
                      <td className="px-8 py-6 text-right rtl:text-left">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={deletingId === k.id}
                          className="h-10 w-10 rounded-xl text-muted-foreground/20 hover:text-destructive hover:bg-destructive/10 transition-all active:scale-90"
                          onClick={() => handleDelete(k.id)}
                        >
                          {deletingId === k.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="p-6 rounded-2xl bg-muted/20 border border-border flex items-center gap-6">
          <div className="h-12 w-12 rounded-xl bg-background flex items-center justify-center border border-border text-muted-foreground">
              <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-widest text-foreground">Infrastructure Security</p>
              <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                  All tokens are hashed with Argon2id before storage. GateFlow staff cannot recover your tokens. If lost, they must be rotated immediately.
              </p>
          </div>
      </div>
    </div>
  );
}
